const browser 	= require('browser-detect');
const bcrypt = require('bcryptjs');
const Userschema = require('../models/user.model');
const Holding  = require('../models/holding.model');
const clean = require('../middlewares/xss.clean');            
const { generateToken } = require('../utils/jwt.util');


//Register function
exports.register = async (req, res) => {
	try {
		let params = req.body;

		var ip = req.socket.remoteAddress;
		var username = params.username ? await clean.removeXss(params.username) : '';
		var email = params.email ? await clean.removeXss(params.email.toLowerCase()) : '';
		var phone = params.phone ? await clean.removeXss(params.phone.toString()) : 0;
		var password = params.password ? await clean.removeXss(params.password) : '';
		let Browser = browser(req.headers['user-agent']).name ? browser(req.headers['user-agent']).name : "unknown";
		let os = browser(req.headers['user-agent']).os ? browser(req.headers['user-agent']).os : "unknown";

		// Create user object
		const userObj = {
			username,
			email,
			phone,
			password,
			ip,
			browser: Browser,
			os,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		// Save to DB using .then().catch() style
		Userschema.create(userObj)
			.then(user => {
				return res.status(200).json({status: true,message: 'User registered successfully. Kindly login to continue.'});
			})
			.catch(err => {
				console.error('User creation failed:', err);
				return res.status(500).json({status: false,message: 'Failed to register user',error: err.message});
			});

	} catch (err) {
		console.error('Unexpected error:', err);
		return res.status(500).json({status: false,message: 'Server not responding'});
	}
};

//Login Function
exports.login = async (req, res) => {
	
    const params = req.body;
	try {

		// Find user by username
		const user = await Userschema.findOne({email: params.email});
		if (!user) {
			return res.status(400).json({status: false,message: 'User not found'});
		}

		// Check is_active
		if (user.is_active !== 1) {
			return res.status(403).json({status: false,message: 'Account is deactivated. Please contact admin.'});
		}

		// Check is_verified
		if (user.is_verified !== 1) {
			return res.status(403).json({status: false,message: 'Account is not verified. Please verify your account.'});
		}

		// Compare password
         if (!user || !(await user.comparePassword(params.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

		// Generate JWT Token
		const token = generateToken({userId: user.userId,username: user.username});
		return res.status(200).json({status: true, message: 'Login successful',token });

	} catch (err) {
		console.error('Login error:', error);
		return res.status(500).json({ status: false, message: 'Server error',error : err.message });
	}
};