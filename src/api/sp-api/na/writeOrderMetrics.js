const { getOrderMetrics } = require("./getOrderMetrics");
const { appendArrayDataToSheets } = require("../../../lib/appendArrayDataToSheets.js");
const { checkIfUpdateNeeded } = require("../../../lib/checkIfUpdateNeeded.js");
const { getStartOfYesterday, getEndOfYesterday } = require("../../../lib/getYesterday");

const writeOrderMetrics = async (spreadsheetId, marketPlace, range) => {
  // getOrderMetricsCA
  // const start = `${getStartOfYesterday()}-07:00`; // `${getStartOfYesterday()}-07:00`
  // const end = `${getEndOfYesterday()}-07:00`; //`${getEndOfYesterday()}-07:00`
  const start = `2025-02-21T00:00:00-07:00`// `${getStartOfYesterday()}-07:00`
  const end = `2025-03-22T00:00:00-07:00` //`${getEndOfYesterday()}-07:00`

  const amazonData = await getOrderMetrics(marketPlace, start, end); // 更新する範囲を指定 要変更

  const values = amazonData.map((item) => [
    item.interval,
    item.unitCount,
    item.orderItemCount,
    item.orderCount,
    item.averageUnitPrice.amount,
    item.totalSales.amount,
    item.totalSales.currencyCode,
  ]);

  const newLastRowData = values[values.length - 1][0]; // 更新データのA列に入る最終行のデータ

  if (await checkIfUpdateNeeded(newLastRowData, spreadsheetId, range)) {
    try {
      await appendArrayDataToSheets(spreadsheetId, range, values);
    } catch (error) {
      throw error;
    }
  } else {
    console.log("ORDER METRICS / data had been updated before");
  }
};

writeOrderMetrics(process.env.SPREADSHEET_ID, "CA", "getOrderMetricsCA!A2:X");
// writeOrderMetrics(process.env.SPREADSHEET_ID,"US","getOrderMetricsUS!A2:X")
// writeOrderMetrics(process.env.SPREADSHEET_ID,"MX","getOrderMetricsMX!A2:X")
module.exports = {
  writeOrderMetrics,
};
