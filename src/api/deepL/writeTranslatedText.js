const { readSpreadsheetValue } = require("../../lib/readSpreadsheetValue.js");
const { updateArrayDataToSheets } = require("../../lib/updateArrayDataToSheets.js");
const { getTranslatedText } = require("./getTranslatedText.js");

require("dotenv").config();

const writeTranslatedText = async (spreadsheetId, sheetName, batchSize) => {
  const readSpreadSheetData = await readSpreadsheetValue(spreadsheetId, `${sheetName}!B1:B`);
  const readRow = readSpreadSheetData.length + 1;
  const readRange = `${sheetName}!A${readRow}:A`;
  const sheetValues2d = await readSpreadsheetValue(spreadsheetId, readRange);
  const sheetValues = sheetValues2d.flat();
  let updateStartRow = readRow;
  // batch処理開始

  for (let i = 0; i < sheetValues.length; i += batchSize) {
    const translatedArr = [];
    let updateEndRow = updateStartRow + batchSize - 1;
    let updateRange = `${sheetName}!B${updateStartRow}:B${updateEndRow}`;
    const batch = sheetValues.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((title) => getTranslatedText(title)));
    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        translatedArr.push([result.value[0].text]);
      } else {
        translatedArr.push([], [result.reason.message]);
      }
    });

    console.log("translate arr", translatedArr);

    try {
      await updateArrayDataToSheets(spreadsheetId, updateRange, translatedArr);
    } catch (error) {
      console.error("Error writing to sheet: ", error);
      throw error;
    }
    updateStartRow += batchSize;
    console.log(`batch ${i} end`);
  }
};
// writeTranslatedText(process.env.SPREADSHEET_ID2, "asinsByName", 10);


module.exports = {
  writeTranslatedText,
};
