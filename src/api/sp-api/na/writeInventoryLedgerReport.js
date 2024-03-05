const { getInventoryLedgerReport } = require("./getInventoryLedgerReport.js");
const { appendArrayDataToSheets } = require("../../../lib/appendArrayDataToSheets.js");
const { checkIfUpdateNeeded } = require("../../../lib/checkIfUpdateNeeded.js");
const { readSpreadsheetValue } = require("../../../lib/readSpreadsheetValue.js");

const writeInventoryLedgerReport = async (spreadsheetId, range) => {
  console.log("writeInventoryhLedgerReport starts");
  const rangeArr = await readSpreadsheetValue(
    "1K5cauS1rAyywlo-lcThNyQAZUzuJuCqXCHxE-glXHiY",
    "getInventoryLedger!B1:C1"
  );
  const start = rangeArr[0][0];
  const end = rangeArr[0][1];
  const amazonData = await getInventoryLedgerReport(start, end);
  if (amazonData == null) {
    console.log("WRITE LEDGER REPORT No data for today");
    return;
  }

  const tsvData = amazonData; /* ここにTSV形式のデータを入れます */
  const lines = tsvData.split("\n");
  const headers = lines[0].split("\t");

  const arrayData = lines.slice(1).map((line) => {
    const values = line.split("\t");
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });

  //レポート系はデータを整形する必要あり。
  const cleanData = arrayData.map((item) => {
    const cleanedItem = {};
    for (const key in item) {
      cleanedItem[key.replace(/"/g, "")] = item[key].replace(/"/g, "");
    }
    return cleanedItem;
  });

  // console.log(cleanData);

  const filteredData = cleanData.filter((item) => item.Receipts != "0"); // これがないとデータが大きくなりすぎる
  const values = filteredData.map((item) => [
    item.Date,
    item.FNSKU,
    item.ASIN,
    item.MSKU,
    item.Title,
    item.Disposition,
    item["Starting Warehouse Balance"],
    item.Receipts,
    item["Ending Warehouse Balance"],
    item.Location,
  ]);
  console.log("values is ", values);
  values.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  const newLastRowData = values.length > 0 ? values[values.length - 1][0] : null; // 更新データのA列に入る最終行のデータ

  if (await checkIfUpdateNeeded(newLastRowData, spreadsheetId, range)) {
    try {
      await appendArrayDataToSheets(spreadsheetId, range, values);
    } catch (error) {
      throw error;
    }
  } else {
    console.log("WRITE LEDGER REPORT / data had been updated before");
  }
  console.log("writeInventoryhLedgerReport ends");
};

// writeInventoryLedgerReport(
//   process.env.SPREADSHEET_ID,
//   "getInventoryLedger!A3:J"
// );

module.exports = {
  writeInventoryLedgerReport,
};
