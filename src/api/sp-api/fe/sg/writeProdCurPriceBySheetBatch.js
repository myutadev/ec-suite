require("dotenv").config();
const { notifySlack } = require("../../../../lib/notifySlack.js");
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
  try {
    // 実行中の状態をF1に書き込む
    await updateArrayDataToSheets(spreadsheetId, `${sheetName}!F1`, [["working"]]);

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
      try {
        console.log(`batch ${i} started`);
        const priceInfoArr = [];
        let updateEndRow = updateStartRow + batchSize - 1;
        let updateRange = `${sheetName}!${updateStartCol}${updateStartRow}:${updateEndCol}${updateEndRow}`;

        const batch = asinArr.slice(i, i + batchSize);

        const curItemOffersObjArr = await getItemOffersBatch(batch);

        if (curItemOffersObjArr === null || curItemOffersObjArr === undefined) {
          // curItemOffersObjArrがnullの場合、バッチ内の各ASINに対してエラーメッセージを作成
          console.log("データ取得に失敗: curItemOffersObjArr is null or undefined");
          batch.forEach((asin) => {
            priceInfoArr.push([`https://www.amazon.co.jp/dp/${asin}`, "", asin, "データ取得に失敗しました"]);
          });
          await updateArrayDataToSheets(spreadsheetId, updateRange, priceInfoArr);
          continue;
        }

        const promises = curItemOffersObjArr.map(async (obj) => {
          try {
            return getAvailablePriceArr(obj, Object.keys(obj)[0]);
          } catch (e) {
            console.log("error from the first", e);
            notifySlack(e);
            return [`https://www.amazon.co.jp/dp/${Object.keys(obj)[0]}`, obj[asin]?.update, asin, obj[asin].error];
          }
        });

        await Promise.allSettled(promises).then((results) =>
          results.forEach((result) => {
            if (result.status === "fulfilled" && Array.isArray(result.value)) {
              console.log("result.value", result.value);
              priceInfoArr.push(result.value);
            } else {
              priceInfoArr.push([result?.reason?.message]);
            }
          })
        );

        try {
          await updateArrayDataToSheets(spreadsheetId, updateRange, priceInfoArr);
        } catch (error) {
          console.log("error from the middle", error);
          //ここでエラーがでたら処理を止める
          notifySlack(error);
          throw new Error(`致命的なエラー: ${error.message}`);
        }

        // 10秒に1回のペースに制御 : だいたい7000にすると10秒に1回くらいになった
        await new Promise((resolve) => setTimeout(resolve, 10000));

        updateStartRow += batchSize;
        console.log(`batch ${i} end`);
      } catch (error) {
        console.log("error from the end", error);
        notifySlack(error);
        continue;
      }
    }

    // 実行後の状態をF1に書き込む
    await updateArrayDataToSheets(spreadsheetId, `${sheetName}!F1`, [["Finished"]]);
  } catch (error) {
    console.log("error from the end", error);
    notifySlack(error);

    // エラー時の状態をF1に書き込む
    await updateArrayDataToSheets(spreadsheetId, `${sheetName}!F1`, [["Error, Stopped"]]);
  }
};

module.exports = {
  writeProdCurPriceBySheetBatch,
};

// writeProdCurPriceBySheetBatch(
//   process.env.SPREADSHEET_ID3,
//   "Fetch_manual",
//   "D", // asinのある列
//   "C", // update check
//   "B", // update start
//   "E", // update end
//   20
// );
