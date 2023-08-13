const {google} = require('googleapis');
const {getOrderMetricsCA,getOrderMetricsUS,getOrderMetricsMX,getFinances} = require('./getAmazonApiToModule');
require('dotenv').config();

const cron = require('node-cron');


cron.schedule('0 9 * * *',()=>{ 
    getOrderMetrics(getOrderMetricsCA,"CA")
    getOrderMetrics(getOrderMetricsUS,"US")
    getOrderMetrics(getOrderMetricsMX,"MX")
})


const ranges = {
    'CA' :'getOrderMetricsCA!A2:G',
    'US' :'getOrderMetricsUS!A2:G',
    'MX' :'getOrderMetricsMX!A2:G'
}

// Google OAuth2 clientをセットアップ
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
    },  // サービスアカウントキーへのパス
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets APIのインスタンスを生成
const sheets = google.sheets({version: 'v4', auth});
// 更新するスプレッドシートと範囲を指定
const spreadsheetId = process.env.SPREADSHEET_ID; 

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
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values,
        },
    }, (err, result) => {
        if (err) {
            console.log('Error during data write: ', err); 
        } else {
            console.log('%d cells updated.', result.updatedCells);
        }
    });
} 

const getOrderMetrics =  async (getOrderMetricsCountry,rangesKey) => {
    const amazonData = await getOrderMetricsCountry;// 更新する範囲を指定 要変更
    
    const values = amazonData.map(item => [
        item.interval,
        item.unitCount,
        item.orderItemCount,
        item.orderCount,
        item.averageUnitPrice.amount,
        item.totalSales.amount,
        item.totalSales.currencyCode
    ])

    const newLastRowData = values[values.length-1][0]; // 更新データのA列に入る最終行のデータ
    const range = ranges[rangesKey]; // 更新する範囲を指定 

    if(await checkIfUpdateNeeded(newLastRowData,range)){
        updateData(range,values);
    }else{
        console.log('data had been updated before')
    };
}

  getOrderMetrics(getOrderMetricsCA,"CA")
  getOrderMetrics(getOrderMetricsUS,"US")
  getOrderMetrics(getOrderMetricsMX,"MX")

