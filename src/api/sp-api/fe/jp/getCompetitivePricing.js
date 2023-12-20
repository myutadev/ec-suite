const SellingPartnerAPI = require("amazon-sp-api");
const moment = require("moment-timezone");
require("dotenv").config();

const getCompetitivePricing = async (asins) => {
  let res;
  let resultArray = [];

  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "fe", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token_JP: process.env.refresh_token, // The refresh token of your app user
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID:
          process.env.SELLING_PARTNER_APP_CLIENT_ID_JP,
        SELLING_PARTNER_APP_CLIENT_SECRET:
          process.env.SELLING_PARTNER_APP_CLIENT_SECRET_JP,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });

    res = await sellingPartner.callAPI({
      operation: "getCompetitivePricing",
      endpoint: "productPricing",
      query: {
        MarketplaceId: "A1VC38T7YXB528", // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        Asins: asins,
        ItemType: "Asin",
      },
    });

    console.log("this is res[0]", res[0]); // res is array

    res.forEach((item) => {
      const tempArray = [];

      // 現在の日時をISO形式の文字列として取得
      const currentDateTimeJST = moment().tz("Asia/Tokyo").format();

      // 現在の日時を先頭（または任意の位置）に追加
      tempArray.push(currentDateTimeJST);

      tempArray.push(item.Product.Identifiers.MarketplaceASIN.ASIN);

      tempArray.push(
        item.Product?.CompetitivePricing?.CompetitivePrices[0]?.Price
          .LandedPrice.Amount ?? ""
      );
      tempArray.push(
        item.Product?.CompetitivePricing?.CompetitivePrices[0]?.Price
          .LandedPrice.CurrencyCode ?? ""
      );
      tempArray.push(
        item.Product?.CompetitivePricing?.NumberOfOfferListings[0]?.condition ??
          ""
      );
      tempArray.push(
        item.Product?.CompetitivePricing?.NumberOfOfferListings[0]?.Count ?? ""
      );
      tempArray.push(
        item.Product?.CompetitivePricing?.NumberOfOfferListings[1]?.condition ??
          ""
      );
      tempArray.push(
        item.Product?.CompetitivePricing?.NumberOfOfferListings[1]?.Count ?? ""
      );
      tempArray.push(
        item.Product?.CompetitivePricing?.NumberOfOfferListings[2]?.condition ??
          ""
      );
      tempArray.push(
        item.Product?.CompetitivePricing?.NumberOfOfferListings[2]?.Count ?? ""
      );

      resultArray.push(tempArray);
    });

    console.log(resultArray);
    return resultArray;
  } catch (e) {
    console.log(`probably ASIN:${asin} page is not exist`, e);
    return resultArray;
  }
};

module.exports = {
  getCompetitivePricing,
};
