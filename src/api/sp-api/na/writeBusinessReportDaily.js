const { getBusinessReport } = require("./getBusinessReport.js");
const { getCurSellingFbaInventoryObj } = require("./getCurSellingFbaInventoryObj.js");
const { appendArrayDataToSheets } = require("../../../lib/appendArrayDataToSheets.js");
const { readSpreadsheetValue } = require("../../../lib/readSpreadsheetValue.js");
const { getAsinTitleObj } = require("./getAsinTitleObj.js");
require("dotenv").config();

const writeBusinessReportDaily = async (spreadsheetId, range, marketPlace, start, end) => {
  console.log("writeBusinessReport starts");

  try {
    const [asinTitleObj, amazonData] = await Promise.all([
      getAsinTitleObj(marketPlace),
      getBusinessReport(start, end, marketPlace),
      // getCurSellingFbaInventoryObj(marketPlace),
    ]);
    if (amazonData == null) {
      console.log("no data for today");
      return;
    }

    const jsonData = JSON.parse(amazonData);
    // console.log(jsonData);
    // console.log(jsonData.salesAndTrafficByAsin.slice(0, 3));

    const values = jsonData.salesAndTrafficByAsin.map((item) => {
      const sku = asinTitleObj[item.childAsin]?.sku ?? "";

      return [
        jsonData.reportSpecification.dataStartTime,
        jsonData.reportSpecification.dataEndTime,
        item.parentAsin,
        item.childAsin,
        asinTitleObj[item.childAsin]?.name ?? "",
        asinTitleObj[item.childAsin]?.sku ?? "",
        asinTitleObj[item.childAsin]?.price ?? "",
        asinTitleObj[item.childAsin]?.quantity ?? "",
        item.trafficByAsin.sessions,
        item.trafficByAsin.sessionsB2B,
        item.trafficByAsin.sessionPercentage / 100,
        item.trafficByAsin.sessionPercentageB2B / 100,
        item.trafficByAsin.pageViews,
        item.trafficByAsin.pageViewsB2B,
        item.trafficByAsin.pageViewsPercentage / 100,
        item.trafficByAsin.pageViewsPercentageB2B / 100,
        item.trafficByAsin.buyBoxPercentage / 100,
        item.trafficByAsin.buyBoxPercentageB2B / 100,
        item.salesByAsin.unitsOrdered,
        item.salesByAsin.unitsOrderedB2B,
        item.trafficByAsin.unitSessionPercentage / 100,
        item.trafficByAsin.unitSessionPercentageB2B / 100,
        item.salesByAsin.orderedProductSales.amount,
        item.salesByAsin.orderedProductSalesB2B.amount,
        item.salesByAsin.totalOrderItems,
        item.salesByAsin.totalOrderItemsB2B,
        // curSellingObj[sku] ? curSellingObj[sku]["totalQuantity"] : "none",
        // curSellingObj[sku] ? curSellingObj[sku]["lastUpdatedTime"] : "none",
      ];
    });
    console.log(values);
    // process.exit();

    //更新先のシート情報
    try {
      await appendArrayDataToSheets(spreadsheetId, range, values);
    } catch (error) {
      throw error;
    }
    console.log("writeInventoryhLedgerReport ends");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

writeBusinessReportDaily(
  process.env.SPREADSHEET_ID,
  "BizReport_CA!A2:AH",
  "CA",
  "2025-01-24T00:00:00-07:00",
  "2025-03-22T23:59:59-07:00"
);

// writeBusinessReportDaily(
//   process.env.SPREADSHEET_ID,
//   "BizReport_US!A2:AH",
//   "US",
//   "2025-01-24T00:00:00-07:00",
//   "2025-03-22T23:59:59-07:00"
// );

module.exports = {
  writeBusinessReportDaily,
};

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
//     await writeBusinessReportDaily(process.env.SPREADSHEET_ID, "BizReport_CA!A2:AH", "CA", startDateTime, endDateTime);

//     // 次の日に進む
//     currentDate = addDays(currentDate, 1);
//   }
// }

// // 開始日と終了日を設定し、レポート生成関数を実行
// generateReports("2024-01-09T00:00:00-07:00", "2024-01-23T23:59:59-07:00");
