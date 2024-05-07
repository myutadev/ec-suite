const SellingPartnerAPI = require("amazon-sp-api");
const moment = require("moment-timezone");
const { assemblePricingQueryParams } = require("./helpers/assemblePricingQueryParams");
require("dotenv").config();

const getItemOffersBatch = async (asinArr) => {
  const requestArr = await assemblePricingQueryParams(asinArr);

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

    console.log("request Arr is ", requestArr);

    const response = await sellingPartner.callAPI({
      body: {
        requests: requestArr,
      },
      api_path: "/batches/products/pricing/v0/itemOffers",
      method: "POST",
    });

    const resultObjArr = response.responses.map((responseObj) => {
      const res = responseObj.body.payload;

      const curResObj = {
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
        },
      };

      return curResObj;
    });

    // console.log("resultObjArr", resultObjArr);
    return resultObjArr;
  } catch (e) {
    console.log(e.code);
  }
};

module.exports = {
  getItemOffersBatch,
};

// getItemOffersBatch(["B000OQA3N4", "B00601CABA"]);
