const Router = require('express').Router();
const verifyJWT = require("../middlewares/verifyJWT");
const {getPrices , getPortfolio} = require('../controllers/market.controllers');

Router.get('/prices', getPrices);   // get market price crypto to convert usd
Router.get('/portfolio', verifyJWT, getPortfolio); //get wallet funds and convert total and value usd in indivatual

module.exports = Router;
