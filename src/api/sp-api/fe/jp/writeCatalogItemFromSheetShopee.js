const { getCatalogItemShopee } = require("./getCatalogItemShopee");
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets");
require("dotenv").config();

const writeCatalogItemFromSheetShopee = async (spreadsheetId, sheetName, batchSize) => {
  const readSpreadSheetData = await readSpreadsheetValue(spreadsheetId, `${sheetName}!B1:AH`);
  const readRow = readSpreadSheetData.length + 1;
  const readRange = `${sheetName}!A${readRow}:A`;
  const sheetValues = await readSpreadsheetValue(spreadsheetId, readRange);
  const asinArr = sheetValues.flat();
  console.log(asinArr);
  let updateStartRow = readRow;
  // batch処理開始
  for (let i = 0; i < asinArr.length; i += batchSize) {
    const priceInfoArr = [];
    let updateEndRow = updateStartRow + batchSize - 1;
    let updateRange = `${sheetName}!B${updateStartRow}:AO${updateEndRow}`;
    const batch = asinArr.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((asin) => getCatalogItemShopee(asin)));
    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        priceInfoArr.push(result.value);
      } else {
        priceInfoArr.push([], [result.reason.message]);
      }
    });
    await updateArrayDataToSheets(spreadsheetId, updateRange, priceInfoArr);
    updateStartRow += batchSize;
    console.log(`batch ${i} end`);
  }
};

// writeCatalogItemFromSheetShopee(process.env.SPREADSHEET_ID6, "fetch_shopee_data", 50);

module.exports = {
  writeCatalogItemFromSheetShopee,
};
