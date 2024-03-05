const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { getReportData } = require("./getReportData.js");
require("dotenv").config();

const writeReportDataSg = async (spreadsheetId, range, reportName, start, end, marketPlace) => {
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
      const row = Object.values(obj);
      row.unshift(startDate);
      return row;
    });

    //更新先のシート情報
    await appendArrayDataToSheets(spreadsheetId, range, values);
    console.log("writeInventoryhLedgerReport ends");
  } catch (err) {
    console.error(err);
  }
};

// writeReportDataSg(
//   process.env.SPREADSHEET_ID,
//   "AmaSG!A2:J",
//   "GET_FBA_INVENTORY_PLANNING_DATA",
//   "2024-01-08T00:00:00-07:00",
//   "2024-01-08T23:59:59-07:00",
//   "SG"
// );

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
//       "InvReport_CA!A3:AB",
//       "GET_FBA_INVENTORY_PLANNING_DATA",
//       startDateTime,
//       endDateTime,
//       "CA"
//     );

//     // 次の日に進む
//     currentDate = addDays(currentDate, 1);
//   }
// }

// generateReports("2024-01-06T00:00:00-07:00", "2024-01-06T23:59:59-07:00");

module.exports = {
  writeReportDataSg,
};
