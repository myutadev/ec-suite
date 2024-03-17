const { readSpreadsheetValue } = require("../../../../lib/readSpreadsheetValue.js");
const { getAsinsFromTitle } = require("./getAsinsFromTitle.js");
const { updateArrayDataToSheets } = require("../../../../lib/updateArrayDataToSheets.js");
const { getTranslatedText } = require("../../../deepL/getTranslatedText.js");

require("dotenv").config();

const writeAsinsFromTitleTranslate = async (spreadsheetId, sheetName, batchSize) => {
  const readSpreadSheetData = await readSpreadsheetValue(spreadsheetId, `${sheetName}!B1:B`);
  const readRow = readSpreadSheetData.length + 1;
  const readRange = `${sheetName}!A${readRow}:A`;
  const sheetValues2d = await readSpreadsheetValue(spreadsheetId, readRange);
  const sheetValues = sheetValues2d.flat();
  let updateStartRow = readRow;

  //batch処理開始

  for (let i = 0; i < sheetValues.length; i += batchSize) {
    //batchの行ずつ翻訳

    const translatedArr = [];
    let updateEndRow = updateStartRow + batchSize - 1;
    let updateRange = `${sheetName}!B${updateStartRow}:G${updateEndRow}`;
    const batch = sheetValues.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((title) => getTranslatedText(title)));
    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        translatedArr.push([result.value[0].text]);
      } else {
        translatedArr.push([], [result.reason.message]);
      }
    });

    //翻訳後の配列を受取、AmazonAPIへリクエスト
    const asinsArr = [];

    const batchSpApiResult = await Promise.allSettled(translatedArr.map((keyword) => getAsinsFromTitle(keyword)));
    batchSpApiResult.forEach((result) => {
      if (result.status === "fulfilled") {
        asinsArr.push(result.value);
      } else {
        asinsArr.push([]);
        console.log("status rejected");
      }
    });

    // ex tr=[[word],[wordq],[dsf]] , asins[[dsa,dsa,fas,fas,fa],[sda,fsd,fsa,fsa,afa]]

    const resultArr = [];
    console.log("translated arr length", translatedArr.length);

    for (let i = 0; i < translatedArr.length; i++) {
      const combinedArr = [];
      combinedArr.push(translatedArr[i][0]);

      // combinedArr.push(asinsArr[i]);
      //combinedArr should be like [[estima],[asin1,asin2,3,4,5]]
      asinsArr[i].forEach((asin) => combinedArr.push(asin));
      console.log("combinedArr", combinedArr);
      resultArr.push(combinedArr);
    }

    try {
      await updateArrayDataToSheets(spreadsheetId, updateRange, resultArr);
    } catch (error) {
      console.error("Error writing to sheet: ", error);
      throw error;
    }
    updateStartRow += batchSize;
    console.log(`batch ${i} end`);
  }
};

// writeAsinsFromTitleTranslate(process.env.SPREADSHEET_ID2, "asinsByName", 10);


module.exports = {
  writeAsinsFromTitleTranslate,
};

