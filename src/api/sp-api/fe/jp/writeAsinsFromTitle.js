const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { getAsinsFromTitle } = require("./getAsinsFromTitle.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");

require("dotenv").config();

const writeAsinsFromTitle = async (spreadsheetId, readRange, writeRange) => {
  const keywordArr2d = await readSpreadsheetValue(spreadsheetId, readRange);
  const keywordArr = keywordArr2d.map((item) => item[0]);
  console.log(keywordArr);
  const values = [];

  for (keyword of keywordArr) {
    const bestMatchAsins = await getAsinsFromTitle([keyword]);
    values.push(bestMatchAsins);
  }

  console.log(values);
  // process.exit();

  try {
    // appendArrayDataToSheets(spreadsheetId, writeRange, values);
    updateArrayDataToSheets(spreadsheetId, writeRange, values)
  } catch (error) {
    console.error("Error writing to sheet: ", error);
  }
};

module.exports = {
  writeAsinsFromTitle,
};

// writeAsinsFromTitle(process.env.SPREADSHEET_ID2, "asinsByName!B2:B", "asinsByName!C2:H");
