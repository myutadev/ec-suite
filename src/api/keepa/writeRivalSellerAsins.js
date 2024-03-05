const { readSpreadsheetValue } = require("../../lib/readSpreadsheetValue.js");
const { appendArrayDataToSheets } = require("../../lib/appendArrayDataToSheets.js");
const { getSellerInfo } = require("./getSellerInfo.js");

require("dotenv").config();

const writeRivalSellerAsins = async () => {
  const spreadsheetId = process.env.SPREADSHEET_ID2;
  const rangeForRead = "rival_seller_Search!A3:A5";
  const rangeForWrite = "rival_seller_Search!A6:A";

  const configArr2d = await readSpreadsheetValue(spreadsheetId, rangeForRead);
  const configArr = configArr2d.map((item) => item[0]);
  const market = configArr[0];
  const sellerId = configArr[2];
  const storeFront = 1;

  const responseObj = await getSellerInfo(market, sellerId, storeFront); // response.data.sellers
  console.log("responseObj is", responseObj);
  const asinArr = responseObj[sellerId].asinList;
  // console.log(asinArr);
  const values = asinArr.map((item) => [item]);

  try {
    await appendArrayDataToSheets(spreadsheetId, rangeForWrite, values);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
    throw error;
  }
};

module.exports = {
  writeRivalSellerAsins,
};
