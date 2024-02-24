const { readSpreadsheetValue } = require("../../lib/readSpreadsheetValue.js");
const { updateArrayDataToSheets } = require("../../lib/updateArrayDataToSheets.js");
const { getTranslatedText } = require("./getTranslatedText.js");

require("dotenv").config();

const writeTranslatedText = async (spreadsheetId, readRange, writeRange) => {
  const keywordArr2d = await readSpreadsheetValue(spreadsheetId, readRange);
  const keywordArr = keywordArr2d.map((item) => item[0]);
  console.log(keywordArr);
  const values = [];
  for (keyword of keywordArr) {
    const response = await getTranslatedText(keyword);
    console.log("response is", response[0].text);
    values.push([response[0].text]);
  }

  console.log(values);
  // process.exit();

  try {
    // appendArrayDataToSheets(spreadsheetId, writeRange, values);
    updateArrayDataToSheets(spreadsheetId, writeRange, values);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
  }
};

module.exports = {
  writeTranslatedText,
};

// writeTranslatedText(process.env.SPREADSHEET_ID2, "asinsByName!A2:A", "asinsByName!B2:B");
