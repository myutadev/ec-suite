const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const marketPlaceId = {
  US: "ATVPDKIKX0DER",
  CA: "A2EUQ1WTGCTBG2",
  MX: "A1AM78C64UM0Y8",
  SG: "A19VAU5U5O7RUS",
};

const getJsonReportData = async (reportName, start, end, marketPlace) => {
  console.log("getBusinessReport Function started!");
  let res;
  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "fe",
      refresh_token: process.env.refresh_token_SG,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID_SG,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET_SG,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });
    res = await sellingPartner.downloadReport({
      body: {
        reportType: reportName,
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

    const jsonData = JSON.parse(res);

    console.log(jsonData.salesAndTrafficByDate);
    return jsonData;
  } catch (e) {
    console.log(e);
    throw e;
  }
  console.log("Function end!");
};

module.exports = {
  getJsonReportData,
};

//手動用

// getJsonReportData("GET_SALES_AND_TRAFFIC_REPORT", "2024-01-08T00:00:00-07:00", "2024-01-08T23:59:59-07:00", "SG");
