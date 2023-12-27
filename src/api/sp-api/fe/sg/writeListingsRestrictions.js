require("dotenv").config();
const {
  readSpreadsheetValue,
} = require("../../../../lib/readSpreadsheetValue.js");
const {
  updateArrayDataToSheets,
} = require("../../../../lib/updateArrayDataToSheets.js");

const { getListingsRestrictions } = require("./getListingsRestrictions.js");

const writeListingsRestrictions = async (
  spreadsheetId,
  sheetName,
  start,
  end
) => {
  const writeRange = `${sheetName}!X${start}:X${end}`;
  const readRange = `${sheetName}!D${start}:D${end}`;
  const sheetData = await readSpreadsheetValue(spreadsheetId, readRange);

  const asins = sheetData.flat();

  console.log(asins);

  const results = [];

  for (let asin of asins) {
    const res = await getListingsRestrictions(asin);
    console.log(res);
    results.push([res]);
  }

  // const results = await Promise.allSettled(
  //   asins.map((asin) => getListingsRestrictions(asin).then((data)=>[data]))
  // );

  console.log(results);

  updateArrayDataToSheets(spreadsheetId, writeRange, results);
};

// writeListingsRestrictions(process.env.SPREADSHEET_ID3, "Sg_Listing", 433, "");
module.exports = {
  writeListingsRestrictions,
};
