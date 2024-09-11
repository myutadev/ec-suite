const SellingPartnerAPI = require("amazon-sp-api");
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue");
require("dotenv").config();

const marketPlaceId = {
  US: "ATVPDKIKX0DER",
  CA: "A2EUQ1WTGCTBG2",
  MX: "A1AM78C64UM0Y8",
  SG: "A19VAU5U5O7RUS",
  AU: "A39IBJ37TRP1C6",
};

const getCatalogItem = async (asin, marketPlace) => {
  let resCatalog;
  let resPrice;
  let resultArray = [];

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

    resPrice = await sellingPartner.callAPI({
      operation: "getCompetitivePricing",
      endpoint: "productPricing",
      query: {
        MarketplaceId: marketPlaceId[marketPlace], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        Asins: [asin],
        ItemType: "Asin",
      },
    });

    resCatalog = await sellingPartner.callAPI({
      operation: "getCatalogItem",
      endpoint: "catalogItems",
      path: {
        asin: asin,
      },
      query: {
        marketplaceIds: [marketPlaceId["AU"]], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        includedData: ["attributes", "images", "identifiers", "summaries", "salesRanks"],
      },
      options: {
        version: "2022-04-01",
      },
    });

    resultArray.push(resCatalog.attributes?.item_name[0]?.value ?? "no name");
    resultArray.push(resCatalog.summaries[0].brand),
      resultArray.push(resCatalog.identifiers[0]?.identifiers[0]?.identifier ?? "no identifier");
    // resultArray.push(resCatalog.attributes.list_price ? resCatalog.attributes?.list_price[0]?.value ?? 'no name' : 'no data')
    resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.CompetitivePrices[0]?.Price.LandedPrice.Amount ?? "");
    resultArray.push(
      resPrice[0]?.Product?.CompetitivePricing?.CompetitivePrices[0]?.Price.LandedPrice.CurrencyCode ?? ""
    );
    resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.NumberOfOfferListings[0]?.condition ?? "");
    resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.NumberOfOfferListings[0]?.Count ?? "");
    resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.NumberOfOfferListings[1]?.condition ?? "");
    resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.NumberOfOfferListings[1]?.Count ?? "");
    resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.NumberOfOfferListings[2]?.condition ?? "");
    resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.NumberOfOfferListings[2]?.Count ?? "");
    resultArray.push(resCatalog.salesRanks[0]?.classificationRanks?.[0]?.title ?? "no rank data");
    resultArray.push(resCatalog.salesRanks[0]?.classificationRanks?.[0]?.rank ?? "no rank data");
    resultArray.push(resCatalog.salesRanks[0]?.displayGroupRanks?.[0]?.title ?? "no rank data");
    resultArray.push(resCatalog.salesRanks[0]?.displayGroupRanks?.[0]?.rank ?? "no rank data");
    // Amazonもしくは保証という文字を含んでいる場合は空文字をpushする
    for (let i = 0; i < 5; i++) {
      let bulletStr = resCatalog.attributes?.bullet_point?.[i]?.value ?? "";
      resultArray.push(bulletStr);
    }
    // resultArray.push(resCatalog.attributes?.bullet_point?.[0]?.value ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[1]?.value  ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[2]?.value  ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[3]?.value  ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[4]?.value  ?? '')
    resultArray.push(
      resCatalog.attributes?.item_package_weight
        ? resCatalog.attributes?.item_package_weight[0]?.unit ?? "no package weight"
        : "no package weight data"
    );
    resultArray.push(
      resCatalog.attributes?.item_package_weight
        ? resCatalog.attributes?.item_package_weight[0]?.value ?? "no package weight"
        : "no package weight data"
    );
    resultArray.push(
      resCatalog.attributes?.item_package_dimensions
        ? resCatalog.attributes?.item_package_dimensions[0]?.length.unit ?? "no package dimensions"
        : "no package dimentions data"
    );
    resultArray.push(
      resCatalog.attributes?.item_package_dimensions
        ? resCatalog.attributes?.item_package_dimensions[0]?.length.value ?? "no package dimensions"
        : "no package dimentions data"
    );
    resultArray.push(
      resCatalog.attributes?.item_package_dimensions
        ? resCatalog.attributes?.item_package_dimensions[0]?.width.value ?? "no package dimensions"
        : "no package dimentions data"
    );
    resultArray.push(
      resCatalog.attributes?.item_package_dimensions
        ? resCatalog.attributes?.item_package_dimensions[0]?.height.value ?? "no package dimensions"
        : "no package dimentions data"
    );
    resultArray.push(resCatalog.images[0]?.images[0]?.link ?? "");
    resultArray.push(resCatalog.images[0]?.images[3]?.link ?? "");
    resultArray.push(resCatalog.images[0]?.images[6]?.link ?? "");
    resultArray.push(resCatalog.images[0]?.images[9]?.link ?? "");
    resultArray.push(resCatalog.images[0]?.images[12]?.link ?? "");
    resultArray.push(resCatalog.images[0]?.images[15]?.link ?? "");
    resultArray.push(resCatalog.images[0]?.images[18]?.link ?? "");
    console.log("reqult Array is", resultArray);
    return resultArray;
  } catch (e) {
    console.log(`probably ASIN:${asin} page is not exist`, e);
    return resultArray;
  }
  // return resCatalog;
};

const getCatalogItemFromSheet = async (spreadsheetId, range, marketPlace) => {
  const apiDataArray = [];
  const sheetValues = await readSpreadsheetValue(spreadsheetId, range);
  console.log(`sheetvalue is`, sheetValues);
  const asins = sheetValues.flat();
  console.log(`asins is `, asins);

  for (const asin of asins) {
    let fetchedData = await getCatalogItem(asin, marketPlace);
    apiDataArray.push(fetchedData);
  }
  // console.log(`apiDataArray is`,apiDataArray);

  return apiDataArray;
  a;
};

// getCatalogItem("B09RK9TN95", "US");

module.exports = {
  getCatalogItemFromSheet,
};
