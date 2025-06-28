const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not set in environment variables");
	}
	
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
		algorithm: 'HS256'
	});
};

module.exports = { generateToken };