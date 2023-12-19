const {google} = require('googleapis');
const {getInventorySummaries} = require('./getAmazonApiToModule');
const fs = require('fs');
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

const sheets = google.sheets({
    version:'v4',
    auth
});

const spreadsheetId = process.env.SPREADSHEET_ID;

//入力したキーワードを取得する
const readInputSkus = async() => {
    const request ={
        spreadsheetId,
        range:'getInventorySummary!A2:A',
    }; 

    try {
        const inputValues = await sheets.spreadsheets.values.get(request);
        const inputValues2D = inputValues.data.values
        const inputValues1D = inputValues2D.map( item => item[0])
        return inputValues1D
    }catch(err){
        console.error(err);
    }
}

const readInputMarketId = async() => {
    const request ={
        spreadsheetId,
        range:'getInventorySummary!B1:B1',
    }; 

    try {
        const inputValues = await sheets.spreadsheets.values.get(request);
        const inputValues2D = inputValues.data.values
        const inputValues1D = inputValues2D.map( item => item[0])
        return inputValues1D
    }catch(err){
        console.error(err);
    }
}



// 12/19 writeSkuToFnskuとして切り出し あとで消す
const writeFetchedValues = async () =>{ // 配列を渡して複数対応する。

    const skus = await readInputSkus()
    const marketPlaceId = await readInputMarketId()
    const apiResponse = await getInventorySummaries(marketPlaceId[0],skus);

    const values = [];

    apiResponse.inventorySummaries.forEach(ele => {
        values.push([ele.fnSku])
    })


    console.log(values);

    const range = 'getInventorySummary!B2:B'

    const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'OVERWRITE',
        resource:{                              
            values
        }
    };

    try{
        const response = await sheets.spreadsheets.values.append(request)
    }catch(error){
        console.error("Error writing to sheet: ", error);
    }
}


module.exports ={
    writeFetchedValues
  }

// writeFetchedValues()
