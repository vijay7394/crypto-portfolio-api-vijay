# crypto-portfolio-api-vijay
cryptocurrency portfolio management systems

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

---

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
├── .env.example           # Sample environment file
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
    .env
    ecosystem.config.js

- Build and run the project
```
    # Install PM2 globally (if not already installed)
    npm install -g pm2

    # Start the app using the ecosystem config file
    pm2 start ecosystem.config.js -- env development

    # Start the app using the ecosystem config file in production
    pm2 start ecosystem.config.js -- env production


    # Show list of running apps
    pm2 list

    # View logs
    pm2 logs

    # Restart the app (if needed)
    pm2 restart ecosystem.config.js

    # Stop the app
    pm2 stop ecosystem.config.js

```




---
### 1. Clone Repo
```bash
git clone https://github.com/vijay7394/crypto-portfolio-api-vijay.git
cd crypto-portfolio-api-vijay


### 2. Install Package
npm install

---

### 3. gitinore file placed in root path
.env
ecosystem.config.js

