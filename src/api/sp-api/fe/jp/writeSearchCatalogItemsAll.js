const { getSearchCatalogItems } = require("./getSearchCatalogItems.js");
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { getChildAsins } = require("./getChildAsins.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");

require("dotenv").config();

const writeSearchCatalogItemsAll = async () => {
  const spreadsheetId = process.env.SPREADSHEET_ID2;
  const rangeForRead = "inputSearchKeywords!A2:A";
  const baseRangeForWrite = "inputSearchKeywords!C";
  const sheetName = "inputSearchKeywords";

  const keywordArr2d = await readSpreadsheetValue(spreadsheetId, rangeForRead);
  const keywordArr = keywordArr2d.map((item) => item[0]);

  await updateArrayDataToSheets(spreadsheetId, `${sheetName}!B1`, [["Working"]]);

  // 最初に書き込む行を追跡
  let currentRow = 2;

  for (const element of keywordArr) {
    console.log(element);
    const parentAsinArr = [];
    // 各キーワードごとに結果配列をリセット
    const currentResultArr = [];
    const apiResponse = await getSearchCatalogItems([element]);

    for (const item of apiResponse.items) {
      const parentAsin = item.relationships[0]?.relationships[0]?.parentAsins ?? "";
      if (parentAsin !== "") {
        // for variation asin
        if (!parentAsinArr.includes(parentAsin[0])) parentAsinArr.push(parentAsin[0]);
      } else {
        // for no variation asin
        currentResultArr.push([
          item.asin,
          item.summaries[0].brand,
          item.summaries[0].itemName,
          item.summaries[0].websiteDisplayGroup,
          item.summaries[0]?.modelNumber ?? "",
          item.salesRanks[0]?.classificationRanks?.[0]?.title ?? "no rank data",
          item.salesRanks[0]?.classificationRanks?.[0]?.rank ?? "no rank data",
        ]);
      }
    }

    //ここでparentAsinから子ASINを取得
    const childAsinsArr = [];

    for (const asin of parentAsinArr) {
      const childAsins = await getChildAsins(asin);
      childAsinsArr.push(childAsins);
    }
    
    const flattenedChildAsinsArr = childAsinsArr.flat();
    // 重要: currentResultArrに追加
    for (const arr of flattenedChildAsinsArr) {
      currentResultArr.push(arr);
    }

    // 現在のキーワードの結果だけを書き込む
    if (currentResultArr.length > 0) {
      const rangeForWrite = `${baseRangeForWrite}${currentRow}`;
      console.log(`Writing to range: ${rangeForWrite}`);
      
      try {
        await appendArrayDataToSheets(spreadsheetId, rangeForWrite, currentResultArr);
        // 次の書き込み位置を更新（現在の行 + 書き込んだ行数）
        currentRow += currentResultArr.length;
      } catch (error) {
        console.error("Error writing to sheet: ", error);
        await updateArrayDataToSheets(spreadsheetId, `${sheetName}!B1`, [["Error"]]);
        throw error;
      }
    }
  }
  
  await updateArrayDataToSheets(spreadsheetId, `${sheetName}!B1`, [["Finished"]]);
};
module.exports = {
  writeSearchCatalogItemsAll,
};

// writeSearchCatalogItemsAll();
