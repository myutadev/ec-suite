const {google} = require('googleapis');
const {getBusinessReport} = require('./getAmazonApiToModule');
const {getAsinTitleObj} = require('./src/api/sp-api/na/getAsinTitleObj');

require('dotenv').config();

const auth = new google.auth.GoogleAuth({
    credentials:{
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
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

// // 更新するスプレッドシートと範囲を指定
// const spreadsheetId = process.env.SPREADSHEET_ID; 
// const range = 'businessReport!A2:Z'; // 更新する範囲を指定




// const updateData = (range,values) =>{
//     sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range,
//         valueInputOption: 'USER_ENTERED',
//         insertDataOption: 'INSERT_ROWS',
//         resource: {
//             values,
//         },
//     }, (err, result) => {
//         if (err) {
//             // エラーハンドリング
//             console.log(`writeBusinessReport  / `,err);
//         } else {
//             console.log('writeBusinessReport  / cells updated.', result.updatedCells);
//         }
//     });
// }
const getSheetData = async () => {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = "businessReport!B1:D1";

  const request = {
    spreadsheetId,
    range,
  };
  try {
    console.log("try started");
    const response = await sheets.spreadsheets.values.get(request);
    const sheetValues = response.data.values;
    // console.log(sheetValues)
    return sheetValues[0];
  } catch (err) {
    console.error(err);
    throw err
  }
};



const updateData = (values) =>{
    console.log('start updateData')

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'businessReport!A2:Z'; // 更新する範囲を指定

    sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values,
        },
    }, (err, result) => {
        if (err) {
            // エラーハンドリング
            console.log(`WRITE Business report`,err);
        } else {
            
            console.log('WRITE Business report cells updated.', result.updatedCells);
        }
    });
}


const writeBusinessReport = async () => {
    console.log("writeActiveInventoryReport starts");
    const sheetValues = await getSheetData()

    try {
            const [asinTitleObj, amazonData] = await Promise.all([
                getAsinTitleObj(),
                getBusinessReport(sheetValues)
            ]);

            if (amazonData == null) {
                console.log('writeActiveInventoryReport no data for today');
                return; 
            }
        
    
    const jsonData = JSON.parse(amazonData);
    // console.log(jsonData.salesAndTrafficByDate)

    const values = jsonData.salesAndTrafficByAsin.map(item => [
        jsonData.reportSpecification.dataStartTime,
        jsonData.reportSpecification.dataEndTime,
        item.parentAsin,
        item.childAsin,
        asinTitleObj[item.childAsin]?.name ?? "",
        asinTitleObj[item.childAsin]?.sku ?? "",
        asinTitleObj[item.childAsin]?.price ?? "",
        asinTitleObj[item.childAsin]?.quantity ?? "",
        item.trafficByAsin.sessions,
        item.trafficByAsin.sessionsB2B,
        item.trafficByAsin.sessionPercentage,
        item.trafficByAsin.sessionPercentageB2B,
        item.trafficByAsin.pageViews,
        item.trafficByAsin.pageViewsB2B,
        item.trafficByAsin.pageViewsPercentage,
        item.trafficByAsin.pageViewsPercentageB2B,
        item.trafficByAsin.buyBoxPercentage,
        item.trafficByAsin.buyBoxPercentageB2B,
        item.salesByAsin.unitsOrdered,
        item.salesByAsin.unitsOrderedB2B,
        item.trafficByAsin.unitSessionPercentage,
        item.trafficByAsin.unitSessionPercentageB2B,
        item.salesByAsin.orderedProductSales.amount,
        item.salesByAsin.orderedProductSalesB2B.amount,
        item.salesByAsin.totalOrderItems,
        item.salesByAsin.totalOrderItemsB2B,
    ])
        // console.log(values);
        updateData(values);
        console.log("writeInventoryhLedgerReport ends");
    }catch(err){
    console.error(err)
    }
  };


writeBusinessReport()
// getMarketPlaceIdFromSheet()

  module.exports = {
    writeBusinessReport
  };
