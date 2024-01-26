const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const getActiveInventoryReport = async () => {
  console.log("getAcriveInventoryReport Function started!");
  let res;
  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "fe", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token: process.env.refresh_token_AU, // The refresh token of your app user
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID_AU,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET_AU,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });
    res = await sellingPartner.downloadReport({
      body: {
        reportType: "GET_MERCHANT_LISTINGS_DATA",
        marketplaceIds: ["A39IBJ37TRP1C6"],
        // dataStartTime : startOfYesterday, // 2023-09-10T00:00:00-07:00
        // dataEndTime : getEndOfYesterday(startOfYesterday),//2023-09-10T23:59:59-07:00
        reportOptions: {
          aggregateByLocation: "COUNTRY",
          aggregatedByTimePeriod: "DAILY",
        },
      },
      version: "2021-06-30",
      interval: 8000,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
  console.log("Function end!");
  return res;
};

module.exports = {
  getActiveInventoryReport,
};

// getActiveInventoryReport();
