require("dotenv").config();
const {
  readSpreadsheetValue,
} = require("../../../../lib/readSpreadsheetValue.js");
const {
  updateArrayDataToSheets,
} = require("../../../../lib/updateArrayDataToSheets.js");

const writeShippingInfo = async (spreadsheetId, sheetName) => {
  const writeRange = `${sheetName}!H2:K`;
  const readRange = `${sheetName}!L2:O`;
  const sheetData = await readSpreadsheetValue(
    process.env.SPREADSHEET_ID3,
    readRange
  );
  const results = [];

  sheetData.forEach((items) => {
    const length = parseFloat(items[1]);
    const width = parseFloat(items[2]);
    const height = parseFloat(items[3]);
    const weight = parseFloat(items[0]);

    //空欄があった場合の対策
    if (
      length === 0 ||
      isNaN(length) ||
      width === 0 ||
      isNaN(width) ||
      height === 0 ||
      isNaN(height) ||
      weight === 0 ||
      isNaN(weight)
    ) {
      results.push(["blank error"]);
      return;
    }

    const longest = Math.max(length, width, height);
    const sWeight = Math.floor(((length * width * height) / 6000) * 100) / 100;
    const total = length + width + height;
    const packagedWeight = weight + 200;

    //SIZEオーバーチェック
    if (longest >= 147 || total >= 290 || packagedWeight >= 27000) {
      results.push(["size over"]);
      return;
    }

    const shippingMethod =
      longest < 57 && packagedWeight < 2000 && total < 150
        ? "smallPacket"
        : "EMS";

    const curInfoArr = [shippingMethod, packagedWeight, sWeight, longest];
    results.push(curInfoArr);
  });

  updateArrayDataToSheets(spreadsheetId, writeRange, results);

  // console.log(results);
};

writeShippingInfo(process.env.SPREADSHEET_ID3, "Prod_DB");
module.exports = {
  writeShippingInfo,
};
// const testArr = [
//   ["1800", "39.7", "8.41", "2.79"], // EMS
//   ["2000", "39.2", "8.4", "2.8"], // EMS
//   ["158", "40", "76", "2"], // EMS
//   ["242", "57.1", "5", "4"], // EMS
//   ["138", "56.9", "4.8", "1.3"], //小形
//   ["1801", "30.9", "10", "5"], //EMS
//   ["132", "55", "55", "55"], //EMS
//   ["278", "29.4", "60", "4"], //EMS
//   ["155", "40.01", "23.5", "60"], //EMS
//   ["258.55", "", "9.4", "4.06"], //blank error
//   ["", "7.3", "29.8", "3.4"], //blank error
//   ["208.7", "38", "0", "3"], //blank error
//   ["220", "3", "7.5", ""], //blank error
//   ["0", "2", "7", "30"], //blank error
//   ["28000", "39.2", "9", "3"], // size over
//   ["158.8", "165", "7.2", "3"], // size over
//   ["260", "100", "100", "100"], // sizE over
//   ["26700", "44.7", "7.3", "2.5"], // EMS
//   ["308.4", "39.5", "10.5", "3"],
//   ["1080", "24.1", "15.4", "11.1"],
// ];
