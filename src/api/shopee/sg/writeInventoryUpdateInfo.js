require("dotenv").config();
const { config } = require("dotenv");
const {
  readSpreadsheetValue,
} = require("../../../lib/readSpreadsheetValue.js");
const {
  updateArrayDataToSheets,
} = require("../../../lib/updateArrayDataToSheets.js");

const writeInventoryUpdateInfoSpSg = async (
  spreadsheetId,
  configSheet,
  curSellingSheet,
  dbSheet
) => {
  // configシートから価格計算に必要なデータを取得
  const readRangeForRates = `${configSheet}!F3:I3`;
  const readRangeForShippingFees = `${configSheet}!F6:G`;

  const rates = await readSpreadsheetValue(spreadsheetId, readRangeForRates);
  const shippingFees = await readSpreadsheetValue(
    spreadsheetId,
    readRangeForShippingFees
  );

  const profitRate = parseFloat(rates[0][0]);
  const amazonFeeRate = parseFloat(rates[0][1]);
  const currencyRate = parseFloat(rates[0][2]);
  const otherFees = parseFloat(rates[0][3]); //国内の作業手数料300円を原価に加算

  // ShopeeはSLSで1種類のみ→shippingFeeObj不要

  const shippingFeeObj = {};
  shippingFees.forEach((arr) => {
    shippingFeeObj[arr[0]] = arr[1];
  });

  // console.log(shippingFeeObj);

  //Prod_DBから最新データを格納したobj作成;

  const dbReadRange = `${dbSheet}!D2:J`;
  const dbSheetData = await readSpreadsheetValue(spreadsheetId, dbReadRange);

  // console.log(dbSheetData.slice(0, 10));

  const dbDataAsinObj = dbSheetData.reduce((acc, arr) => {
    acc[arr[0]] = {
      ["price"]: arr[1],
      ["method"]: arr[4],
      ["weight"]: arr[5],
    };
    return acc;
  }, {});

  // 現在販売中の出品データ取得

  const readRangeForCurSelling = `${curSellingSheet}!A2:J`;
  const curSellingArr = await readSpreadsheetValue(
    spreadsheetId,
    readRangeForCurSelling
  );
  const newPriceInventoryArr = [];

  //ここから繰り返し処理

  // const dbDataAsinObjTest = {
  //   B07NDPBNMD: { price: "5500", method: "smallPacket", weight: "440" },
  //   B001O2VIO0: { price: "-", method: "smallPacket", weight: "400" },
  //   B00JZHTFO6: { price: "662", method: "smallPacket", weight: "222" },
  //   B00B8PQZIC: { price: "-", method: "EMS", weight: "2020" },
  //   B00JDKYKJK: { price: "662", method: "smallPacket", weight: "226" },
  //   B0748D89SG: { price: "1980", method: "smallPacket", weight: "340" },
  //   B07CZXN51F: { price: "6187", method: "smallPacket", weight: "340" },
  //   B089SLNLQJ: { price: "10411", method: "smallPacket", weight: "300" },
  //   B08NJB86X1: { price: "12488", method: "smallPacket", weight: "320" },
  //   B07NB4HQYJ: { price: "5500", method: "smallPacket", weight: "310" },
  //   B09XHNKYL8: { price: "2227", method: "smallPacket", weight: "360" },
  //   B000S7NB2Y: { price: "6920", method: "EMS", weight: "9200" },
  // };

  curSellingArr.forEach((item) => {
    const bMatch = item[5].match(/B[A-Z0-9]{9}/);
    const numberMatch = item[5].match(/[0-9]{10}/);

    asin = bMatch ? bMatch[0] : numberMatch ? numberMatch[0] : null;

    // console.log(dbDataAsinObj[asin]);

    // console.log(dbDataAsinObj[asin].price);

    if (!dbDataAsinObj[asin]) {
      newPriceInventoryArr.push([
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[6],
        0,
      ]);
      return;
    }

    //条件0  配送methodがblankerror or sizeoverの場合は在庫0にする

    if (
      dbDataAsinObj[asin].method == "size over" ||
      dbDataAsinObj[asin].method == "blank error"
    ) {
      newPriceInventoryArr.push([
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[6],
        0,
      ]);
      return;
    }

    // 条件1.priceがnullならInventory 0 で配列作成
    if (
      dbDataAsinObj[asin].price == "-" ||
      dbDataAsinObj[asin].price == "" ||
      dbDataAsinObj[asin].price == "InvalidInput"
    ) {
      newPriceInventoryArr.push([
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[6],
        0,
      ]);
      return;
    }

    // 条件2 Priceあるなら出品価格計算
    //出品価格は 原価(商品代金(税込み)+出荷手数料+国際送料) / SGD to JPY rate にさらに 1-手数料 - 利益率で割る
    //国際送料の算出
    const shippingWeight = dbDataAsinObj[asin].weight;
    // const shippingMethod = dbDataAsinObj[asin].method;
    const newPrice = parseFloat(dbDataAsinObj[asin].price);
    let ceiledShippingWeight;
    if (shippingWeight <= 500) {
      ceiledShippingWeight = Math.ceil(shippingWeight / 100) * 100;
    } else {
      ceiledShippingWeight = Math.ceil(shippingWeight / 250) * 250;
    }
    console.log(
      "shippingWeight",
      shippingWeight,
      "ceiled",
      ceiledShippingWeight
    );

    const shippingFee = parseFloat(shippingFeeObj[ceiledShippingWeight]);

    const totalCost = shippingFee + otherFees + newPrice;
    const sgdTotalCost = Math.ceil(totalCost / currencyRate);
    const newListingPrice =
      Math.ceil((sgdTotalCost / (1 - profitRate - amazonFeeRate)) * 100) / 100;

    // 復活出品分は在庫50にもどす
    console.log(asin);
    console.log("new Listing price is", newListingPrice);
    console.log("new Listing price is", sgdTotalCost);
    console.log("totalCost", totalCost);
    console.log(
      "shippingFee,otherFees,newPrice",
      shippingFee,
      otherFees,
      newPrice
    );
    console.log("ceiledShippingWeight", ceiledShippingWeight);

    if (item[7] == "0") {
      newPriceInventoryArr.push([
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        newListingPrice,
        50,
      ]);

      return;
    }

    newPriceInventoryArr.push([
      item[0],
      item[1],
      item[2],
      item[3],
      item[4],
      item[5],
      newListingPrice,
      item[7],
    ]);

    // console.log("shippingFee is", shippingFee);
    // console.log("otherFees is", otherFees);
    // console.log("newPrice is", newPrice);
    // console.log("totalcost is", totalCost);
    // console.log("sgdTotalCost is", sgdTotalCost);
    // console.log("newListingPrice is", newListingPrice);
  });

  // console.log(newPriceInventoryArr);

  // process.exit();

  const writeRange = `${curSellingSheet}!M2:X`;

  updateArrayDataToSheets(spreadsheetId, writeRange, newPriceInventoryArr);
};

// writeInventoryUpdateInfoSpSg(
//   process.env.SPREADSHEET_ID3,
//   "Config_Sp",
//   "Sp_Sg_Selling",
//   "Prod_DB"
// );

module.exports = {
  writeInventoryUpdateInfoSpSg,
};
