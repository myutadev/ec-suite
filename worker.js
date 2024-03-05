// const {writeOrderMetricsCA,writeOrderMetricsUS,writeOrderMetricsMX} = require('./writeGetOrderMetrics');
// const {writeGetFinances} = require('./writeGetFinances');
// const {writeInventoryhLedgerReport} = require('./writeInventoryLedgerReportToSpreadsheet');
// const {writeRefundsGetFinances} = require('./writeRefundGetFinances');
const { writeOrderMetrics } = require("./src/api/sp-api/na/writeOrderMetrics");
const { writeFinances } = require("./src/api/sp-api/na/writeFinances");
const { writeRefundsFromFinances } = require("./src/api/sp-api/na/writeRefundsFromFinances");
const cron = require("node-cron");
const { writeOrderMetricsSg } = require("./src/api/sp-api/fe/sg/writeOrderMetrics");
const { writeSalesAndTrafficReportByDate } = require("./src/api/sp-api/fe/sg/writeSalesAndTrafficReportByDate");
const { getStartOfYesterday, getEndOfYesterday } = require("./src/lib/getYesterday");
const { writeReportData } = require("./src/api/sp-api/na/writeReportData");
const { writeBusinessReportDaily } = require("./src/api/sp-api/na/writeBusinessReportDaily");
const { writeSalesAndTrafficReportByDateAu } = require("./src/api/sp-api/fe/aus/writeSalesAndTrafficReportByDateAu");
const { writeProdCurPriceBySheet } = require("./src/api/sp-api/fe/sg/writeProdCurPriceBySheet");
const { deleteSheetRange } = require("./src/lib/deleteSheetRange");
const { copyAndPasteFromSheetToSheet } = require("./src/lib/copyAndPasteFromSheetToSheet");

console.log("worker.js is running");

//エラー通知用
function notifySlack(error) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  axios
    .post(SLACK_WEBHOOK_URL, {
      text: `An error occurred in EC-suite WORKER: ${error.message} \n stack trace:${error.stack}`,
    })
    .then(() => console.log("Notified Slack about the error."))
    .catch(() => console.log("Error occurred while notifying Slack."));
}

cron.schedule("0 18 * * *", async () => {
  console.log("cron job at 18");

  const start = await getStartOfYesterday();
  const end = await getEndOfYesterday();

  try {
    await writeOrderMetrics(process.env.SPREADSHEET_ID, "CA", "getOrderMetricsCA!A2:X");
    await writeOrderMetrics(process.env.SPREADSHEET_ID, "US", "getOrderMetricsUS!A2:X");
    await writeOrderMetrics(process.env.SPREADSHEET_ID, "MX", "getOrderMetricsMX!A2:X");
  } catch (error) {
    notifySlack(error);
  }

  try {
    await writeFinances(process.env.SPREADSHEET_ID, "getFinances!A3:Z");
  } catch (error) {
    notifySlack(error);
  }

  try {
    await writeRefundsFromFinances(process.env.SPREADSHEET_ID, "refunds");
  } catch (error) {
    notifySlack(error);
  }

  try {
    await writeReportData(
      process.env.SPREADSHEET_ID,
      "InvReport_US!A2:AB",
      "GET_FBA_INVENTORY_PLANNING_DATA",
      `${start}-07:00`,
      `${end}-07:00`,
      "US"
    );
  } catch (error) {
    notifySlack(error);
  }

  try {
    await writeReportData(
      process.env.SPREADSHEET_ID,
      "InvReport_CA!A2:AB",
      "GET_FBA_INVENTORY_PLANNING_DATA",
      `${start}-07:00`,
      `${end}-07:00`,
      "CA"
    );
  } catch (error) {
    notifySlack(error);
  }

  try {
    await writeBusinessReportDaily(
      process.env.SPREADSHEET_ID,
      "BizReport_CA!A2:AH",
      "CA",
      `${start}-07:00`,
      `${end}-07:00`
    );
  } catch (error) {
    notifySlack(error);
  }

  try {
    await writeBusinessReportDaily(
      process.env.SPREADSHEET_ID,
      "BizReport_US!A2:AH",
      "US",
      `${start}-07:00`,
      `${end}-07:00`
    );
  } catch (error) {
    notifySlack(error);
  }
});

cron.schedule("0 11 * * *", async () => {
  console.log("cron job at 11:00");
  const start = await getStartOfYesterday();
  const end = await getEndOfYesterday();

  try {
    writeOrderMetricsSg(process.env.SPREADSHEET_ID, "SG", "getOrderMetricsSG!A2:X"); // 不要かも しばらく運用して不要であれば削除
  } catch (error) {
    notifyS;
    lack(error);
  }
  try {
    writeSalesAndTrafficReportByDate(process.env.SPREADSHEET_ID4, "AmaSG!A2:J", `${start}-07:00`, `${end}-07:00`, "SG");
  } catch (error) {
    notifySlack(error);
  }

  try {
    writeSalesAndTrafficReportByDateAu(
      process.env.SPREADSHEET_ID4,
      "AmaAUS!A2:J",
      `${start}-07:00`,
      `${end}-07:00`,
      "AU"
    );
  } catch (error) {
    notifySlack(error);
  }
});

// 毎週木曜日日本時間夜11時に実行→JPのAPI戻るまで一旦更新なし

cron.schedule("0 23 * * 4", async () => {
  console.log("start update prices");
  try {
    await copyAndPasteFromSheetToSheet(
      process.env.SPREADSHEET_ID3,
      "Prod_DB!A2:D",
      process.env.SPREADSHEET_ID3,
      "Fetch_manual!A2:D"
    );

    await deleteSheetRange(process.env.SPREADSHEET_ID3, "Fetch_manual!C2:C");

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
    }
  } catch (error) {
    notifySlack(error);
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
