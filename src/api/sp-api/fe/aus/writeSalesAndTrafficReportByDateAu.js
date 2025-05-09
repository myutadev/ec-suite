const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { getJsonReportData } = require("./getJsonReportData.js");
require("dotenv").config();
const { getStartOfYesterday, getEndOfYesterday } = require("../../../../lib/getYesterday.js");

const writeSalesAndTrafficReportByDateAu = async (spreadsheetId, range, start, end, marketPlace) => {
  console.log("writeSalesAndTrafficReportByDate starts");

  try {
    const [amazonData] = await Promise.all([
      getJsonReportData("GET_SALES_AND_TRAFFIC_REPORT", start, end, marketPlace),
    ]);
    if (amazonData == null) {
      console.log("no data for today");
      return;
    }
    const amazonDataByDate = amazonData.salesAndTrafficByDate;
    console.log("log from write", amazonDataByDate);

    const values = amazonDataByDate.map((obj) => {
      const row = [];
      row.push(obj.date);
      row.push(obj.salesByDate.orderedProductSales.amount);
      row.push(obj.salesByDate.unitsOrdered);
      row.push(obj.salesByDate.totalOrderItems);
      row.push(obj.salesByDate.averageSalesPerOrderItem.amount);
      row.push(obj.salesByDate.averageUnitsPerOrderItem);
      row.push(obj.salesByDate.averageSellingPrice.amount);
      row.push(obj.trafficByDate.sessions);
      row.push(obj.trafficByDate.orderItemSessionPercentage / 100);
      row.push(obj.trafficByDate.averageOfferCount);
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

// const test = async () => {
//   const start = "2024-02-16T00:00:00";
//   const end = "2024-03-01T23:59:59";
//   console.log(start);
//   console.log(end);
//   writeSalesAndTrafficReportByDateAu(
//     process.env.SPREADSHEET_ID4,
//     "AmaAUS!A2:J",
//     `${start}-07:00`,
//     `${end}-07:00`,
//     "AU"
//   );
// };

// test();

module.exports = {
  writeSalesAndTrafficReportByDateAu,
};
