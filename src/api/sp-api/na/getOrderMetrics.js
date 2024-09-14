const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const marketPlaceId = {
  US: "ATVPDKIKX0DER",
  CA: "A2EUQ1WTGCTBG2",
  MX: "A1AM78C64UM0Y8",
};

const getOrderMetrics = async (marketPlace,start,end) => {
  //const getShipments =
  let res;
  let yesterday = `${start}--${end}`;

  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "na", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token: process.env.refresh_token, // The refresh token of your app user
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
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
        interval: yesterday, //'2024-01-23T00:00:00-07:00--2024-01-24T00:00:00-07:00',// yesterday
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

// getOrderMetrics('CA')

module.exports = {
  getOrderMetrics,
};
