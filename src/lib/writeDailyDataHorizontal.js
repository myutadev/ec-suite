const { google } = require("googleapis");
const { getColumnNameBySheet } = require("./getLatestColumnName");
const { getToday } = require("./getToday");
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

const writeDailyDataHorizontal = async (sheetId, sheetName, values) => {
  //書き込み先のシートID
  const spreadsheetId = sheetId; // ここは変数で

  //ランク書き込み用の処理
  const updateColLetter = await getColumnNameBySheet(sheetId, sheetName);

  const range = `${sheetName}!${updateColLetter}1:${updateColLetter}`; // ここは変数のシート名から取得

  //最後に最初の1行目に当日日付をyyyy/mm/ddで入力
  const todaysDate = getToday();
  values.unshift([todaysDate]);

  const request = {
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values,
    },
  };

  // 書き込み処理

  try {
    sheets.spreadsheets.values.update(request);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
  }
};

module.exports = {
  writeDailyDataHorizontal,
};
