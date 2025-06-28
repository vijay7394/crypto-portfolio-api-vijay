const { createClient } = require('redis');

const redis = createClient({
	url: process.env.REDIS_HOST
});

async function initRedis() {
	try {
		await redis.connect();
		console.log("Redis connected");
		// connection test ping
		const pong = await redis.ping();
		if (pong === 'PONG') {
			console.log("Redis ping success");
		} else {
			console.log("Redis ping failed:", pong);
		}
	} catch (err) {
		console.error("Redis connection or ping failed:", err.message);
	}
}

initRedis();

module.exports = redis;