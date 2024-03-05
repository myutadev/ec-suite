const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const marketPlaceId = {
  US: "ATVPDKIKX0DER",
  CA: "A2EUQ1WTGCTBG2",
  MX: "A1AM78C64UM0Y8",
};

const getBusinessReport = async (start, end, marketPlace) => {
  console.log("getBusinessReport Function started!");
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
        reportType: "GET_SALES_AND_TRAFFIC_REPORT",
        marketplaceIds: [marketPlaceId[marketPlace]],
        dataStartTime: start, // 2023-09-10T00:00:00-07:00 startOfYesterday
        dataEndTime: end, //2023-09-10T23:59:59-07:00 getEndOfYesterday(startOfYesterday)
        reportOptions: {
          dateGranularity: "DAY", //DAY, WEEK, MONTH. Default: DAY.
          asinGranularity: "CHILD", //PARENT, CHILD, SKU. Default: PARENT.
        },
      },
      version: "2021-06-30",
      interval: 8000,
    });
    // console.log(res);
  } catch (e) {
    console.log(e);
    throw e;
  }
  console.log("Function end!");
  return res;
};

module.exports = {
  getBusinessReport,
};

//手動用

// getBusinessReport("2024-01-05T00:00:00-07:00","2024-01-05T23:59:59-07:00","CA")
