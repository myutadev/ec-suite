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
const { writeReportData } = require("./src/api/sp-api/na/writeReportData");
const { writeBusinessReportDaily } = require("./src/api/sp-api/na/writeBusinessReportDaily");
const { writeSalesAndTrafficReportByDateAu } = require("./src/api/sp-api/fe/aus/writeSalesAndTrafficReportByDateAu");

console.log("worker.js is running");

cron.schedule("0 18 * * *", async () => {
  console.log("cron job at 18");

  const start = await getStartOfYesterday();
  const end = await getEndOfYesterday();

  writeOrderMetrics(process.env.SPREADSHEET_ID, "CA", "getOrderMetricsCA!A2:X");
  writeOrderMetrics(process.env.SPREADSHEET_ID, "US", "getOrderMetricsUS!A2:X");
  writeOrderMetrics(process.env.SPREADSHEET_ID, "MX", "getOrderMetricsMX!A2:X");
  writeFinances(process.env.SPREADSHEET_ID, "getFinances!A3:Z");
  writeRefundsFromFinances(process.env.SPREADSHEET_ID, "refunds");
  writeInventoryLedgerReport(process.env.SPREADSHEET_ID, "getInventoryLedger!A3:Z");
  writeReportData(
    process.env.SPREADSHEET_ID,
    "InvReport_US!A2:AB",
    "GET_FBA_INVENTORY_PLANNING_DATA",
    `${start}-07:00`,
    `${end}-07:00`,
    "US"
  );
  writeReportData(
    process.env.SPREADSHEET_ID,
    "InvReport_CA!A2:AB",
    "GET_FBA_INVENTORY_PLANNING_DATA",
    `${start}-07:00`,
    `${end}-07:00`,
    "CA"
  );
  writeBusinessReportDaily(process.env.SPREADSHEET_ID, "BizReport_CA!A2:AH", "CA", `${start}-07:00`, `${end}-07:00`);
  writeBusinessReportDaily(process.env.SPREADSHEET_ID, "BizReport_US!A2:AH", "US", `${start}-07:00`, `${end}-07:00`);
});

cron.schedule("30 10 * * *", async () => {
  console.log("cron job at 10:30");
  const start = await getStartOfYesterday();
  const end = await getEndOfYesterday();

  writeOrderMetricsSg(process.env.SPREADSHEET_ID, "SG", "getOrderMetricsSG!A2:X"); // 不要かも しばらく運用して不要であれば削除
  writeSalesAndTrafficReportByDate(process.env.SPREADSHEET_ID4, "AmaSG!A2:J", `${start}-07:00`, `${end}-07:00`, "SG");
  writeSalesAndTrafficReportByDateAu(
    process.env.SPREADSHEET_ID4,
    "AmaAUS!A2:J",
    `${start}-07:00`,
    `${end}-07:00`,
    "AU"
  );
});

//毎週木曜日日本時間夜11時に実行

cron.schedule("0 14 * * 3", async () => {
  console.log("start update prices");
  try {
    await writeProdCurPriceBySheet(
      process.env.SPREADSHEET_ID3,
      "Fetch_manual",
      "D", // asinのある列
      "C",
      "B",
      "E",
      600
    );
  } catch (error) {
    console.error(error);
    console.log("error occured while updating");
  }
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
