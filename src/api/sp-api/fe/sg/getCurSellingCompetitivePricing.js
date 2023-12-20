const {getCompetitivePricing} = require('../jp/getCompetitivePricing.js');
const {readSpreadsheetValue} = require('../../../../lib/readSpreadsheetValue.js');
const {sleep} = require('../../../../lib/sleep.js');
require("dotenv").config();

const getCurSellingCompetitivePricing = async () => {
  const apiDataArray = [];
  const spreadsheetId = process.env.SPREADSHEET_ID2;
  const range = "SGCurSelling!A2:A";

  const sheetValues = await readSpreadsheetValue(spreadsheetId, range);
  const asins = sheetValues.flat();

  // 1度のリクエストで最大20ASINまで渡せるので20で区切った配列を作成
  const chunkedAsins = [];
  for (i = 0; i < asins.length; i += 20) {
    chunkedAsins.push(asins.slice(i, i + 20));
  }

  console.log(chunkedAsins);

  for (const asin of chunkedAsins) {
    let fetchedData = await getCompetitivePricing(asin);
    apiDataArray.push(fetchedData);
    await sleep(30000);
  }
  //ここでチャンクごとに入れ子になっている構造をなくす
  const flattenedApiDataArray = apiDataArray.flat();
  console.log(flattenedApiDataArray);

  return flattenedApiDataArray;
};

// getCurSellingCompetitivePricing();

module.exports ={
  getCurSellingCompetitivePricing
}
