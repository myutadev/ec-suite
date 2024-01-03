require("dotenv").config();
const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");

const { getListingsRestrictionsAu } = require("./getListingsRestrictions.js");

const writeListingsRestrictionsAu = async (spreadsheetId, sheetName, start, end) => {
  const writeRange = `${sheetName}!X${start}:Y${end}`;
  const readRange = `${sheetName}!D${start}:D${end}`;
  const sheetData = await readSpreadsheetValue(spreadsheetId, readRange);

  const asins = sheetData.flat();

  console.log(asins);

  const results = [];

  for (let asin of asins) {
    const res = await getListingsRestrictionsAu(asin);
    console.log(res);
    results.push([
      res,
      `https://sellercentral.amazon.sg/hz/approvalrequest/restrictions/approve?asin=${asin}&itemcondition=null&ref_=xx_catadd_dnav_xx`,
    ]);
  }

  // const results = await Promise.allSettled(
  //   asins.map((asin) => getListingsRestrictions(asin).then((data)=>[data]))
  // );

  // console.log(results);

  updateArrayDataToSheets(spreadsheetId, writeRange, results);
};

// writeListingsRestrictionsAu(process.env.SPREADSHEET_ID3, "Au_Listing", 11, 100);
module.exports = {
  writeListingsRestrictionsAu,
};
