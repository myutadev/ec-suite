const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const getSearchCatalogItems = async (keywordArray) => {
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

    resSearch = await sellingPartner.callAPI({
      operation: "searchCatalogItems",
      endpoint: "catalogItems",
      query: {
        keywords: keywordArray,
        marketplaceIds: ["A1VC38T7YXB528"], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        pageSize: 20,
        includedData: ["summaries", "relationships", "salesRanks"],
      },
      options: {
        version: "2022-04-01",
      },
    });
    // console.log(resSearch.items);
    // console.log(resSearch.items[0].relationships[0].relationships);  // [] -> バリエーションなし、

    return resSearch;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getSearchCatalogItems,
};

// getSearchCatalogItems(["遊戯王公式カードゲーム デュエルモンスターズ デュエリストカードプロテクター KC"]);
