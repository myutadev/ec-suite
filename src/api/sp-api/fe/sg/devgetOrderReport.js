const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const getOrderReport = async () => {
  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "fe", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token: process.env.refresh_token_SG,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID:
          process.env.SELLING_PARTNER_APP_CLIENT_ID_SG,
        SELLING_PARTNER_APP_CLIENT_SECRET:
          process.env.SELLING_PARTNER_APP_CLIENT_SECRET_SG,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });

    res = await sellingPartner.callAPI({
      operation: "getOrders",
      endpoint: "orders",
      query: {
        MarketplaceIds: ["A19VAU5U5O7RUS"], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        // LastUpdatedAfter: '2023-12-17T00:00:00',  // CreatedAfter 
        // LastUpdatedBefore: '2023-12-20T12:00:00', // CreatedBefore
        CreatedAfter: '2023-12-18T00:00:00',  // CreatedAfter 
        CreatedBefore: '2023-12-19T23:59:59', // CreatedBefore
        // OrderStatuses:'Unshipped'
      },
    });
    const resultArray = res.Orders;
    console.log("this is resultArray", resultArray); // res is array

    return resultArray;
  } catch (e) {
    console.log(e);
    return;
  }
};

module.exports = {
  getOrderReport,
};
