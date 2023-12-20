const {getCurSellingFbaInventoryObj} = require('./getCurSellingFbaInventoryObj.js');
const {
  readSpreadsheetValue,
} = require("../../../lib/readSpreadsheetValue.js");
const {
  updateArrayDataToSheets,
} = require("../../../lib/updateArrayDataToSheets.js");


require('dotenv').config();

const writeSkuToFnsku = async (spreadsheetId,sheetName) =>{ // 配列を渡して複数対応する。
    const marketPlaceSheetData = await readSpreadsheetValue(spreadsheetId,`${sheetName}!A1:A1`);
    const marketPlace = marketPlaceSheetData.flat()[0];

    const skusSheetData = await readSpreadsheetValue(spreadsheetId,`${sheetName}!A3:A`);
    const skus = skusSheetData.flat();

    // const apiResponse = await getFbaInventorySummaries(marketPlace);

    // const skuInfoObj = apiResponse['inventorySummaries'].reduce((acc,item)=>{
    //   acc[item.sellerSku] = item;
    //   return acc
    // },{});


    const skuInfoObj =  await getCurSellingFbaInventoryObj(marketPlace);

    const values = [];

    skus.forEach(sku => {
        values.push([skuInfoObj[sku][`sellerSku`],skuInfoObj[sku][`fnSku`]])
    })


    //書き込み用レンジ
    const range = 'skuToFnsku!B3:C'

    try{
    updateArrayDataToSheets(spreadsheetId,range,values);
      }catch(error){
        console.error("Error writing to sheet: ", error);
    }
}


module.exports ={
    writeSkuToFnsku
  }

// writeSkuToFnsku(process.env.SPREADSHEET_ID,"skuToFnsku")
