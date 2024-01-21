const express = require('express');
const stockRouter = express.Router();
const { getStockByName, top10Stocks, addToFavourite, getFavouriteStocks, priceHistory , removeFromFavorites} = require('../controller/stockController');

stockRouter.route('/top10').get(top10Stocks);

stockRouter.route('/favourites')
.get(getFavouriteStocks);

stockRouter.route('/favourites/add')
.post(addToFavourite);

stockRouter.route('/favourites/:id')
.delete(removeFromFavorites);

stockRouter.route('/price-history/:stockName')
.get(priceHistory);

stockRouter.route('/:name').get(getStockByName);

module.exports = stockRouter;
