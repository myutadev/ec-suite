const express = require('express');
// const {writeValueCa,writeValueUs} = require('./writeFetchedData');
const {writeFetchedValues} = require('./writeGetInventorySummaries')
const {writeBusinessReport} =require('./src/api/sp-api/na/writeBusinessReport');
const {writeGetCatalogItemToSheet} = require('./src/api/sp-api/na/writeGetCatalogItemToSheet');
const {writeSkuToFnsku} = require('./src/api/sp-api/na/writeskuToFnsku');


const app = express();
const port = process.env.PORT || 3000;

// 12/19 changed
app.get('/write/bizreport', async (req, res) => {
    try {
        await writeBusinessReport();
        console.log(`writeBusinessReport started`);
        res.send('writeBusinessReport completed.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred in writeBusinessReport.');
    }
});

// 12/19 changed

app.get('/write/catalog', async (req, res) => {
    try {
        await writeGetCatalogItemToSheet(process.env.SPREADSHEET_ID,"NAfetchProdInfo");
        console.log(`writeGetCatalogItemToSheet started`);
        res.send('writeGetCatalogItemToSheet completed.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred in writeGetCatalogItemToSheet.');
    }
});


//12/19 changed
app.get('/write/fnsku', async (req, res) => {
    try {
        await writeSkuToFnsku(process.env.SPREADSHEET_ID,"skuToFnsku");
        console.log(`writeSkuToFnsku`);
        res.send('writeSkuToFnsku completed.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred.');
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
