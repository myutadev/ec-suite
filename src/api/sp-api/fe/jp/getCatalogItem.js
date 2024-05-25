const SellingPartnerAPI = require("amazon-sp-api");
const { checkStringIncludes } = require("../../../../lib/checkStringIncludes");
const { getAvailablePrice } = require("../sg/getAvailablePrice");
require("dotenv").config();

const getCatalogItem = async (asin) => {
  let resCatalog;
  let resPrice;
  let resultArray = [];

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

    resPrice = await sellingPartner.callAPI({
      operation: "getCompetitivePricing",
      endpoint: "productPricing",
      query: {
        MarketplaceId: "A1VC38T7YXB528", // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        Asins: [asin],
        ItemType: "Asin",
      },
    });

    const resPrice2 = await getAvailablePrice(asin);

    resCatalog = await sellingPartner.callAPI({
      operation: "getCatalogItem",
      endpoint: "catalogItems",
      path: {
        asin: asin,
      },
      query: {
        marketplaceIds: ["A1VC38T7YXB528"], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        includedData: [
          "attributes",
          "images",
          "identifiers",
          "summaries",
          "salesRanks",
          "relationships",
          "classifications",
        ],
      },
      options: {
        version: "2022-04-01",
      },
    });
    // console.log("resCatalog is", resCatalog);

    resultArray.push(resCatalog.attributes?.item_name[0]?.value ?? "no name");
    resultArray.push(resCatalog.summaries[0].brand),
      resultArray.push(resCatalog.identifiers[0]?.identifiers[0]?.identifier ?? "no identifier");
    // resultArray.push(resCatalog.attributes.list_price ? resCatalog.attributes?.list_price[0]?.value ?? 'no name' : 'no data')
    resultArray.push(resPrice2);
    // resultArray.push(resPrice[0]?.Product?.CompetitivePricing?.CompetitivePrices[0]?.Price.LandedPrice.Amount ?? "");
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
      if (checkStringIncludes(bulletStr, "Amazon", "保証")) {
        resultArray.push(bulletStr);
      } else {
        resultArray.push("");
      }
    }
    // resultArray.push(resCatalog.attributes?.bullet_point?.[0]?.value ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[1]?.value  ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[2]?.value  ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[3]?.value  ?? '')
    // resultArray.push(resCatalog?.attributes?.bullet_point?.[4]?.value  ?? '')

    // kilograms pounds gramsの三種類があるので、gramsに統一する
    const weightUnit = resCatalog.attributes?.item_package_weight
      ? resCatalog.attributes?.item_package_weight[0]?.unit ?? "no package weight"
      : "no package weight data";

    const weightData = resCatalog.attributes?.item_package_weight
      ? resCatalog.attributes?.item_package_weight[0]?.value ?? "no package weight"
      : "no package weight data";

    const poundToGramUnit = 453.592;
    const kgToGramUnit = 1000;

    if (weightUnit === "no package weight" || weightUnit == "no package weight data") {
      resultArray.push("no package weight");
    } else {
      resultArray.push("grams");
    }

    switch (weightUnit) {
      case "pounds":
        resultArray.push(Math.ceil(parseFloat(weightData) * poundToGramUnit));
        break;
      case "kilograms":
        resultArray.push(Math.ceil(parseFloat(weightData) * kgToGramUnit));
        break;
      case "grams":
        resultArray.push(Math.ceil(parseFloat(weightData)));
        break;
      default:
        resultArray.push("no package weight");
        break;
    }
    // resultArray.push(
    //   resCatalog.attributes?.item_package_weight
    //     ? resCatalog.attributes?.item_package_weight[0]?.value ??
    //         "no package weight"
    //     : "no package weight data"
    // );
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
    resultArray.push(resCatalog.classifications[0].classifications[0]?.classificationId ?? "");

    // console.log(`result array is `,resultArray);

    // await apiDataArray.push(resultArray);
    // console.log(`asin:${asin} success`,)
    return resultArray;
  } catch (e) {
    console.log(`probably ASIN:${asin} page is not exist`, e);
    return resultArray;
  }
};

// getCatalogItem("B0CHQDF4K3"); // iwaki
// getCatalogItem("B0BGXYCQD8"); // iwaki
// getCatalogItem("B00FVH32QG"); // iwaki
// getCatalogItem("B0CJJ9GCHT"); // iwaki
// getCatalogItem("B08GFH65D5"); // iwaki

module.exports = {
  getCatalogItem,
};
