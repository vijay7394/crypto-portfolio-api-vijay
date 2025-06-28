const { check, validationResult } = require('express-validator');
const Userschema = require('../models/user.model');
const helper = require('../helper/common_helper');

exports.userValidationResult = (req, res, next) => {
	try {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			const error = result.array()[0].msg;
			return res.status(422).json({
				status: false,
				message: error
			});
		} else {
			next();
		}
	} catch (err) {
		console.error("Validation middleware error:", err);

		return res.status(500).json({
			status: false,
			message: "Server not responding",
			error: err.message
		});
	}
};


// Register Validation
exports.register = [
	check('username').trim().not().isEmpty().withMessage("Username is required").isAlphanumeric().withMessage("Username should be in alphanumeric").isLength({
		min: 3,
		max: 15
	}).withMessage("username must be between 3 and 15 characters").custom(async (username) => {
      const existingUser = await Userschema.findOne({ username: username.toLowerCase() }).select(username);
      if (existingUser) {
        throw new Error("Username already exists");
      }
      return true;
    }),
	check('email')
	.trim()
	.notEmpty().withMessage("Email address is required")
	.isEmail().withMessage("Please enter valid email address")
	.custom(async (value) => {
		const emailCheck = await helper.checkValidEmail(value);
		if (emailCheck === true) {
		throw new Error("Please enter valid email address");
		}

		const user = await Userschema.findOne({ email: value.toLowerCase() }).select("email");
		if (user) {
		throw new Error("Email already exists");
		}

		return true;
	}),

	check('phone').trim().not().isEmpty().withMessage("Mobile number is required").isNumeric().withMessage("Mobile field must contain only Numerical characters").isLength({
		min: 10,
		max: 12
	}).withMessage("Phone number must be between 10 and 12 characters").custom(async (phone) => {
      const existingPhone = await Userschema.findOne({ phone }).select(phone);
      if (existingPhone) {
        throw new Error("Phone number already exists");
      }
      return true;
    }),

	check('password').trim().not().isEmpty().withMessage("Password is required").isLength({
		min: 7
	}, {
		max: 12
	}).withMessage('Password should be 7 to 12 characters').isStrongPassword({
		minUppercase: 1,
		minLowercase: 1,
		minSymbols: 1,
		minLength: 7,
		minNumbers: 1
	}).withMessage('Password must contain minimum 1 uppercase , minimum 1 lowercase , minimum 1 special character and 1 numeric value!').not().isEmail().withMessage('Try different password'),
	check('confirmpassword').trim().not().isEmpty().withMessage("Confirm password is required").custom((value, {
			req
		}) =>
		(value === req.body.password)).withMessage("Please enter the same password"),
];

// Login Validation
exports.login = [
	check('email').trim().not().isEmpty().withMessage("Email is required").isEmail().withMessage("Please enter valid email address").custom(async (value) => {
		let emailCheck = await helper.checkValidEmail(value)
		if (emailCheck == true) {
			throw new Error('Please enter valid email')
		}
		return true
	}),
	check('password').trim().not().isEmpty().withMessage("Password is required"),
]

// Buy
exports.validateBuy = [
	check('symbol').trim().notEmpty().withMessage("Symbol is required").isIn(['BTC', 'ETH', 'TRX', 'BNB', 'USDT']).withMessage("Invalid cryptocurrency symbol"),
	check('amount').notEmpty().withMessage("Amount is required").custom((value) => {
    const floatVal = parseFloat(value);
	const valueStr = value.toString();
    if (isNaN(floatVal)) {
      throw new Error("Amount must be a valid number");
    }
    if (floatVal <= 0.0001 || floatVal > 1000000) {
      throw new Error("Amount must be between 0.0001 and 1,000,000");
    }
    if (valueStr.includes('.') && valueStr.split('.')[1].length > 8) {
      throw new Error("Amount cannot have more than 8 decimal places");
    }

    return true;
  })
]

// Sell
exports.validateSell = [
	check('symbol').trim().notEmpty().withMessage("Symbol is required").isIn(['BTC', 'ETH', 'TRX', 'BNB', 'USDT']).withMessage("Invalid cryptocurrency symbol"),
	check('amount').notEmpty().withMessage("Amount is required").withMessage("Amount is required").custom((value) => {
    const floatVal = parseFloat(value);
	const valueStr = value.toString();
    if (isNaN(floatVal)) {
      throw new Error("Amount must be a valid number");
    }
    if (floatVal <= 0.0001 || floatVal > 1000000) {
      throw new Error("Amount must be between 0.0001 and 1,000,000");
    }
    if (valueStr.includes('.') && valueStr.split('.')[1].length > 8) {
      throw new Error("Amount cannot have more than 8 decimal places");
    }

    return true;
  })
]