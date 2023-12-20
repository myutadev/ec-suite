const {getCatalogItem} = require('./getCatalogItem');
const {readSpreadsheetValue} = require('../../../../lib/readSpreadsheetValue')
const {updateArrayDataToSheets} = require('../../../../lib/updateArrayDataToSheets')
require('dotenv').config();


const writeCatalogItemFromSheet =async (spreadsheetId,sheetName) =>{
    //読み込み元
    const readRange = `${sheetName}!A2:A`; // データ取得の範囲を設定
    //書き込み先
    const range = `${sheetName}!B2:AH`

    const sheetValues = await readSpreadsheetValue(spreadsheetId,readRange)
    const asins = sheetValues.flat();



    const promises = asins.map((asin)=> getCatalogItem(asin));
    const values = await Promise.all(promises);
    
    console.log("Fetched values: ", values);


    try{
        updateArrayDataToSheets(spreadsheetId,range,values);
    }catch(error){
        console.error("Error writing to sheet: ", error);
    }
}

// writeCatalogItemFromSheet(process.env.SPREADSHEET_ID2,"fetchProdInfo");

module.exports ={
    writeCatalogItemFromSheet,
  }


