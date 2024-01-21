const express = require('express');
const app = express();
const { downloadAndProcessData } = require('./scripts/downloadData'); 
const dotenv = require('dotenv');
dotenv.config();

const stockRouter = require('./Routers/stockRouter');
app.use(express.json());
async function runDownloadScript() {
    try {
        //await downloadAndProcessData(); //putting this under (free-tier deploy services) made heap overflow error
        console.log('Data download and processing completed.');
    } catch (error) {
        console.error('Error during data download and processing:', error);
    }
}


runDownloadScript().then(() => {
    app.use('/stock', stockRouter);
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
