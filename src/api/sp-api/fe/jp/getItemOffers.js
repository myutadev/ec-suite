const SellingPartnerAPI = require("amazon-sp-api");
const moment = require("moment-timezone");
require("dotenv").config();

const getItemOffers = async (asin) => {
  let res;

  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "fe", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token: process.env.refresh_token_JP, // The refresh token of your app user
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID_JP,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET_JP,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });

    res = await sellingPartner.callAPI({
      operation: "getItemOffers",
      endpoint: "productPricing",
      query: {
        MarketplaceId: "A1VC38T7YXB528", // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        ItemCondition: "New",
      },
      path: {
        Asin: asin,
      },
    });
    // console.log("this is res", res);
    // console.log("this is res?.Offers[0]", res?.Offers[0].ListingPrice.Amount);
    // console.log("resis", res);

    const resultObj = {
      [res.ASIN]: {
        update: moment().tz("Asia/Tokyo").format(),
        Shipping: [
          res?.Offers[0] ? res?.Offers[0].Shipping.Amount ?? "" : "",
          res?.Offers[1] ? res?.Offers[1].Shipping.Amount ?? "" : "",
        ],
        LowestPrice: [
          res?.Offers[0] ? res?.Offers[0].ListingPrice.Amount ?? "" : "",
          res?.Offers[1] ? res?.Offers[1].ListingPrice.Amount ?? "" : "",
        ],
        BuyBoxPrices: Array.isArray(res.Summary.BuyBoxPrices)
          ? res.Summary.BuyBoxPrices[0]?.LandedPrice?.Amount ?? ""
          : "",
        TotalOfferCount: res?.Summary?.TotalOfferCount ?? "",
        Condition: res?.Offers[0]?.SubCondition ?? "",
        ShipsFromCountry: [
          res?.Offers[0] ? res?.Offers[0].ShipsFrom?.Country ?? "" : "",
          res?.Offers[1] ? res?.Offers[1].ShipsFrom?.Country ?? "" : "",
        ],
        AvailabilityType: [
          res?.Offers[0] ? res?.Offers[0].ShippingTime?.availabilityType ?? "" : "",
          res?.Offers[1] ? res?.Offers[1].ShippingTime?.availabilityType ?? "" : "",
        ],
        MaximumHours: [
          res?.Offers[0] ? res?.Offers[0].ShippingTime?.maximumHours ?? "" : "",
          res?.Offers[1] ? res?.Offers[1].ShippingTime?.maximumHours ?? "" : "",
        ],
        // MinimumHours: [
        //   res?.Offers[0] ? res?.Offers[0].ShippingTime?.minimumHours ?? "" : "",
        //   res?.Offers[1] ? res?.Offers[1].ShippingTime?.minimumHours ?? "" : "",
        // ],
      },
    };

    // console.log("resultObj is", resultObj);
    return resultObj;
  } catch (e) {
    // console.log(e.code);
    return {
      [asin]: {
        update: moment().tz("Asia/Tokyo").format(),
        error: e.code,
      },
    };
  }
};

module.exports = {
  getItemOffers,
};

// getItemOffers("B086ZS4RT1");
