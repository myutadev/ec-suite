// const {writeOrderMetricsCA,writeOrderMetricsUS,writeOrderMetricsMX} = require('./writeGetOrderMetrics');
// const {writeGetFinances} = require('./writeGetFinances');
// const {writeInventoryhLedgerReport} = require('./writeInventoryLedgerReportToSpreadsheet');
// const {writeRefundsGetFinances} = require('./writeRefundGetFinances');
const { writeOrderMetrics } = require("./src/api/sp-api/na/writeOrderMetrics");
const { writeFinances } = require("./src/api/sp-api/na/writeFinances");
const { writeRefundsFromFinances } = require("./src/api/sp-api/na/writeRefundsFromFinances");
const { writeInventoryLedgerReport } = require("./src/api/sp-api/na/writeInventoryLedgerReport");
const cron = require("node-cron");
const { writeOrderMetricsSg } = require("./src/api/sp-api/fe/sg/writeOrderMetrics");
const { writeSalesAndTrafficReportByDate } = require("./src/api/sp-api/fe/sg/writeSalesAndTrafficReportByDate");
const { getStartOfYesterday, getEndOfYesterday } = require("./src/lib/getYesterday");

cron.schedule("0 9 * * *", () => {
  writeOrderMetrics(process.env.SPREADSHEET_ID, "CA", "getOrderMetricsCA!A2:X");
  writeOrderMetrics(process.env.SPREADSHEET_ID, "US", "getOrderMetricsUS!A2:X");
  writeOrderMetrics(process.env.SPREADSHEET_ID, "MX", "getOrderMetricsMX!A2:X");
  writeFinances(process.env.SPREADSHEET_ID, "getFinances!A3:Z");
  writeRefundsFromFinances(process.env.SPREADSHEET_ID, "refunds");
  writeInventoryLedgerReport(process.env.SPREADSHEET_ID, "getInventoryLedger!A3:Z");
});

cron.schedule("0 0 * * *", async () => {
  const start = await getStartOfYesterday();
  const end = await getEndOfYesterday();

  writeOrderMetricsSg(process.env.SPREADSHEET_ID, "SG", "getOrderMetricsSG!A2:X");
  writeSalesAndTrafficReportByDate(process.env.SPREADSHEET_ID4, "AmaSG!A2:J", `${start}-07:00`, `${end}-07:00`, "SG");
});

//テスト用 1分ごとに実行
// cron.schedule('*/1 * * * *', () => {
// cron.schedule('0 9 * * *',()=>{ ````````

// writeOrderMetricsCA();
// writeOrderMetricsUS();
// writeOrderMetricsMX();
// writeGetFinances();
// writeRefundsGetFinances();
// writeInventoryhLedgerReport();
