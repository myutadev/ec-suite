const { google } = require("googleapis");
require("dotenv").config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
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

const getColumnNameBySheet = async (sheetId,sheetName) => {
  let num = await getLatestColumn(sheetId,sheetName);
  let columnName = "";

  while (num > 0) {
    const modulo = (num - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    num = Math.floor((num - modulo) / 26);
  }
  return columnName;
};

const getLatestColumn = async (sheetId,sheetName) => {
  
  const range = `${sheetName}!A:ZZZ`// "RankTracker!A:ZZZ"


  const request = {
    spreadsheetId: sheetId,
    range: range , // "RankTracker!A:ZZZ"
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    console.log(response.data.values[0].length);
    return response.data.values[0].length + 1; // 最後の使用列の番号+1を返す
  } catch (error) {
    console.error("Error reading from sheet: ", error);
    return null;
  }
};

module.exports = {
  getColumnNameBySheet,
};
