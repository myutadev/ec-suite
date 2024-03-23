const { readSpreadsheetValue } = require("../../../lib/readSpreadsheetValue.js");
const { updateArrayDataToSheets } = require("../../../lib/updateArrayDataToSheets.js");
const { chunkData } = require("../../../lib/chunkData.js");
const { getFbaInventorySummaries } = require("./getFbaInventorySummaries.js");

require("dotenv").config();

const writeSkuToFnsku = async (spreadsheetId, sheetName) => {
  // 配列を渡して複数対応する。
  const marketPlaceSheetData = await readSpreadsheetValue(spreadsheetId, `${sheetName}!A1:A1`);
  const marketPlace = marketPlaceSheetData.flat()[0];

  const skusSheetData = await readSpreadsheetValue(spreadsheetId, `${sheetName}!A3:A`);
  const skus = skusSheetData.flat();

  const chunkedSkus = await chunkData(skus, 50);

  const apiResponse = await Promise.allSettled(chunkedSkus.map((skus) => getFbaInventorySummaries(marketPlace, skus)));
  //apiResponseをフラットなオブジェクトの配列にしたい

  const flatRes = apiResponse.map(obj => obj.value).flat();
  const resultArr = flatRes.map( obj => [obj.sellerSku,obj.fnSku]);

  //書き込み用レンジ
  const range = "skuToFnsku!B3:C";

  try {
    await updateArrayDataToSheets(spreadsheetId, range, resultArr);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
    throw error;
  }
};

module.exports = {
  writeSkuToFnsku,
};

// writeSkuToFnsku(process.env.SPREADSHEET_ID, "skuToFnsku");
