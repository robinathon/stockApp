const stockModel = require("../model/stockModel");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_KEY = process.env.JWT_KEY;

module.exports.top10Stocks = async function top10Stocks(req, res) {
  try {
    const result = await stockModel.aggregate([
      {
        $sort: { DATE: -1 },
      },
      {
        $group: {
          _id: "$SC_CODE",
          SC_NAME: { $first: "$SC_NAME" },
          totalDays: { $sum: 1 },
          averagePercentageChange: {
            $avg: {
              $multiply: [
                {
                  $divide: [{ $subtract: ["$CLOSE", "$OPEN"] }, "$OPEN"],
                },
                100,
              ],
            },
          },
          averageVolume: { $avg: "$NO_OF_SHRS" }, 
          averageNetTurnover: { $avg: "$NET_TURNOV" }, 
        },
      },
      {
        $match: {
          totalDays: { $gte: 20 },
          averageVolume: { $gte: 20000 }, 
        },
      },
      {
        $sort: {
          averagePercentageChange: -1,
          averageVolume: -1,
          averageNetTurnover: -1, 
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          SC_CODE: "$_id",
          SC_NAME: "$SC_NAME",
          averagePercentageChange: 1,
          averageVolume: 1,
          averageNetTurnover: 1,
        },
      },
    ]);

    res.json({
      message: "Top 10 stocks fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching top 10 stocks:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



module.exports.getStockByName = async function getStockByName(req, res) {
  try {
    const stockName = req.params.name;
    const regex = new RegExp(stockName.replace(/\s+/g, "\\s*"), "i");

    const result = await stockModel.aggregate([
      {
        $match: { SC_NAME: { $regex: regex } },
      },
      {
        $sort: { DATE: 1 },
      },
      {
        $group: {
          _id: "$SC_NAME",
          SC_CODE: { $first: "$SC_CODE" },
          fiftyDaysLowest: { $min: "$LOW" },
          fifyDaysHighest: { $max: "$HIGH" },
          LastClosingPrice: { $first: "$CLOSE" },
          FirstOpeningPrice: { $first: "$OPEN" },
        },
      },
      {
        $project: {
          _id: 0,
          StockName: "$_id",
          SC_CODE: 1,
          fiftyDaysLowest: 1,
          fifyDaysHighest: 1,
          LastClosingPrice: 1,
          FirstOpeningPrice: 1,
        },
      },
    ]);

    if (result.length > 0) {
      res.json({
        message: "Stocks fetched successfully",
        data: result,
      });
    } else {
      res.json({
        message: "No such stocks found!!!",
      });
    }
  } catch (error) {
    console.error("Error fetching stocks by name:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.addToFavourite = async function addToFavourite(req, res) {
  try {
    let data = req.body;

    if (data.CODE) {
      let stockCode = data.CODE;
      let stock = await stockModel.findOne({ SC_CODE: stockCode });
      if (stock) {
        let token = req.cookies.login;
        let uid = jwt.verify(token, JWT_KEY).payload;
        let user = await userModel.findById(uid);
        const isAlreadyPres=user.favourites.some(favorite => favorite.stockID === stockCode);
        if(isAlreadyPres){
          return res.json({
            message:'this stock is already in you favourite list'
          })
        }
        user['favourites'].push({ stockID: stock.SC_CODE });
        await user.save();
        res.json({
          message: 'added to favourite',
          favourites: user['favourites']
        })
      } else {
        res.json({ message: "invalid stockCode" });
      }
    } else {
      res.status(400).json({
        message: "Bad Request",
        error: "stock CODE is missing in the request body",
      });
    }
  } catch (error) {
    console.error("Error updating Favourite:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.removeFromFavorites = async function removeFromFavorites(
  req,
  res
) {
  try {
    let data = req.params;

    if (data.id) {
      let stockCode = data.id;
      let token = req.cookies.login;
      let uid = jwt.verify(token, JWT_KEY).payload;
      await userModel.findByIdAndUpdate(
        uid,
        { $pull: { favourites: { stockID: stockCode } } },
        { new: true }
      );

      res.json({
        message: 'deleted succesfully'
      })
    } else {
      res.json({ message: "stock code is missing in parameter" });
    }
  } catch (error) {
    console.error("Error deleting Favourite:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.getFavouriteStocks = async function getFavouriteStocks(
  req,
  res
) {
  try {
    let token = req.cookies.login;
    let uid = jwt.verify(token, JWT_KEY).payload;
    let user = await userModel.findById(uid);
    let stocks = user["favourites"];

    const stockIds = stocks.map((favorites) => favorites.stockID);
    if (stockIds.length>0) {
      //console.log(stockIds);
      let favStocks = [];
      for (let i=0;i<stockIds.length;i++) {
        let id=stockIds[i];
        let stock = await stockModel
          .find({ SC_CODE: id })
          .sort({ DATE: -1 })
          .limit(1)
          .select("SC_CODE SC_NAME OPEN CLOSE");
        //console.log(stock);
        favStocks.push(stock[0]);
      }
      res.json({
        message: "Success",
        data: favStocks,
      });
    } else {
      res.json({
        message: "not any favourites yet",
      });
    }
  } catch (error) {
    console.error("Error in getFavouriteStocks:", error);
    res.status(500).json({
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports.priceHistory = async function priceHistory(req, res) {
  try {
    const data = req.params;
    if (data.id) {
      let stockCode = data.id;
      const priceHistory = await stockModel
        .find({ SC_CODE: stockCode })
        .sort({ DATE: 1 })
        .select({ DATE: 1, OPEN: 1, HIGH: 1, LOW: 1, CLOSE: 1 });

      if (priceHistory.length > 0) {
        res.json({
          message: "Stock price history fetched successfully",
          data: priceHistory,
        });
      } else {
        res.json({
          message: "stock code is invalid",
        });
      }
    } else {
      res.json({
        message: "params id field missing",
      });
    }
  } catch (error) {
    console.error("Error fetching stock price history:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
