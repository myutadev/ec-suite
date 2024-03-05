const SellingPartnerAPI = require("amazon-sp-api");
const { formatReportResponse } = require("../../../lib/formatReportResponse");
require("dotenv").config();

const marketPlaceId = {
  US: "ATVPDKIKX0DER",
  CA: "A2EUQ1WTGCTBG2",
  MX: "A1AM78C64UM0Y8",
};

const getAfnInventoryData = async (marketPlace) => {
  console.log("Function started!");

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
        reportType: "GET_AFN_INVENTORY_DATA", // https://developer-docs.amazon.com/sp-api/docs/report-type-values-fba
        marketplaceIds: [marketPlaceId[marketPlace]],
        // dataStartTime : start, // 2023-09-10T00:00:00-07:00
        // dataEndTime : end,//2023-09-10T23:59:59-07:00
        // dataStartTime : `2023-12-17T00:00:00-07:00`, // 2023-09-10T00:00:00-07:00
        // dataEndTime : `2023-12-17T23:59:59-07:00`,//2023-09-10T23:59:59-07:00
        // reportOptions:{
        // aggregateByLocation:'COUNTRY',
        // aggregatedByTimePeriod:'DAILY'
        // }
      },
      version: "2021-06-30",
      interval: 8000,
    });
    // console.log(res);

    const formatedData = await formatReportResponse(res);

    console.log(formatedData);
  } catch (e) {
    console.log(e);
    throw e;
  }
  console.log("Function end!");
  return formatedData;
};

module.exports = {
  getAfnInventoryData,
};

// getAfnInventoryData("CA");
