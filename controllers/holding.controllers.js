const Holding = require("../models/holding.model");
const clean = require('../middlewares/xss.clean');
const coins = require("../constants/coins");
const { serialize, unserialize } = require("../utils/serializer");


exports.buy = async (req, res) => {
  const { symbol, amount } = req.body;
  const userId = req.user.userId;

  // Validate symbol and amount
  if (!coins[symbol]) {
    return res.status(400).json({ status: false, message: "Invalid coin symbol" });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ status: false, message: "Invalid amount" });
  }

  try {
    let holding = await Holding.findOne({ user_id: userId });
    let balances = holding ? unserialize(holding.data) : {};

    if (typeof balances !== "object" || balances === null) {
      balances = {};
    }

    const prev = parseFloat(balances[symbol] || 0);
    const newAmount = parseFloat((prev + parsedAmount).toFixed(8));
    balances[symbol] = newAmount;

    const serialized = serialize(balances);

    if (holding) {
      holding.data = serialized;
      await holding.save();
    } else {
      holding = await Holding.create({ user_id: userId, data: serialized });
    }

    return res.status(200).json({ status: true, message: "Buy successful", data: balances});
  } catch (err) {
    return res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};



exports.sell = async (req, res) => {
  try {
    const Params = req.body;

    const userId = req.user.userId;
    const symbol = Params.symbol ? await clean.removeXss(Params.symbol.toUpperCase()) : '';
    const amount = Params.amount ? parseFloat(Params.amount) : 0;

    if (!symbol || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ status: false, message: "Invalid symbol or amount" });
    }

    let holding = await Holding.findOne({ user_id: userId });

    if (!holding || !holding.data) {
      return res.status(404).json({ status: false, message: "No holdings found for this user" });
    }

    const current = unserialize(holding.data);
    const existing = parseFloat(current[symbol] || 0);

    if (existing < amount) {
      return res.status(409).json({ status: false, message: "Insufficient balance" });
    }

    const remaining = parseFloat((existing - amount).toFixed(8));

    current[symbol] = remaining;

    holding.data = serialize(current);
    await holding.save();
    const formatted = {};
    for (const [key, val] of Object.entries(current)) {
      formatted[key] = parseFloat(val).toFixed(8);
    }
    return res.status(200).json({ status: true, message: "Sell Swap successful", data: formatted});

  } catch (err) {
    return res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};


// Holdings

exports.getHoldings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const allowedSymbols = Object.keys(coins);

    // Initialize balance structure
    const formatted = {};
    allowedSymbols.forEach(symbol => {
      formatted[symbol] = parseFloat((0).toFixed(8));
    });

    const holding = await Holding.findOne({ user_id: userId });

    if (holding) {
      const data = unserialize(holding.data);

      // Replace with actual amounts available
      for (const [symbol, amount] of Object.entries(data)) {
        if (allowedSymbols.includes(symbol)) {
          formatted[symbol] = parseFloat(amount).toFixed(8);
        }
      }
    }

    return res.status(200).json({ status: true, message: "", holdings_balance: formatted });

  } catch (err) {
    return res.status(500).json({status: false, message: "Internal server error", error: err.message});
  }
};
