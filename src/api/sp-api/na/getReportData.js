const SellingPartnerAPI = require("amazon-sp-api");
const { formatReportResponse } = require("../../../lib/formatReportResponse");
require("dotenv").config();

const marketPlaceId = {
  US: "ATVPDKIKX0DER",
  CA: "A2EUQ1WTGCTBG2",
  MX: "A1AM78C64UM0Y8",
};

const getReportData = async (reportName, start, end, marketPlace) => {
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

    const formattedRes = await formatReportResponse(res);

    console.log(formattedRes);
    return formattedRes;
  } catch (e) {
    console.log(e);
  }
  console.log("Function end!");
};

module.exports = {
  getReportData,
};

//手動用

// getReportData("GET_FBA_INVENTORY_PLANNING_DATA", "2023-12-15T00:00:00-07:00", "2023-12-15T23:59:59-07:00", "CA");
