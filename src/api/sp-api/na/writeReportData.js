const { appendArrayDataToSheets } = require("../../../lib/appendArrayDataToSheets.js");
const { getReportData } = require("./getReportData.js");
const { getStartOfYesterday, getEndOfYesterday } = require("../../../lib/getYesterday.js");
const fs = require("fs");
require("dotenv").config();

const writeReportData = async (spreadsheetId, range, reportName, start, end, marketPlace) => {
  console.log("writeBusinessReport starts");

  // 日付部分のみを切り取り
  const startDate = start.split("T")[0];

  try {
    const [amazonData] = await Promise.all([getReportData(reportName, start, end, marketPlace)]);
    if (amazonData == null) {
      console.log("no data for today");
      return;
    }

    const values = amazonData.map((obj) => {
      const row = [
        startDate,
        obj["snapshot-date"],
        obj["sku"],
        obj["fnsku"],
        obj["asin"],
        obj["product-name"],
        obj["condition"],
        obj["available"],
        obj["pending-removal-quantity"],
        obj["inv-age-0-to-90-days"],
        obj["inv-age-91-to-180-days"],
        obj["inv-age-181-to-270-days"],
        obj["inv-age-271-to-365-days"],
        obj["inv-age-365-plus-days"],
        obj["currency"],
        obj["qty-to-be-charged-ltsf-6-mo"],
        obj["projected-ltsf-6-mo"],
        obj["qty-to-be-charged-ltsf-12-mo"],
        obj["estimated-ltsf-next-charge"],
        obj["units-shipped-t7"],
        obj["units-shipped-t30"],
        obj["units-shipped-t60"],
        obj["units-shipped-t90"],
        obj["alert"],
        obj["your-price"],
        obj["sales-price"],
        obj["lowest-price-new-plus-shipping"],
        obj["lowest-price-used"],
        obj["recommended-action"],
        obj["healthy-inventory-level"],
        obj["recommended-sales-price"],
        obj["recommended-sale-duration-days"],
        obj["recommended-removal-quantity"],
        obj["estimated-cost-savings-of-recommended-actions"],
        obj["sell-through"],
        obj["item-volume"],
        obj["volume-unit-measurement"],
        obj["storage-type"],
        obj["storage-volume"],
        obj["marketplace"],
        obj["product-group"],
        obj["sales-rank"],
        obj["days-of-supply"],
        obj["estimated-excess-quantity"],
        obj["weeks-of-cover-t30"],
        obj["weeks-of-cover-t90"],
        obj["featuredoffer-price"],
        obj["sales-shipped-last-7-days"],
        obj["sales-shipped-last-30-days"],
        obj["sales-shipped-last-60-days"],
        obj["sales-shipped-last-90-days"],
        obj["inv-age-0-to-30-days"],
        obj["inv-age-31-to-60-days"],
        obj["inv-age-61-to-90-days"],
        obj["inv-age-181-to-330-days"],
        obj["inv-age-331-to-365-days"],
        obj["estimated-storage-cost-next-month"],
        obj["inbound-quantity"],
        obj["inbound-working"],
        obj["inbound-shipped"],
        obj["inbound-received"],
        obj["no-sale-last-6-months"],
        obj["reserved-quantity"],
        obj["unfulfillable-quantity"],
        obj["historical-days-of-supply"],
      ];
      return row;
    });

    //更新先のシート情報
    await appendArrayDataToSheets(spreadsheetId, range, values);
    console.log("writeInventoryhLedgerReport ends");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  writeReportData,
};

// writeReportData(
//   process.env.SPREADSHEET_ID,
//   "InvReport_US!A2:AB",
//   "GET_FBA_INVENTORY_PLANNING_DATA",
//   `2024-01-23T00:00:00-07:00`,
//   `2024-01-23T23:59:59-07:00`,
//   "US"
// );
// writeReportData(
//   process.env.SPREADSHEET_ID,
//   "InvReport_CA!A2:AB",
//   "GET_FBA_INVENTORY_PLANNING_DATA",
//   `2025-02-19T00:00:00-07:00`,
//   `2025-02-19T23:59:59-07:00`,
//   "CA"
// );

// const test = async () => {
//   const start = await getStartOfYesterday();
//   const end = await getEndOfYesterday();

//   writeReportData(
//     process.env.SPREADSHEET_ID,
//     "InvReport_US!A3:AB",
//     "GET_FBA_INVENTORY_PLANNING_DATA",
//     `${start}-07:00`,
//     `${end}-07:00`,
//     "US"
//   );
// };

// test();

// function formatDate(date) {
//   // ISOフォーマット（YYYY-MM-DDTHH:mm:ssZ）で日付を整形する関数
//   return date.toISOString();
// }

// function addDays(date, days) {
//   // 日付に指定された日数を加算する関数
//   let result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

// async function generateReports(startDate, endDate) {
//   let currentDate = new Date(startDate);

//   while (currentDate <= new Date(endDate)) {
//     // 開始時刻と終了時刻のフォーマット
//     const startDateTime = formatDate(currentDate);
//     const endDateTime = formatDate(addDays(currentDate, 1));

//     // レポート生成関数の実行
//     await writeReportData(
//       process.env.SPREADSHEET_ID,
//       "InvReport_CA!A2:AB",
//       "GET_FBA_INVENTORY_PLANNING_DATA",
//       startDateTime,
//       endDateTime,
//       "CA"
//     );

//     // 次の日に進む
//     currentDate = addDays(currentDate, 1);
//   }
// }

// generateReports("2024-01-07T00:00:00-07:00", "2024-01-08T23:59:59-07:00");
