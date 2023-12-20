const { getCurSellingCompetitivePricing, } = require("./getCurSellingCompetitivePricing.js");
const {updateArrayDataToSheets,} = require("../../../../lib/updateArrayDataToSheets.js");
require("dotenv").config();

const writeCurSellingCompetitivePrice = async () => {
    let values = [];
    values = await getCurSellingCompetitivePricing();
    console.log("Fetched values: ", values);

    //書き込み先
    const spreadsheetId = process.env.SPREADSHEET_ID2;
    const range = "SGCurSelling!G2:P";
    updateArrayDataToSheets(spreadsheetId, range, values);
};

// writeCurSellingCompetitivePrice();

module.exports = {
    writeCurSellingCompetitivePrice,
};
