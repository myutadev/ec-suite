const SellingPartnerAPI = require("amazon-sp-api");
const { getStartOfYesterday, getEndOfYesterday } = require("../../../../lib/getYesterday");
require("dotenv").config();

const marketPlaceId = {
  US: "ATVPDKIKX0DER",
  CA: "A2EUQ1WTGCTBG2",
  MX: "A1AM78C64UM0Y8",
  SG: "A19VAU5U5O7RUS",
};

const getOrderMetricSg = async (marketPlace) => {
  //const getShipments =
  let res;
  const start = `${getStartOfYesterday()}+08:00`; // `${getStartOfYesterday()}-07:00`
  const end = `${getEndOfYesterday()}+08:00`; //`${getEndOfYesterday()}-07:00`
  // const start = `2024-02-21T00:00:00+08:00`; // `${getStartOfYesterday()}-07:00`
  // const end = `2024-02-21T23:59:59+08:00`; //`${getEndOfYesterday()}-07:00`
  let yesterday = `${start}--${end}`;

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
    res = await sellingPartner.callAPI({
      operation: "getOrderMetrics", // ここ変更！
      endpoint: "sales", // ここも変更　無くても行ける
      path: "/sales/v1/orderMetrics", // ここ変更！
      query: {
        marketplaceIds: [marketPlaceId[marketPlace]], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        // interval: "2024-01-01T00:00:00+08:00--2024-01-02T00:00:00+08:00", //'2023-12-16T00:00:00-07:00--2023-12-17T00:00:00-07:00',// yesterday
        interval: yesterday, //'2023-12-16T00:00:00-07:00--2023-12-17T00:00:00-07:00',// yesterday
        granularity: "Day",
      },
    });
    console.log(res);
  } catch (e) {
    console.log(e);
    throw e;
  }
  return res;
};

// getOrderMetricSg("SG");

module.exports = {
  getOrderMetricSg,
};
