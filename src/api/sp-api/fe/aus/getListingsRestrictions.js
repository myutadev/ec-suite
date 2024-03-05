const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const getListingsRestrictionsAu = async (asin) => {
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

    res = await sellingPartner.callAPI({
      operation: "getListingsRestrictions",
      endpoint: "listingsRestrictions",
      query: {
        asin: asin,
        marketplaceIds: ["A39IBJ37TRP1C6"], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        // conditionType: "new_new",
        sellerId: "AOWT96446IC50",
      },
    });

    let result;

    if (res.restrictions[0].reasons[0].message == "ASIN does not exist in this marketplace.") {
      result = "No page";
    } else {
      result = res.restrictions[0].reasons[0].reasonCode;
    }
    // console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  getListingsRestrictionsAu,
};
