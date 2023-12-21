const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const getOrderAdressByOrderId = async (orderId) => {
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
      operation: "getOrderAddress",
      endpoint: "orders",
      path:{
      orderId:orderId
      },
    });


    // const resultArray = res.Orders;
    console.log("this is res", res); // res is array

    return res;
  } catch (e) {
    console.log(e);
    return;
  }
};

module.exports = {
  getOrderAdressByOrderId,
};

// getOrderAdressByOrderId('249-4638915-2561435')
