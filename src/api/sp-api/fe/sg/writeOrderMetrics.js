const { getOrderMetricSg } = require("./getOrderMetrics");
const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { checkIfUpdateNeeded } = require("../../../../lib/checkIfUpdateNeeded.js");

const writeOrderMetricsSg = async (spreadsheetId, marketPlace, range) => {
  // getOrderMetricsCA
  const amazonData = await getOrderMetricSg(marketPlace); // 更新する範囲を指定 要変更
  console.log("amazondata is", amazonData);

  const values = amazonData.map((item) => [
    item.interval,
    item.unitCount,
    item.orderItemCount,
    item.orderCount,
    item.averageUnitPrice.amount,
    item.totalSales.amount,
    item.totalSales.currencyCode,
  ]);

  console.log("values is", values);

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

// writeOrderMetricsSg(process.env.SPREADSHEET_ID, "SG", "getOrderMetricsSG!A2:X");
module.exports = {
  writeOrderMetricsSg,
};
