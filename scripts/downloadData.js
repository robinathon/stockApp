const axios = require("axios");
const AdmZip = require("adm-zip");
const csvParser = require("csv-parser");
const stockModel = require("../model/stockModel");

async function downloadSingleDayData(date, orgDate) {
  try {
    const zipUrl = `https://www.bseindia.com/download/BhavCopy/Equity/EQ${date}_CSV.ZIP`;
    console.log(zipUrl);
    const response = await axios.get(zipUrl, { responseType: "arraybuffer" });
    const zip =  new AdmZip(response.data);
    const zipEntries =  zip.getEntries();

    if (zipEntries.length !== 1) {
      console.error("ZIP file does not contain exactly one CSV file.");
      return;
    }

    const csvEntry = zipEntries[0];

    
    if (!csvEntry.entryName.toLowerCase().endsWith(".csv")) {
      console.error("ZIP file does not contain a CSV file.");
      return;
    }

    const csvData = zip.readAsText(csvEntry);
    

    csvParser()
      .on("data", async (row) => {
        // Extract only the relevant fields from the CSV row
        const relevantData = {
          SC_CODE: parseInt(row.SC_CODE),
          SC_NAME: row.SC_NAME.trim(),
          OPEN: parseFloat(row.OPEN),
          HIGH: parseFloat(row.HIGH),
          LOW: parseFloat(row.LOW),
          CLOSE: parseFloat(row.CLOSE),
          NO_OF_SHRS: parseFloat(row.NO_OF_SHRS),
          NET_TURNOV: parseFloat(row.NET_TURNOV),
          DATE: orgDate,
        };

        await handleAsyncOperation(relevantData);
      })
      .write(csvData);

    async function handleAsyncOperation(data) {
      try {
        await stockModel.create(data);

      } catch (error) {
        console.error("Error storing data in MongoDB:", error.message);
      }
    }
    console.log(date, 'data uploaded');
  } catch (error) {
    console.error('weekend');
  }
}

async function dropStockCollection() {
    try {
        await stockModel.collection.drop();
        console.log('StockModel collection dropped');
    } catch (error) {
        console.error('Error dropping collection:', error);
    }
}

async function downloadAndProcessData() {
    await dropStockCollection();
    const currentDate = new Date();

    for (let i = 1; i <= 50; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        const dayOfWeek = date.getDay();
            const formattedDate = date.toLocaleDateString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '');
    
            const ddmmyyFormattedDate = formattedDate.slice(2, 4) + formattedDate.slice(0, 2) + formattedDate.slice(4);
            await downloadSingleDayData(ddmmyyFormattedDate, date);
    }
    

    console.log('All downloads and processing completed');
}

module.exports={downloadAndProcessData};
