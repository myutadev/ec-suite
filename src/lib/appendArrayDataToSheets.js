const { google } = require("googleapis");
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

const appendArrayDataToSheets = async (spreadsheetId, range, values) => {
  // process.env.SPREADSHEET_ID,"fetchProdInfo_na!B3:AH"
  //
  const request = {
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values,
    },
  };

  try {
    await sheets.spreadsheets.values.append(request);
    console.log("appended data successfully");
  } catch (error) {
    console.error("Error writing to sheet: ", error);
    throw error;
  }
};
// writeArrayDataToSheets(process.env.SPREADSHEET_ID,'SGCurSelling!A2:F',[[1,2,3,4,5],[6,7,8,9]]);
// writeArrayDataToSheets(process.env.SPREADSHEET_ID_2, "Ad_Sp!A5:Z", testArray);
module.exports = {
  appendArrayDataToSheets,
};
