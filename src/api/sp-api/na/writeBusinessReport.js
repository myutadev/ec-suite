const { getBusinessReport } = require("./getBusinessReport");
const { getCurSellingFbaInventoryObj } = require("./getCurSellingFbaInventoryObj.js");
const { appendArrayDataToSheets } = require("../../../lib/appendArrayDataToSheets");
const { readSpreadsheetValue } = require("../../../lib/readSpreadsheetValue");
const { getAsinTitleObj } = require("./getAsinTitleObj");
require("dotenv").config();

const writeBusinessReport = async () => {
  console.log("writeBusinessReport starts");
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetValues = await readSpreadsheetValue(spreadsheetId, "businessReport!A2:C2");

  const start = sheetValues[0][1];
  const end = sheetValues[0][2];
  const marketPlace = sheetValues[0][0];

  try {
    const [asinTitleObj, amazonData, curSellingObj] = await Promise.all([
      getAsinTitleObj(marketPlace),
      getBusinessReport(start, end, marketPlace),
      getCurSellingFbaInventoryObj(marketPlace),
    ]);
    if (amazonData == null) {
      console.log("no data for today");
      return;
    }

    const jsonData = JSON.parse(amazonData);

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
        // curSellingObj[sku]? curSellingObj[sku]['totalQuantity']:"none",
        // curSellingObj[sku]? curSellingObj[sku]['lastUpdatedTime']:"none"
      ];
    });
    // console.log(values);

    //更新先のシート情報
    const range = "businessReport!A4:AH"; // 更新する範囲を指定
    console.log("check before append data", spreadsheetId, range, values);

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

module.exports = {
  writeBusinessReport,
};

// writeBusinessReport();
