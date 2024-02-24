const { getSearchCatalogItems } = require("./getSearchCatalogItems");
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets");

require("dotenv").config();

const writeSearchCatalogItems = async () => {
  const spreadsheetId = process.env.SPREADSHEET_ID2;
  const rangeForRead = "searchKeywords!A2:A";

  const rangeForWrite = "searchKeywords!C2:J";

  const keywordArr2d = await readSpreadsheetValue(spreadsheetId, rangeForRead);
  const keywordArr = keywordArr2d.map((item) => item[0]);
  keywordArr.forEach(async (element) => {
    const apiResponse = await getSearchCatalogItems([element]);

    const values = apiResponse.items.map((item) => [
      item.asin,
      item.summaries[0].brand,
      item.summaries[0].itemName,
      item.summaries[0].websiteDisplayGroup,
      item.summaries[0]?.modelNumber ?? "",
    ]);

    try {
      appendArrayDataToSheets(spreadsheetId, rangeForWrite, values);
    } catch (error) {
      console.error("Error writing to sheet: ", error);
    }
    
  });
};

module.exports = {
  writeSearchCatalogItems,
};

// writeSearchCatalogItems();
