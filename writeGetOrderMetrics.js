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

// 売上情報を取得`
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

    const dataDate = values[0][0]; // 更新データのA列に入る予定の部分
    const range = ranges[rangesKey]; // 更新する範囲を指定 要変更
    let dataDateCheck = (dataDate,lastUpdatedData) => dataDate == lastUpdatedData // 最後に更新したデータと新規取得データの値を比較  true =>更新済み

    //ここからA列の最後の行のデータを取得する関数を入れたい。
    
    const checkAlreadyUpdated = async () =>{
        let lastUpdatedData = ''
        let sheetData =''
        try{
            sheetData = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range
            });

            let sheetDataArr = sheetData.data.values;
            lastUpdatedData = sheetDataArr[sheetDataArr.length-1][0];

            if(!dataDateCheck(dataDate,lastUpdatedData)) {
                // スプレッドシートを更新
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
                        console.log('Error during data write: ', err); // 書き込みエラーのログ
                    } else {
                        console.log('%d cells updated.', result.updatedCells);
                    }
                });
            }else{ console.log('data had been updated before')} // すでに更新済みの場合のメッセージ
        }catch(err){
            console.error('Error fetching sheet data',err);
        };
    };
    checkAlreadyUpdated(); 
  };

  getOrderMetrics(getOrderMetricsCA,"CA")
  getOrderMetrics(getOrderMetricsUS,"US")
  getOrderMetrics(getOrderMetricsMX,"MX")

