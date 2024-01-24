# Stock Price View Application 📈
https://stockapp-h3z1.onrender.com (use POSTMAN)
### This project is a stock market api built with Node.js, Express and mongoDB. It allows users to retrieve information about stocks, track favorites, and view price history.


# Requirements and Features 📑

The Stock Market App comes with a set of requirements and features that enhance its functionality and usability. Before getting started, ensure that your environment meets the specified requirements.

## Requirements

- **Node.js:** The application is built on Node.js, and it requires Node.js version 12 or higher. You can download it from [https://nodejs.org/](https://nodejs.org/).

- **npm (Node Package Manager):** npm is the default package manager for Node.js. It is used to manage project dependencies. You can install npm along with Node.js.

## Features

### 1. User Authentication

- **Description:** User authentication is implemented to secure certain functionalities of the application. Users need to authenticate to access features like adding stocks to favorites.

### 2. Stock Data Retrieval

- **Description:** The application fetches real-time stock data, providing users with up-to-date information on top-performing stocks and their price history.

### 3. Favorites Management

- **Description:** Users can maintain a list of favorite stocks. They can add or remove stocks from their favorites, allowing for a personalized stock tracking experience.

### 4. Top 10 Stocks

- **Description:** The application offers an endpoint to retrieve information about the top 10 stocks. This feature enables users to quickly identify high-performing stocks.

### 5. Price History

- **Description:** Users can view the historical price data of a specific stock by accessing the price history endpoint. This feature aids in analyzing a stock's performance over time.

## Additional Notes

- **Middleware:** The application uses middleware for user authentication (`protectRoute` in `authController.js`). Ensure that the middleware is configured correctly for secure access to protected endpoints.

- **Port Configuration:** By default, the application runs on [http://localhost:3000](http://localhost:3000). You can customize the port by modifying the `app.listen` function in the `app.js` file.

Make sure to review the installation guide and endpoint documentation for a seamless setup and exploration of the Stock Market App.
 

## Installation

1. **Clone the Repository:**
   - Open your terminal and run the following command:

     ```bash
     git clone https://github.com/yourusername/stockApp.git
     ```

   - Change into the project directory:

     ```bash
     cd stockApp
     ```

2. **Install Dependencies:**
   - Run the following command to install the required Node.js packages:

     ```bash
     npm install
     ```
3. #### make sure to add your mongodbURL and JWT_KEY (you can give any random string) under the .env file.

4. **Start the Application:**
   - Run the following command to start the application:

     ```bash
     npm start
     ```
5. #### after succcefully running, wait for few minutes since the data from BhavCopy has been sent on mongoDB, mongodb will take some minute to process the whole uploaded data. Then you are ready to Go



## Stock Routes Explanation 📈

The `stockRouter` in Stock Market App is responsible for handling various endpoints related to stock data. Let's break down each endpoint and its functionality.

## Endpoints

### 1. `/stock/top10`

- **HTTP Method:** GET
- **Description:** Retrieve the top 10 stocks.
- **Controller Function:** `top10Stocks` in `stockController.js`

### 2. `/stock/price-history/:id`

- **HTTP Method:** GET
- **Description:** Retrieve the price history of a specific stock by its SC_CODE (stockCode).
- **Controller Function:** `priceHistory` in `stockController.js`

### 3. `/stock/stockinfo/:name`

- **HTTP Method:** GET
- **Description:** Get information about a stock by its name.
- **Controller Function:** `getStockByName` in `stockController.js`

### 4. `/stock/favourites`

- **HTTP Method:** GET
- **Description:** Get the list of favorite stocks.
- **Middleware:** will give successful response only when user will be loggedIn.`protectRoute` from `authController.js`
- **Controller Function:** `getFavouriteStocks` in `stockController.js`

### 5. `/stock/favourites/add`

- **HTTP Method:** POST
- **Description:** Add a stock to the list of favorites.
- **Middleware:** will give successful response only when user will be loggedIn.`protectRoute` from `authController.js`
- **Controller Function:** `addToFavourite` in `stockController.js`
- **Request Body Example:**
  ```json
  {
    "CODE": 540530
  }

### 6. `/stock/favourites/:id`

- **HTTP Method:** DELETE
- **Description:** Remove a stock from the list of favorites, id   is the SC_CODE (stockCode).
- **Middleware:** `protectRoute` from `authController.js`
- **Controller Function:** `removeFromFavorites` in `stockController.js`

## Usage

1. **Retrieve Top 10 Stocks:**
   - Endpoint: `/stock/top10`
   - Method: GET

2. **Retrieve Price History:**
   - Endpoint: `/stock/price-history/:id`
   - Method: GET
   - Example: `/stock/price-history/540811`

3. **Get Stock Information by Name:**
   - Endpoint: `/stock/stockinfo/:name`
   - Method: GET
   - Example: `/stock/stockinfo/tata`

4. **Get Favorite Stocks:**
   - Endpoint: `/stock/favourites`
   - Method: GET

5. **Add to Favorites:**
   - Endpoint: `/stock/favourites/add`
   - Method: POST
   - Example: `/stock/favourite/add`
- in request Body
   ```json 
    {
        "CODE": 540530
    }

6. **Remove from Favorites:**
   - Endpoint: `/stock/favourites/:id`
   - Method: DELETE
   - Example: `/stock/favourites/456`

**Note:** Some endpoints require user authentication (`protectRoute` middleware) to access certain functionalities.

## User Routes explanation 🚀

The `userRouter` in our Stock Market App is responsible for handling user-related endpoints, such as user registration, login, and logout. Let's break down each endpoint and its functionality.

## Endpoints

### 1. `/user/signup`

- **HTTP Method:** POST
- **Description:** Register a new user.
- **Controller Function:** `signupUser` in `authController.js`
- **Request Body Example:**
  ```json
  {
    "name": "Robin Kumar",
    "email": "robin@gmail.com",
    "password": "123678432",
    "confirmPassword": "123678432"
  }

### 2. `/user/login`

- **HTTP Method:** POST
- **Description:** login a user.
- **Controller Function:** `login` in `authController.js`
- **Request Body Example:**
  ```json
  {
    "email": "robin@gmail.com",
    "password": "123678432",
  }

### 3. `/user/logout`

- **HTTP Method:** GET
- **Description:** logout a user.
- **Controller Function:** `logout` in `authController.js`


## Deployment 🌐

The Stock Market App has been deployed and is accessible online. You can visit the deployed version using the following link:
### use postman
https://stockapp-h3z1.onrender.com

