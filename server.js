const express = require('express');
// const {writeValueCa,writeValueUs} = require('./writeFetchedData');
const {writeFetchedValues} = require('./writeGetInventorySummaries')
const {writeBusinessReport} =require('./src/api/sp-api/na/writeBusinessReport');
const {writeGetCatalogItemToSheet} = require('./src/api/sp-api/na/writeGetCatalogItemToSheet');

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

//writeGetCatalogItemToSheet

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

// //12/19 delete
// app.get('/write/ca', async (req, res) => {
//     try {
//         await writeValueCa();
//         console.log(`writevalueCA started`);
//         res.send('writevalueCA completed.');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('An error occurred in writevalueCA.');
//     }
// });

// //12/19 delete

// app.get('/write/us', async (req, res) => {
//     try {
//         await writeValueUs();
//         console.log(`writevalueUS started`);
//         res.send('writevalueUS completed.');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('An error occurred in writevalueUS');
//     }
// });

app.get('/write/skutofnsku', async (req, res) => {
    try {
        await writeFetchedValues();
        console.log(`writevaluestarted`);
        res.send('Write value completed.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred.');
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
