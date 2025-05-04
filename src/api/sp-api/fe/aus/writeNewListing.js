require("dotenv").config();
const { getToday, getTodayShort } = require("../../../../lib/getToday.js");
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { batchUpdateArrayDataToSheets } = require("../../../../lib/batchUpdateArrayDataToSheets.js");

const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { getSellingPrice } = require("../sg/getSellingPrice.js");

const writeNewListingAu = async (
  spreadsheetId,
  configSheet,
  newListingSheet,
  dbSheet
  // readStart,
  // readEnd
) => {
  // Prod_DBからデータ取得 A:R
  const dbDataArr = await readSpreadsheetValue(spreadsheetId, `${dbSheet}!A2:R`);


  const notUploadedArr = [];
  dbDataArr.forEach((item) => {
    if (item[17] == "FALSE") {
      // ここを国ごとに編集
      notUploadedArr.push(item);
    }
  });
  // console.log("not uploaded arr", notUploadedArr);

  const resultArr = [];
  const today = await getTodayShort();

  const updateRanges = [];
  const updateData = [];

  const readRangeForRates = `${configSheet}!G3:J3`;
  const readRangeForShippingFees = `${configSheet}!G6:J`;

  const rates = await readSpreadsheetValue(spreadsheetId, readRangeForRates);
  const shippingFees = await readSpreadsheetValue(spreadsheetId, readRangeForShippingFees);

  for (const item of notUploadedArr) {
    const num = parseInt(item[0]);
    const asin = item[3];
    const price = isNaN(parseFloat(item[4])) ? "" : parseFloat(item[4]);
    const method = item[7];
    const weight = parseInt(item[8]);
    const isNoUpload = item[15];
    const isUploaded = item[17]; // ここを国ごとに編集

    const isEffectiveMethod = method == "smallPacket" || method == "EMS";
    let sku;
    let listingPrice;

    if (price != "-" && price != "" && isEffectiveMethod == true && isNoUpload == "FALSE" && isUploaded == "FALSE") {
      listingPrice = await getSellingPrice(weight, method, price, rates, shippingFees);
      sku = `AU-${today}-${asin}-${price}-jpy-${listingPrice}`;
      // console.log("listing price is", listingPrice);
      // console.log("sku is", sku);
      const curArr = [sku, listingPrice, 50, asin, "ASIN", "New", , , , , , , , 4];
      // console.log(curArr);
      resultArr.push(curArr);
    }

    const updateRange = `${dbSheet}!R${num + 1}:R${num + 1}`;
    updateRanges.push(updateRange);
    updateData.push([["TRUE"]]);
    // console.log("range", updateRanges);
    // console.log("data", updateData);

    // process.exit();
  }

  // console.log(newListingSheet);
  // console.log(resultArr);
  try {
  } catch (error) {
    console.log("error occurred at batchUpdateArrayDataToSheets");
    throw error;
  }
  try {
    await appendArrayDataToSheets(spreadsheetId, `${newListingSheet}!A2:V`, resultArr);
    await batchUpdateArrayDataToSheets(spreadsheetId, updateRanges, updateData);
  } catch (error) {
    console.log("error occurred at appendArrayDataToSheets");
    throw error;
  }
};

// writeNewListingAu(process.env.SPREADSHEET_ID3, "Config", "Au_Listing", "Prod_DB");

module.exports = {
  writeNewListingAu,
};
