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
  const resultArr = [];

  for (keyword of keywordArr) {
    const apiResponse = await getSearchCatalogItems([keyword]);

    const values = apiResponse.items.map((item) => [
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

    resultArr.push(values);
  }

  // keywordArr.forEach(async (element) => {
  //   const apiResponse = await getSearchCatalogItems([element]);

  //   const values = apiResponse.items.map((item) => [
  //     item.asin,
  //     item.summaries[0].brand,
  //     item.summaries[0].itemName,
  //     item.summaries[0].websiteDisplayGroup,
  //     item.summaries[0]?.modelNumber ?? "",
  //     item.salesRanks[0]?.classificationRanks?.[0]?.title ?? "no rank data",
  //     item.salesRanks[0]?.classificationRanks?.[0]?.rank ?? "no rank data",
  //     item.salesRanks[0]?.displayGroupRanks?.[0]?.title ?? "no rank data",
  //     item.salesRanks[0]?.displayGroupRanks?.[0]?.rank ?? "no rank data",
  //   ]);

  //   resultArr.push(values);
  // });

  console.log(resultArr);
  const result = resultArr.flat();

  try {
    appendArrayDataToSheets(spreadsheetId, rangeForWrite, result);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
    throw error;
  }
};

module.exports = {
  writeSearchCatalogItems,
};

// writeSearchCatalogItems();
