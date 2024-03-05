require("dotenv").config();
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");

const writeCheckDengerousProduct = async (spreadsheetId, sheetName, start, ngWordsSheetRange) => {
  const writeRange = `${sheetName}!T${start}:U`;
  const readRange = `${sheetName}!F${start}:F`;
  const sheetDataProdNames = await readSpreadsheetValue(spreadsheetId, readRange);
  const sheetDataNgWords = await readSpreadsheetValue(spreadsheetId, ngWordsSheetRange);
  const prodNames = sheetDataProdNames.flat();
  const ngWords = sheetDataNgWords.flat();
  const ngRegex = new RegExp(ngWords.join("|"));

  console.log("prodNames", prodNames);
  console.log("ngwords", ngRegex);

  const checkResArr = prodNames.map((name) => [ngRegex.test(name), name.match(ngRegex) ? name.match(ngRegex)[0] : ""]);
  // const checkResArr = prodNames.map((name) => [ngRegex.test(name)]);

  console.log(checkResArr);
  try {
    updateArrayDataToSheets(spreadsheetId, writeRange, checkResArr);
  } catch (error) {
    throw error;
  }
};

// writeCheckDengerousProduct(process.env.SPREADSHEET_ID3, "Prod_DB", 2, "Ama_NG_Brand&ASIN!D2:D");

module.exports = {
  writeCheckDengerousProduct,
};
