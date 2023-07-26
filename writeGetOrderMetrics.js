const {google} = require('googleapis');
const {getOrderMetrics} = require('./getAmazonApiToModule');
require('dotenv').config();

 // ここも変更



// Google OAuth2 clientをセットアップ
const auth = new google.auth.GoogleAuth({
    credentials:{
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
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
const range = 'getOrderMetrics!A2:L'; // 更新する範囲を指定

// 売上情報を取得`
(async () => {
    const amazonData = await getOrderMetrics;
    // console.log(amazonData);
    
    const values = amazonData.map(item => [
        item.interval,
        item.unitCount,
        item.orderItemCount,
        item.orderCount,
        item.averageUnitPrice.amount,
        item.averageUnitPrice.currencyCode,
        item.totalSales.amount,
        item.totalSales.currencyCode
    ])

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
            console.log(err);
        } else {
            console.log('%d cells updated.', result.updatedCells);
        }
    });

  })();

