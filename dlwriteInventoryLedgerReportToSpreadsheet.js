const {google} = require('googleapis');
const {getInventoryhLedgerReport} = require('./dlgetAmazonApiToModule'); // ここも変更
require('dotenv').config();
const fs = require('fs');


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
const range = 'getInventoryLedger!A2:Z'; // 更新する範囲を指定

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
        console.error('WRITE LEDGER REPORT Error fetching sheet data',err);
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
            // エラーハンドリング
            console.log(`WRITE LEDGER REPORT`,err);
        } else {
            console.log('WRITE LEDGER REPORT cells updated.', result.updatedCells);
        }
    });
}


const writeInventoryhLedgerReport = async () => {
    console.log("writeInventoryhLedgerReport starts");
    const amazonData = await getInventoryhLedgerReport();
    if (amazonData == null) {
        console.log('WRITE LEDGER REPORT No data for today');
        return; 
    }

    const tsvData = amazonData/* ここにTSV形式のデータを入れます */;
    const lines = tsvData.split('\n');
    const headers = lines[0].split('\t');

    const arrayData = lines.slice(1).map(line => {
        const values = line.split('\t');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

    //レポート系はデータを整形する必要あり。
    const cleanData = arrayData.map(item => {
        const cleanedItem = {};
        for (const key in item) {
          cleanedItem[key.replace(/"/g, '')] = item[key].replace(/"/g, '');
        }
        return cleanedItem;
      });
    
    // console.log(cleanData);

    const filteredData = cleanData.filter(item =>item.Receipts != "0")  // これがないとデータが大きくなりすぎる
    const values = filteredData.map(item => [
        item.Date,
        item.FNSKU,
        item.ASIN,
        item.MSKU,
        item.Title,
        item.Disposition,
        item['Starting Warehouse Balance'],
        item.Receipts,
        item['Ending Warehouse Balance'],
        item.Location
    ])
    // console.log(values);
    const newLastRowData = values.length > 0 ? values[values.length-1][0] : null; // 更新データのA列に入る最終行のデータ

    if(await checkIfUpdateNeeded(newLastRowData,range)){
        updateData(range,values);
    }else{
        console.log('WRITE LEDGER REPORT / data had been updated before')
    };
    console.log("writeInventoryhLedgerReport ends");

  };

// writeInventoryhLedgerReport()

  module.exports = {
    writeInventoryhLedgerReport
  };
