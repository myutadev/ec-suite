const { updateArrayDataToSheets } = require("./updateArrayDataToSheets");

async function updateSpreadsheetIfNecessary(spreadsheetId, sheetName, resultArray, currentRow) {
  if (resultArray.length >= 10) {
    const writeRange = `${sheetName}!AA${currentRow}:AB${currentRow + resultArray.length - 1}`;
    await updateArrayDataToSheets(spreadsheetId, writeRange, resultArray);
    resultArray.length = 0; // 配列をクリア
    return 10; // 更新した行数を返す
  }
  return 0; // 更新しなかった場合は0を返す
}

module.exports = {
  updateSpreadsheetIfNecessary,
};
