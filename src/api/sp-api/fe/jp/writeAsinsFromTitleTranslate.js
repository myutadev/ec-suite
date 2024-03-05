const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { getAsinsFromTitle } = require("./getAsinsFromTitle.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");
const { getTranslatedText } = require("../../../deepL/getTranslatedText.js");

require("dotenv").config();

const writeAsinsFromTitleTranslate = async (spreadsheetId, readRange, writeRange) => {
  const keywordArr2d = await readSpreadsheetValue(spreadsheetId, readRange);
  const keywordArr = keywordArr2d.map((item) => item[0]);

  const values = [];

  for (keyword of keywordArr) {
    const result = await getTranslatedText(keyword);
    const jaText = result[0].text;
    console.log("jaText", jaText);

    const bestMatchAsins = await getAsinsFromTitle([jaText]);
    bestMatchAsins.unshift(jaText);
    values.push(bestMatchAsins);
    console.log("bestMatchAsins is", bestMatchAsins);
  }

  console.log(values);
  // process.exit();

  try {
    // appendArrayDataToSheets(spreadsheetId, writeRange, values);
    updateArrayDataToSheets(spreadsheetId, writeRange, values);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
    throw error;
  }
};

module.exports = {
  writeAsinsFromTitleTranslate,
};

// writeAsinsFromTitleTranslate(process.env.SPREADSHEET_ID2, "asinsByName!A2:A", "asinsByName!B2:G");
// writeAsinsFromTitleTranslate(process.env.SPREADSHEET_ID_sample, "asinsByName!A2:A", "asinsByName!B2:G");
