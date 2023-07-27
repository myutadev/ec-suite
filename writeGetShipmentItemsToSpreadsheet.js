const {google} = require('googleapis');
const {getShipmentItems} = require('./getAmazonApiToModule'); // ここも変更
require('dotenv').config();

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
    }, 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets APIのインスタンスを生成
const sheets = google.sheets({version: 'v4', auth});

// 更新するスプレッドシートと範囲を指定
const spreadsheetId = process.env.SPREADSHEET_ID; 
const range = 'getShipmentItems!A2:L'; // 更新する範囲を指定


// 発送情報を取得
(async () => {
    const amazonData = await getShipmentItems;
    // console.log(amazonData);
    
    const values = amazonData.ItemData.map(item => [
        item.ShipmentId,
        item.SellerSKU,
        item.FulfillmentNetworkSKU,
        item.QuantityShipped,
        item.QuantityReceived,
        item.QuantityInCase,
        item.ReleaseDate
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

