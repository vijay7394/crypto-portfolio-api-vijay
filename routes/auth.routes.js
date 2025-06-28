const express = require('express');
const router = express.Router();
const validate  = require('../middlewares/validator');
const { register, login } = require('../controllers/auth.controllers');


router.post('/register', validate.register,validate.userValidationResult,register); // Register Routes 
router.post('/login', validate.login,validate.userValidationResult,login); // Login Routes


module.exports = router;
