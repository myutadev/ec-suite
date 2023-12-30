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

  keywordArr.forEach(async (element) => {
    console.log(element);
    const parentAsinArr = [];
    const apiResponse = await getSearchCatalogItems([element]);

    apiResponse.items.forEach(async (item) => {
      const parentAsin = item.relationships[0]?.relationships[0]?.parentAsins ?? "";
      if (parentAsin !== "") {
        parentAsinArr.push(parentAsin[0]);
        // console.log(parentAsinArr);
      } else {
        console.log("asin doesnt have variatio", item.asin);
        resultArr.push(item.asin);
      }
    });

    //ここでparentAsinから子ASINを取得
    // console.log("parentAsin now", parentAsinArr);
    const childAsinsArr = [];

    for (asin of parentAsinArr) {
      const childAsins = await getChildAsins(asin);
      // console.log("childAsins", childAsins);
      childAsinsArr.push(childAsins);
    }

    resultArr.push(childAsinsArr.flat());
    const flattenedResultArr = resultArr.flat();

    const values = flattenedResultArr.map((asin) => [asin]);
    try {
      appendArrayDataToSheets(spreadsheetId, rangeForWrite, values);
    } catch (error) {
      console.error("Error writing to sheet: ", error);
    }
  });
};

module.exports = {
  writeSearchCatalogItemsAll,
};

// writeSearchCatalogItems();
