const express = require('express');
const {writeValueCa,writeValueUs} = require('./writeFetchedData');
const {writeFetchedValues} = require('./writeGetInventorySummaries')


const app = express();
const port = process.env.PORT || 3000;

app.get('/write/ca', async (req, res) => {
    try {
        await writeValueCa();
        console.log(`writevalueCA started`);
        res.send('writevalueCA completed.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred in writevalueCA.');
    }
});

app.get('/write/us', async (req, res) => {
    try {
        await writeValueUs();
        console.log(`writevalueUS started`);
        res.send('writevalueUS completed.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred in writevalueUS');
    }
});

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
