const { getSearchCatalogItems } = require("./getSearchCatalogItems.js");
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { getChildAsins } = require("./getChildAsins.js");

require("dotenv").config();

const writeSearchCatalogItemsAll = async () => {
  const spreadsheetId = process.env.SPREADSHEET_ID2;
  const rangeForRead = "inputSearchKeywords!A2:A";
  const rangeForWrite = "inputSearchKeywords!C2:C";

  const keywordArr2d = await readSpreadsheetValue(spreadsheetId, rangeForRead);
  const keywordArr = keywordArr2d.map((item) => item[0]);
  const resultArr = [];
  // resultArrにはタイトル等他の情報も入れる

  keywordArr.forEach(async (element) => {
    console.log(element);
    const parentAsinArr = [];
    const apiResponse = await getSearchCatalogItems([element]);

    apiResponse.items.forEach(async (item) => {
      const parentAsin = item.relationships[0]?.relationships[0]?.parentAsins ?? "";
      if (parentAsin !== "") {
        // for variation asin -  ここで重複しないようにする必要あり
        console.log(!parentAsinArr.includes(parentAsin[0]));
        if (!parentAsinArr.includes(parentAsin[0])) parentAsinArr.push(parentAsin[0]);
      } else {
        // for no variation asin
        console.log("asin doesnt have variation", item.asin);
        resultArr.push([
          item.asin,
          item.summaries[0].brand,
          item.summaries[0].itemName,
          item.summaries[0].websiteDisplayGroup,
          item.summaries[0]?.modelNumber ?? "",
          item.salesRanks[0]?.classificationRanks?.[0]?.title ?? "no rank data",
          item.salesRanks[0]?.classificationRanks?.[0]?.rank ?? "no rank data",
          item.salesRanks[0]?.displayGroupRanks?.[0]?.title ?? "no rank data",
          item.salesRanks[0]?.displayGroupRanks?.[0]?.rank ?? "no rank data",
        ]);
      }
    });

    //ここでparentAsinから子ASINを取得
    console.log("parentAsin now", parentAsinArr);
    const childAsinsArr = [];

    for (asin of parentAsinArr) {
      const childAsins = await getChildAsins(asin);
      console.log("childAsins", childAsins);
      childAsinsArr.push(childAsins);
    }
    const flattenedChildAsinsArr = childAsinsArr.flat();
    flattenedChildAsinsArr.forEach((arr) => resultArr.push(arr));
    // resultArr.push(childAsinsArr.flat());
    console.log("resultArr", resultArr);
    // try {
    //   appendArrayDataToSheets(spreadsheetId, rangeForWrite, values);
    // } catch (error) {
    //   console.error("Error writing to sheet: ", error);
    // }
    try {
      appendArrayDataToSheets(spreadsheetId, rangeForWrite, resultArr);
    } catch (error) {
      console.error("Error writing to sheet: ", error);
      throw error;
    }
  });
};

module.exports = {
  writeSearchCatalogItemsAll,
};

// writeSearchCatalogItemsAll();
