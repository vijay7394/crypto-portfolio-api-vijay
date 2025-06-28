const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ status: false, message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = {
			userId: decoded.userId,
		};
		next();
	} catch (err) {
		return res.status(401).json({ status: false, message: "Token expired or invalid" });
	}
};