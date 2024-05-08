require("dotenv").config();
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");
const { getItemOffersBatch } = require("../jp/getItemOffersBatch.js");
const { getAvailablePriceArr } = require("./getAvailablePriceArr.js");

const writeProdCurPriceBySheetBatch = async (
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
  const readRange = `${sheetName}!${readCol}${readRow}:${readCol}`;
  const sheetValue = await readSpreadsheetValue(spreadsheetId, readRange);
  const asinArr = sheetValue.flat();
  let updateStartRow = readRow;

  for (let i = 0; i < asinArr.length; i += batchSize) {
    console.log(`batch ${i} started`);
    const priceInfoArr = [];
    let updateEndRow = updateStartRow + batchSize - 1;
    let updateRange = `${sheetName}!${updateStartCol}${updateStartRow}:${updateEndCol}${updateEndRow}`;

    const batch = asinArr.slice(i, i + batchSize);

    const curItemOffersObjArr = await getItemOffersBatch(batch);

    const promises = curItemOffersObjArr.map(async (obj) => {
      console.log("cur obj is", obj);
      try {
        console.log("obj is", obj);
        return getAvailablePriceArr(obj, Object.keys(obj)[0]);
      } catch (e) {
        return;
      }
    });

    await Promise.allSettled(promises).then((results) =>
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          console.log("result.value", result.value);
          priceInfoArr.push(result.value);
        } else {
          priceInfoArr.push([], [result.reason.message]);
        }
      })
    );

    try {
      await updateArrayDataToSheets(spreadsheetId, updateRange, priceInfoArr);
    } catch (error) {
      throw error;
    }

    // 10秒に1回のペースに制御 : だいたい7000にすると10秒に1回くらいになった
    await new Promise((resolve) => setTimeout(resolve, 10000));

    updateStartRow += batchSize;
    console.log(`batch ${i} end`);
  }
};

module.exports = {
  writeProdCurPriceBySheetBatch,
};

// writeProdCurPriceBySheetBatch(
//   process.env.SPREADSHEET_ID3,
//   "Fetch_manual2",
//   "D", // asinのある列
//   "C", // update check
//   "B", // update start
//   "E", // update end
//   20
// );
