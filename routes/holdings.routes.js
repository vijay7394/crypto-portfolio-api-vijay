const Router = require('express').Router();
const verifyJWT = require("../middlewares/verifyJWT");
const validate  = require('../middlewares/validator');
const {buy,sell,getHoldings}  = require('../controllers/holding.controllers');

Router.post('/buy', verifyJWT, validate.validateBuy, validate.userValidationResult, buy);   //Buy Routes
Router.post('/sell', verifyJWT, validate.validateSell, validate.userValidationResult, sell); //Sell Routes
Router.get('/', verifyJWT, getHoldings); //Get wallet Holding

module.exports = Router;