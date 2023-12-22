const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();
const {
  readSpreadsheetValue,
} = require("../../../../lib/readSpreadsheetValue.js");
const {
  updateArrayDataToSheets,
} = require("../../../../lib/updateArrayDataToSheets.js");

const { getItemOffers } = require("../jp/getItemOffers.js");
const { getAvailablePriceArr } = require("./getAvailablePriceArr.js");

const writeProdCurPriceBySheet = async (
  spreadsheetId,
  sheetName,
  readCol,
  updateCheckCol,
  updateStartCol,
  updateEndCol,
  batchSize
) => {
  const readLatestFilledRow = await readSpreadsheetValue(
    spreadsheetId,
    `${sheetName}!${updateCheckCol}:${updateCheckCol}`
  );
  const readRow = readLatestFilledRow.length + 1;
  const readRange = `${sheetName}!${readCol}${readRow}:${readCol}`; //   "test+!D2:D",
  const sheetValue = await readSpreadsheetValue(spreadsheetId, readRange);
  const asinArr = sheetValue.flat();
  let updateStartRow = readRow;

  for (let i = 0; i < asinArr.length; i += batchSize) {
    console.log(`batch ${i} started`)
    const priceInfoArr = [];
    let updateEndRow = updateStartRow + batchSize - 1;
    let updateRange = `${sheetName}!${updateStartCol}${updateStartRow}:${updateEndCol}${updateEndRow}`;

    const batch = asinArr.slice(i, i + batchSize);
    console.log(batch);
    // process.exit();
    const batchResults = await Promise.allSettled(
      batch.map((asin) =>
        getItemOffers(asin).then((data) => getAvailablePriceArr(data, asin))
      )
    );

    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        priceInfoArr.push(result.value);
      } else {
        priceInfoArr.push([], [result.reason.message]);
      }
    });
    updateArrayDataToSheets(spreadsheetId, updateRange, priceInfoArr);
    updateStartRow += batchSize;
    console.log(`batch ${i} end`)

  }
};

module.exports = {
  writeProdCurPriceBySheet,
};

// writeProdCurPriceBySheet(
//   process.env.SPREADSHEET_ID3,
//   "test+",
//   "D", // asinのある列
//   "C",
//   "B",
//   "E",
//   99
// );
