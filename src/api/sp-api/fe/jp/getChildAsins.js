const SellingPartnerAPI = require("amazon-sp-api");
require("dotenv").config();

const getChildAsins = async (asin) => {
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

    resCatalog = await sellingPartner.callAPI({
      operation: "getCatalogItem",
      endpoint: "catalogItems",
      path: {
        asin: asin,
      },
      query: {
        marketplaceIds: ["A1VC38T7YXB528"], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        includedData: ["attributes", "relationships", "summaries", "salesRanks"],
      },
      options: {
        version: "2022-04-01",
      },
    });
    const asinsArr = resCatalog?.relationships[0]?.relationships[0]?.childAsins ?? "";
    console.log("asinsArr", asinsArr);
    const asinsWithInfo = asinsArr.map((asin) => {
      return [
        asin,
        resCatalog.summaries[0].brand,
        resCatalog.summaries[0].itemName,
        resCatalog.summaries[0].websiteDisplayGroup,
        resCatalog.summaries[0]?.modelNumber ?? "",
        resCatalog.salesRanks[0]?.classificationRanks?.[0]?.title ?? "no rank data",
        resCatalog.salesRanks[0]?.classificationRanks?.[0]?.rank ?? "no rank data",
        resCatalog.salesRanks[0]?.displayGroupRanks?.[0]?.title ?? "no rank data",
        resCatalog.salesRanks[0]?.displayGroupRanks?.[0]?.rank ?? "no rank data",
      ];
    });

    console.log("asins with info", asinsWithInfo);

    return asinsWithInfo;
  } catch (e) {
    console.log(`probably ASIN:${asin} page is not exist`, e);
    return resultArray;
  }
};

// getChildAsins("B0BLGQ7362"); // 親ASINでリクエスト
// getChildAsins("B083X76H61"); // 子ASINでリクエスト
// getChildAsins("B09P37W3LZ"); // バリエーションなしでリクエスト
// getChildAsins("B098YGC4KP");

module.exports = {
  getChildAsins,
};
