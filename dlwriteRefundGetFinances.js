const {google} = require('googleapis');
const {getFinances} = require('./getAmazonApiToModule'); // ここも変更
require('dotenv').config();

// Google OAuth2 clientをセットアップ
const auth = new google.auth.GoogleAuth({
    credentials:{
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        universe_domain:process.env.UNIVERSE_DOMAIN
    }, 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets APIのインスタンスを生成
const sheets = google.sheets({version: 'v4', auth});

// 更新するスプレッドシートと範囲を指定
const spreadsheetId = process.env.SPREADSHEET_ID; 
const range = 'refunds!A3:L'; // 更新する範囲を指定

// 最終行のデータを取得して比較する関数
const checkIfUpdateNeeded = async(newLastRowData,range) =>{
    let lastUpdatedData = ''
    try{
        sheetData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });

        let sheetDataArr = sheetData.data.values;
        lastUpdatedData = sheetDataArr[sheetDataArr.length-1][0];

        return newLastRowData !== lastUpdatedData;
    }catch(err){
        console.error('Error fetching sheet data',err);
        return false;
    };
}


const updateData = (range,values) =>{
    sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        resource: {
            values,
        },
    }, (err, result) => {
        if (err) {
            // エラーハンドリング
            console.log(`REFUND`,err);
        } else {
            console.log('REFUND / cells updated.', result.updatedCells);
        }
    });
}


const writeRefundsGetFinances = async () => {
    console.log("writeRefundsGetFinancesStarted")
    const amazonData = await getFinances();
    
    const values = amazonData.FinancialEvents.RefundEventList.map(item => [
        item.AmazonOrderId,
        item.MarketplaceName,
        item.PostedDate,
        item.ShipmentItemAdjustmentList[0].SellerSKU,
        item.ShipmentItemAdjustmentList[0].QuantityShipped,
        item.ShipmentItemAdjustmentList[0].ItemChargeAdjustmentList[0].ChargeAmount.CurrencyCode,
        item.ShipmentItemAdjustmentList[0].ItemChargeAdjustmentList[0].ChargeAmount.CurrencyAmount,
        item.ShipmentItemAdjustmentList[0].ItemChargeAdjustmentList[1].ChargeAmount.CurrencyAmount,
        item.ShipmentItemAdjustmentList[0]?.ItemChargeAdjustmentList[2]?.ChargeAmount?.CurrencyAmount ?? '',
        item.ShipmentItemAdjustmentList[0]?.ItemChargeAdjustmentList[3]?.ChargeAmount?.CurrencyAmount ?? '',    
        item.ShipmentItemAdjustmentList[0].ItemFeeAdjustmentList[0].FeeAmount.CurrencyAmount,
        item.ShipmentItemAdjustmentList[0].ItemFeeAdjustmentList[1].FeeAmount.CurrencyAmount,
        // item.ShipmentItemAdjustmentList[0]?.ItemTaxWithheldList[0]?.TaxesWithheld?.CurrencyAmount ?? '',
        // item?.ShipmentItemAdjustmentList[0]?.PromotionAdjustmentList[0]?.PromotionAmount?.CurrencyAmount    ?? ''
        // item.ShipmentItemList[0].ItemFeeList[2].FeeAmount.CurrencyAmount,
        // item.ShipmentItemList[0].ItemFeeList[3].FeeAmount.CurrencyAmount,
        // item.ShipmentItemList[0].ItemFeeList[4].FeeAmount.CurrencyAmount, // ここまで入れるとメキシコのデータでエラーになる
        // item.ShipmentItemList[0].ItemFeeList[5].FeeAmount.CurrencyAmount,
    ])

    const newLastRowData = values.length > 0 ? values[values.length-1][0] : null;// 更新データのA列に入る最終行のデータ

    if(await checkIfUpdateNeeded(newLastRowData,range)){
        updateData(range,values);
    }else{
        console.log('REFUND / data had been updated before')
    };

  };

//   writeRefundsGetFinances();

  module.exports = {
    writeRefundsGetFinances
  };
