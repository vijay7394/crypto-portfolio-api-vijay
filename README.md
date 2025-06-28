# Crypto Portfolio Management API

This is a secure backend API to manage crypto holdings, simulate buy/sell, and fetch live prices via CoinGecko.

---


## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Cache**: Redis
- **Authentication**: JWT, Bcrypt
- **Security**: Helmet, express-rate-limit, xss-clean, express-mongo-sanitize
- **Process Manager**: PM2


## Version
- **node**: v22.16.0
- **Npm**: 10.9.2

## 📦 Key Features

| Feature | Description |
|--------|-------------|
| ✅ JWT Auth | Register/Login securely using JWT |
| ✅ Buy/Sell | Simulate holdings using serialized storage |
| ✅ Real-Time Pricing | CoinGecko API for live USD prices |
| ✅ Redis Cache | Prices cached for 60s for speed & efficiency |
| ✅ Portfolio Summary | Breakdown of coin balance, value & price |
| ✅ XSS & NoSQL Injection Safe | Fully protected API |
| ✅ Rate Limited | Blocks brute force attacks |
| ✅ Runs with PM2 | Easily managed in dev/prod |

---

## 📁 Project Structure
```bash
crypto-portfolio-api-vijay/
├── app.js                 # Main server entry
├── config/                # MongoDB config
├── constants/coins.js     # Supported cryptocurrencies
├── controllers/           # Logic handlers
├── middlewares/           # JWT auth, validation, etc.
├── models/                # Mongoose models
├── routes/                # API route groups
├── utils/                 # Helpers (redis, serializer)
├── public/                # Static files (optional)
├── ecosystem.config.js    # PM2 config (ignored in Git)
├── README.md              # This file
├── package.json

```



## 🛠 Setup Instructions

- Clone the repository
```
git clone  <git lab template url> <project_name>
```

- Install dependencies
```
cd <project_name>
npm install
```

- gitignore file placed in root path

  ecosystem.config.js file in root path create and paste the code
```
module.exports = {
	apps: [{
		name: "Crypto Portfolio Api",
		script: "./app.js",
		watch: '.',
		ignore_watch: ["logs/*"],
		log: './logs/combained.outerr.log',
		err_file: "./logs/error.log",

		env_production: {
			NODE_ENV: "production",
			DATABASE: "mongodb://<live_host>:<live_port>/Crypto-Portfolio",  //Live Secret Key
			PORT: 8080,
			REDIS_HOST: "redis://<live_host>:<live_port>",
			CGECKO_API: "https://api.coingecko.com/api/v3",
			JWT_SECRET: "your_jwt_secret", //Live Secret Key
			JWT_EXPIRE: "1h",
			ORGINS: ['http://<live_frontend_host>:<live_frontend_port>'] //set origin
		},
		env_development: {
			NODE_ENV: "development",
			DATABASE: "mongodb://localhost:27017/Crypto-Portfolio", 
			PORT: 8050,
			REDIS_HOST: "redis://localhost:6379", //Live Redis URL
			CGECKO_API: "https://api.coingecko.com/api/v3",
			JWT_SECRET: "your_jwt_secret",  
			JWT_EXPIRE: "1h",
			ORGINS: ['http://localhost:8000'] //set origin
		}
	}]
}
```


## Install Redis:

### Ubuntu/Debian
    sudo apt install redis  
    
### macOS
    brew install redis

### Run Redis
    redis-server               

## Windows:
Download from: https://github.com/microsoftarchive/redis/releases

Run redis-server.exe from extracted folder.

## Check Connection
   
    redis-cli ping
 

## Run the project in Development
```
    # Install PM2 globally (if not already installed)
    npm install -g pm2

    # Start the app using the ecosystem config file local envirainment
    pm2 start ecosystem.config.js --env development

    # View logs and server start logs
    pm2 logs 0

    # Restart the app (if needed)
    pm2 restart ecosystem.config.js --env development

    # Stop the app
    pm2 stop ecosystem.config.js --env development

    # All processes and PM2's memory will be cleared
    pm2 kill

    # Clear Log Files
    pm2 flush

```
- Backend Run Local environment:
```
     http://localhost:8050
```

## 🔗 API Endpoints (Summary)

| Method | Endpoint                 | Description             |
|--------|--------------------------|-------------------------|
| POST   | `/api/auth/register`     | Register a new user     |
| POST   | `/api/auth/login`        | User login with JWT     |
| POST   | `/api/holdings/buy`      | Buy cryptocurrency      |
| POST   | `/api/holdings/sell`     | Sell cryptocurrency     |
| GET    | `/api/holdings`          | Get user's holdings     |
| GET    | `/api/market/prices`     | Get live coin prices    |
| GET    | `/api/market/portfolio`  | Get user portfolio      |


### After Login HEADER:
- Authorization: Bearer <your_token>

- Content-Type: application/json

### 🧪 Body Type (Important)

- Select `**raw**` in Postman Body tab
- Choose `**JSON**` from the dropdown (right side of "Text")

Example:  /api/holdings/buy

```json
{
  "symbol": "BTC",
  "amount": 0.001
}
```

### Handled:
- 200 OK
- 404 Not Found
- 500 Internal
- 401 Unauthorized
- 400 Bad Request
- 422 Unprocessable Entity
