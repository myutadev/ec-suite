const express = require('express');
const {writeValue} = require('./writeFetchedData');
const {writeFetchedValues} = require('./writeGetInventorySummaries')


const app = express();
const port = process.env.PORT || 3000;

app.get('/write/ca', async (req, res) => {
    try {
        await writeValue();
        console.log(`writevaluestarted`);
        res.send('Write value completed.');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred.');
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
