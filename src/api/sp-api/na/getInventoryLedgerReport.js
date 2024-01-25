const SellingPartnerAPI = require("amazon-sp-api");
const { getStartOfYesterday, getEndOfYesterday } = require("../../../lib/getYesterday");
require("dotenv").config();

const getInventoryLedgerReport = async () => {
  console.log("Function started!");
  const start = `${getStartOfYesterday()}-07:00`; // `${getStartOfYesterday()}-07:00`
  const end = `${getEndOfYesterday()}-07:00`; //`${getEndOfYesterday()}-07:00`

  let res;
  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "na",
      refresh_token: process.env.refresh_token,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });
    res = await sellingPartner.downloadReport({
      body: {
        reportType: "GET_LEDGER_SUMMARY_VIEW_DATA",
        marketplaceIds: ["ATVPDKIKX0DER"],
        dataStartTime: start, // 2023-09-10T00:00:00-07:00
        dataEndTime: end, //2023-09-10T23:59:59-07:00
        // dataStartTime: `2024-01-01T00:00:00-07:00`, // 2023-09-10T00:00:00-07:00
        // dataEndTime: `2024-01-23T23:59:59-07:00`, //2023-09-10T23:59:59-07:00
        reportOptions: {
          aggregateByLocation: "COUNTRY",
          aggregatedByTimePeriod: "DAILY",
        },
      },
      version: "2021-06-30",
      interval: 8000,
    });
    console.log("result for inventory data", res);
  } catch (e) {
    console.log(e);
  }
  console.log("Function end!");
  return res;
};

module.exports = {
  getInventoryLedgerReport,
};

// getInventoryLedgerReport();
