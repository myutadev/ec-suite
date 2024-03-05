const { google } = require("googleapis");
const { getCatalogItemFromSheet } = require("./fetchGetCatalogItem");
const { readSpreadsheetValue } = require("../../../lib/readSpreadsheetValue.js");

require("dotenv").config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const writeGetCatalogItemToSheet = async (spreadsheetId, sheetName) => {
  // マーケットプレイスの読み込み
  const readRangeForMarketplace = `${sheetName}!A1:A1`;

  const marketPlaceArray2d = await readSpreadsheetValue(spreadsheetId, readRangeForMarketplace);
  const marketPlace = marketPlaceArray2d[0][0];

  const readRange = `${sheetName}!A3:A`; // データ取得の範囲を設定

  //書き込み先
  const range = `${sheetName}!B3:AH`;

  let values = [];
  values = await getCatalogItemFromSheet(spreadsheetId, readRange, marketPlace);
  console.log("Fetched values: ", values);

  const request = {
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    resource: {
      values,
    },
  };

  try {
    await sheets.spreadsheets.values.update(request);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
    throw error;
  }
};

module.exports = {
  writeGetCatalogItemToSheet,
};

// writeValue();
// writeGetCatalogItemToSheet(process.env.SPREADSHEET_ID,"NAfetchProdInfo")
