const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { getAsinsFromTitle } = require("./getAsinsFromTitle.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");
const { chunkData } = require("../../../../lib/chunkData.js");
const { batch } = require("googleapis/build/src/apis/batch/index.js");
const { getCatalogItem } = require("./getCatalogItem.js");

require("dotenv").config();

const writeAsinsFromTitle = async (spreadsheetId, sheetName, batchSize) => {
  const readSpreadSheetData = await readSpreadsheetValue(spreadsheetId, `${sheetName}!C1:C`);
  const readRow = readSpreadSheetData.length + 1;
  const readRange = `${sheetName}!B${readRow}:B`;
  const sheetValues = await readSpreadsheetValue(spreadsheetId, readRange);
  const keywordArr = sheetValues.flat();
  let updateStartRow = readRow;
  console.log(updateStartRow);

  for (let i = 0; i < keywordArr.length; i += batchSize) {
    const asinsArr = [];

    let updateEndRow = updateStartRow + batchSize - 1;
    let updateRange = `${sheetName}!C${updateStartRow}:G${updateEndRow}`;
    console.log("updateRange is", updateRange);
    const batch = keywordArr.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((keyword) => getAsinsFromTitle([keyword])));
    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        asinsArr.push(result.value);
      } else {
        asinsArr.push([]);
      }
    });

    console.log("asinsArr", asinsArr);

    await updateArrayDataToSheets(spreadsheetId, updateRange, asinsArr);
    updateStartRow += batchSize;
    console.log(`batch ${i} end`);
  }
};

// writeAsinsFromTitle(process.env.SPREADSHEET_ID2, "asinsByName", 10);

module.exports = {
  writeAsinsFromTitle,
};
