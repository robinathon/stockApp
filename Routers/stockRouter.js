const express = require('express');
const stockRouter = express.Router();
const { getStockByName, top10Stocks, addToFavourite, getFavouriteStocks, priceHistory , removeFromFavorites} = require('../controller/stockController');
const {protectRoute} = require('../controller/authController');
stockRouter.route('/top10').get(top10Stocks);


stockRouter.route('/price-history/:id')
.get(priceHistory);

stockRouter.route('/stockinfo/:name').get(getStockByName);

stockRouter.use(protectRoute);
stockRouter.route('/favourites')
.get(getFavouriteStocks);

stockRouter.route('/favourites/add')
.post(addToFavourite);

stockRouter.route('/favourites/:id')
.delete(removeFromFavorites);
module.exports = stockRouter;
