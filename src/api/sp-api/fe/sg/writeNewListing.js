require("dotenv").config();
const { getToday, getTodayShort } = require("../../../../lib/getToday.js");
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");
const { batchUpdateArrayDataToSheets } = require("../../../../lib/batchUpdateArrayDataToSheets.js");

const { appendArrayDataToSheets } = require("../../../../lib/appendArrayDataToSheets.js");
const { getSellingPrice } = require("./getSellingPrice.js");

const writeNewListing = async (
  spreadsheetId,
  configSheet,
  newListingSheet,
  dbSheet
  // readStart,
  // readEnd
) => {
  // Prod_DBからデータ取得 A:Q
  const dbDataArr = await readSpreadsheetValue(spreadsheetId, `${dbSheet}!A2:Q`);

  // console.log("dbDataArr is", dbDataArr);

  const notUploadedArr = [];
  dbDataArr.forEach((item) => {
    //Q列のSGUploadがFALSEのものを抽出
    if (item[16] == "FALSE") {
      notUploadedArr.push(item);
    }
  });
  // console.log("not uploaded arr", notUploadedArr);

  const resultArr = [];
  const today = await getTodayShort();

  const updateRanges = [];
  const updateData = [];

  const readRangeForRates = `${configSheet}!A3:D3`;
  const readRangeForShippingFees = `${configSheet}!A6:D`;

  const rates = await readSpreadsheetValue(spreadsheetId, readRangeForRates);
  const shippingFees = await readSpreadsheetValue(spreadsheetId, readRangeForShippingFees);

  for (const item of notUploadedArr) {
    const num = parseInt(item[0]);
    const asin = item[3];
    const price = isNaN(parseFloat(item[4])) ? "" : parseFloat(item[4]);
    const method = item[7];
    const weight = parseInt(item[8]);
    const isNoUpload = item[15];
    const isUploaded = item[16];

    const isEffectiveMethod = method == "smallPacket" || method == "EMS";
    let sku;
    let listingPrice;

    if (price != "-" && price != "" && isEffectiveMethod == true && isNoUpload == "FALSE" && isUploaded == "FALSE") {
      listingPrice = await getSellingPrice(weight, method, price, rates, shippingFees);
      sku = `SG-${today}-${asin}-${price}-jpy-${listingPrice}`;
      // console.log(listingPrice);
      // console.log(sku);
      const curArr = [sku, listingPrice, 50, asin, "ASIN", "New", , , , , , , , 7];
      // console.log(curArr);
      resultArr.push(curArr);
    }

    const updateRange = `${dbSheet}!Q${num + 1}:Q${num + 1}`;
    updateRanges.push(updateRange);
    updateData.push([["TRUE"]]);
    // console.log("range", updateRanges);
    // console.log("data", updateData);

    // process.exit();
  }

  // console.log(newListingSheet);
  // console.log(resultArr);
  console.log("updateRanges", updateRanges);
  try {
    console.log("check if the data writed in Sg_Listing");
    await appendArrayDataToSheets(spreadsheetId, `${newListingSheet}!A2:V`, resultArr);
    await batchUpdateArrayDataToSheets(spreadsheetId, updateRanges, updateData);
  } catch (error) {
    throw error;
  }
};

// writeNewListing(process.env.SPREADSHEET_ID3, "Config", "Sg_Listing", "Prod_DB");

module.exports = {
  writeNewListing,
};
