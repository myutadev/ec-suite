const {google} = require('googleapis');
const {getOrderMetricsCA,getOrderMetricsUS,getOrderMetricsMX} = require('./getAmazonApiToModule');
require('dotenv').config();

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
const getOderMetrics =  async (getOrderMetricsCountry,rangesKey) => {
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

    //カラム名を追加
    values.unshift([
        'date','unitCount','orderItemCount','orderCount','averageUnitPrice','totaleSales','currency'
    ])

    const range = ranges[rangesKey]; // 更新する範囲を指定 要変更

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

  };

  getOderMetrics(getOrderMetricsCA,"CA")
  getOderMetrics(getOrderMetricsUS,"US")
  getOderMetrics(getOrderMetricsMX,"MX")

// console.log('Data write finished.'); // データ書き込み終了のログ

