const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const createError = require('http-errors');
const rateLimit = require('express-rate-limit');
const xss = require("xss");
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const connectDB = require('./config/database');

const app = express();
//Connect MongoDB
connectDB();

const port = process.env.PORT || 5000;

app.use(helmet());   //Security headers
app.use(cors({
  origin: process.env.ORGINS,   // Origin
  credentials: true
}));

//Rate Limiting prevent brute force
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests, try again later."
}));

//Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(mongoSanitize());   // Prevent NoSQL injection
//Logging
app.use(morgan('dev'));
//Cookies
app.use(cookieParser());

//Static files
app.use(express.static(path.join(__dirname, 'public')));
//Compression
app.use(compression());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/holdings', require('./routes/holdings.routes'));
app.use('/api/market', require('./routes/market.routes'));

// 404 Handler
app.use((req, res, next) => {
  next(createError(404, 'API endpoint not found'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: false,
    code: err.status || 500,
    message: err.message || 'Internal Server Error'
  });
});

// Server Listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
