const {google} = require('googleapis');
const {getCatalogItemFromSheet} = require('./dlgetAmazonApiToModuleForFetch');
const fs = require('fs');
require('dotenv').config();

const readRanges ={
    CA:'CAfetchProdInfo!A2:A',
    US:'USfetchProdInfo!A2:A'
}


const ranges ={
    CA:'CAfetchProdInfo!B2:AH',
    US:'USfetchProdInfo!B2:AH'
}

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



const writeValue =async (country) =>{
    //読み込み元
    const readSpreadsheetId = process.env.SPREADSHEET_ID; 
    const readRange = readRanges[country]; // データ取得の範囲を設定
    //書き込み先
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = ranges[country];
    
    let values =[];
    values = await getCatalogItemFromSheet(readSpreadsheetId,readRange,country);
    console.log("Fetched values: ", values);
    

    const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource:{                              
            values
        }
    };

    try{
        const response = await sheets.spreadsheets.values.update(request)
    }catch(error){
        console.error("Error writing to sheet: ", error);
    }
}

// //小山さん用
// const writeValueK =async () =>{
//     //読み込み元
//     const readSpreadsheetId = process.env.SPREADSHEET_ID_K; 
//     const readRange = 'fetchProdInfo!A2:A'; // データ取得の範囲を設定
//     //書き込み先
//     const spreadsheetId = process.env.SPREADSHEET_ID_K;
//     const range = 'fetchProdInfo!B2:AH'
    
//     let values =[];
//     values = await getCatalogItemFromSheet(readSpreadsheetId,readRange);
//     console.log("Fetched values: ", values);
    

//     const request = {
//         spreadsheetId,
//         range,
//         valueInputOption: 'RAW',
//         resource:{                              
//             values
//         }
//     };

//     try{
//         const response = await sheets.spreadsheets.values.update(request)
//     }catch(error){
//         console.error("Error writing to sheet: ", error);
//     }
// }

const writeValueCa = () => writeValue('CA')
const writeValueUs = () => writeValue('US')

module.exports ={
    writeValueCa,
    writeValueUs,
}


// writeValue('CA');


