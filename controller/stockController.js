const stockModel = require("../model/stockModel");

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
          percentageChange: {
            $avg: {
              $multiply: [
                {
                  $divide: [{ $subtract: ["$CLOSE", "$OPEN"] }, "$OPEN"],
                },
                100,
              ],
            },
          },
        },
      },
      {
        $sort: { percentageChange: -1 }, 
      },
      {
        $limit: 10, 
      },
      {
        $project: {
          SC_CODE: 1,
          SC_CODE: "$_id",
          SC_NAME: "$SC_NAME",
          percentageChange: 1,
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

module.exports.addToFavourite= async function addToFavourite (req, res) {
  try {
    let data = req.body;

    if (data.CODE) {
      let stockCode = data.CODE;
      let stocks = await stockModel.find({ SC_CODE: stockCode });

      for (const stock of stocks) {
        stock.Favourite = true;
        try {
          await stock.save();
        } catch (saveError) {
          console.error("Error saving stock:", saveError);
        }
      }
      stocks = await stockModel.find({ SC_CODE: stockCode });
      res.json({
        message: "Successfully added to favourites",
      });
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

module.exports.removeFromFavorites = async function removeFromFavorites  (req, res) {
    try {
      let data = req.params;
  
      if (data.id) {
        let stockCode = data.id;
        let stocks = await stockModel.find({ SC_CODE: stockCode });
  
        for (const stock of stocks) {
          stock.Favourite = false;
          try {
            await stock.save();
          } catch (saveError) {
            console.error("Error saving stock:", saveError);
          }
        }
        stocks = await stockModel.find({ SC_CODE: stockCode });
        res.json({
          message: "Successfully removed from favourites",
        });
      } else {
        res.json({
          message: "deletion code missing"
        });
      }
    } catch (error) {
      console.error("Error deleting Favourite:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

module.exports.getFavouriteStocks = async function getFavouriteStocks(req, res) {
    try {
        
            const stocks = await stockModel.aggregate([
                { $match: { Favourite: true } }, 
                {
                    $sort: { DATE: -1 } 
                },
                {
                    $group: {
                        _id: '$SC_NAME', 
                        stock: { $first: '$$ROOT' } 
                    }
                },
                {
                    $replaceRoot: { newRoot: '$stock' } 
                }
            ]);

            res.json({
                message: 'Success',
                data: stocks
            });
    } catch (error) {
        console.error('Error in getFavouriteStocks:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            data: null
        });
    }
};

module.exports.priceHistory=async function priceHistory(req, res){
    try {
        const stockName = req.params.stockName;
        const regex = new RegExp(stockName.replace(/\s+/g, '\\s*'), 'i');

        const priceHistory = await stockModel.find({ SC_NAME: { $regex: regex } })
            .sort({ DATE: 1 }) 
            .select({ DATE: 1, OPEN: 1, HIGH: 1, LOW: 1, CLOSE: 1 }); 

        res.json({
            message: 'Stock price history fetched successfully',
            data: priceHistory
        });
    } catch (error) {
        console.error('Error fetching stock price history:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}
