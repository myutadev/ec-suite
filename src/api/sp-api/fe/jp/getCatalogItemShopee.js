const SellingPartnerAPI = require("amazon-sp-api");
const { checkStringIncludes } = require("../../../../lib/checkStringIncludes");
const { getAvailablePrice } = require("../sg/getAvailablePrice");
require("dotenv").config();

const getCatalogItemShopee = async (asin) => {
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

    //価格取得1
    resPrice = await sellingPartner.callAPI({
      operation: "getCompetitivePricing",
      endpoint: "productPricing",
      query: {
        MarketplaceId: "A1VC38T7YXB528", // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        Asins: [asin],
        ItemType: "Asin",
      },
    });

    //価格取得2
    const resPrice2 = await getAvailablePrice(asin);

    //その他データ取得
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

    console.log("resCatalog is", resCatalog);
    console.log("attributes is", resCatalog.attributes);

    // 共通項目
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

    //Shopee用追加分
    const parentAsin = resCatalog.relationships[0].relationships[0]?.parentAsins[0] ?? "";
    const category1 = resCatalog.summaries[0].websiteDisplayGroupName;
    const category2 = resCatalog.summaries[0].browseClassification.displayName;
    resultArray.push(parentAsin);
    resultArray.push(category1);
    resultArray.push(category2);

    if (!parentAsin) {
      resultArray.push("");
      resultArray.push("");
      resultArray.push("");
      resultArray.push("");
    } else {
      const parentAsinRes = await sellingPartner.callAPI({
        operation: "getCatalogItem",
        endpoint: "catalogItems",
        path: {
          asin: parentAsin,
        },
        query: {
          marketplaceIds: ["A1VC38T7YXB528"], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
          includedData: ["attributes", "images", "identifiers", "summaries", "salesRanks", "relationships"],
        },
        options: {
          version: "2022-04-01",
        },
      });

      const attributionsArr = parentAsinRes.relationships[0].relationships?.[0].variationTheme?.attributes ?? "";
      console.log("attributions arr is", attributionsArr);

      //親ASINがある時点で最低1つはattributionsがある。4つのときは出力させない。
      if (attributionsArr.length > 4) {
        return resultArray;
      }
      resultArray.push(attributionsArr[0]);
      resultArray.push(resCatalog.attributes[attributionsArr[0]][0].value);

      // attributionsが2種類のときと3種類のときで処理を分ける。3種類なら 後ろの2つは連結させる
      switch (attributionsArr.length) {
        case 1:
          resultArray.push("");
          resultArray.push("");
          break;
        case 2:
          resultArray.push(attributionsArr[1]);
          resultArray.push(resCatalog.attributes[attributionsArr[1]][0].value);
          break;
        case 3:
          resultArray.push(`${attributionsArr[1]} / ${attributionsArr[2]}`);
          resultArray.push(
            `${resCatalog.attributes[attributionsArr[1]][0].value} / ${
              resCatalog.attributes[attributionsArr[2]][0].value
            }`
          );
          break;

        case 4:
          resultArray.push(`${attributionsArr[1]} / ${attributionsArr[2]} / ${attributionsArr[3]}`);
          resultArray.push(
            `${resCatalog.attributes[attributionsArr[1]][0].value} / ${
              resCatalog.attributes[attributionsArr[2]][0].value
            } / ${resCatalog.attributes[attributionsArr[3]][0].value}`
          );
          break;
      }
    }
    //AmazonClasification ID

    resultArray.push(resCatalog.classifications[0].classifications[0]?.classificationId ?? "");

    return resultArray;
  } catch (e) {
    console.log(`probably ASIN:${asin} page is not exist`, e);
    return resultArray;
  }
};

//
// getCatalogItem("B08GFH65D5"); // iwaki

module.exports = {
  getCatalogItemShopee,
};
