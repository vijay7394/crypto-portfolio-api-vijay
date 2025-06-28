const axios = require("axios");
const redis = require("../utils/redisClient");
const { unserialize } = require("../utils/serializer");
const clean = require('../middlewares/xss.clean');
const COINS = require("../constants/coins");
const Holding = require("../models/holding.model");


exports.getPrices = async (req, res) => {
	const cacheKey = "crypto_prices";

	try {
		// Try Redis cache
		const cached = await redis.get(cacheKey);
		if (cached) {
			const parsed = JSON.parse(cached);
			const formatted = Object.fromEntries(
				Object.entries(parsed).map(([key, val]) => [key, { usd: Number(val.usd).toFixed(2) }])
			);
			return res.status(200).json({ status: true, message: "", data: formatted });
		}

		// Fetch from CoinGecko
		const response = await axios.get(process.env.CGECKO_API + "/simple/price", {
			params: {
				ids: Object.values(COINS).map(c => c.id).join(","),
				vs_currencies: "usd"
			}
		});

		const prices = response.data;
		const formatted = Object.fromEntries(
			Object.entries(prices).map(([key, val]) => [key, { usd: Number(val.usd).toFixed(2) }])
		);

		// Cache formatted prices for 60 seconds
		await redis.setEx(cacheKey, 60, JSON.stringify(formatted));

		return res.status(200).json({ status: true, message: "", data: formatted });

	} catch (err) {
		const isExternalError = err.isAxiosError || err.message.includes("ECONNREFUSED");

		return res.status(isExternalError ? 502 : 500).json({ status: false, message: "Failed to fetch prices",
			error: process.env.NODE_ENV === "development" ? err.message : undefined
		});
	}
};




exports.getPortfolio = async (req, res) => {
	const userId = req.user.userId;
	const cacheKey = "crypto_prices";

	try {
		const holdingDoc = await Holding.findOne({user_id: userId}).select("data");

		const holdings = holdingDoc ? unserialize(holdingDoc.data) : {};

		// Try Redis first
		let pricesRaw = await redis.get(cacheKey);
		let prices;

		if (pricesRaw) {
			prices = JSON.parse(pricesRaw);
		} else {
			// Fetch only once and set Redis
			const ids = Object.values(COINS).map(c => c.id).join(",");
			const {
				data
			} = await axios.get(`${process.env.CGECKO_API}/simple/price`, {
				params: {
					ids,
					vs_currencies: "usd"
				}
			});
			prices = data;
			redis.setEx(cacheKey, 60, JSON.stringify(prices));
		}

		// Build portfolio
		let totalUSD = 0;
		const portfolio = Object.entries(COINS).map(([symbol, {
			id,
			name
		}]) => {
			const amount = parseFloat(holdings[symbol] || 0);
			const priceUSD = prices?.[id]?.usd || 0;
			const valueUSD = amount * priceUSD;

			totalUSD += valueUSD;

			return {
				symbol,
				name,
				amount,
				market_price_usd: priceUSD.toFixed(2),
				value_usd: valueUSD.toFixed(2)
			};
		});

		return res.status(200).json({status: true, message: "Portfolio summary",
			data: {
				total_value_usd: totalUSD.toFixed(2),
				portfolio
			}
		});

	} catch (err) {
		return res.status(500).json({ status: false, message: "Failed to fetch portfolio",
			error: process.env.NODE_ENV === "development" ? err.message : undefined
		});
	}
};
