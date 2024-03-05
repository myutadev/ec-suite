const { google } = require("googleapis");
require("dotenv").config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is not set.");
}
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/gm, "\n");

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

const readSpreadsheetValue = async (spreadsheetId, range) => {
  // ex  process.env.SPREADSHEET_ID."fetchProdInfo_na!A1:A1"
  const request = {
    spreadsheetId,
    range,
  };
  try {
    const response = await sheets.spreadsheets.values.get(request);
    const sheetValues = response.data.values;
    return sheetValues;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  readSpreadsheetValue,
};
