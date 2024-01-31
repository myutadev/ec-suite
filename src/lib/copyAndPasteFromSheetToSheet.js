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

const copyAndPasteFromSheetToSheet = async (copySheetId, copyRange, pasteSheetId, pasteRange) => {
  let values;
  try {
    console.log(copySheetId);
    console.log(copyRange);

    const readRequest = {
      spreadsheetId: copySheetId,
      range: copyRange,
    };

    const response = await sheets.spreadsheets.values.get(readRequest);
    values = response.data.values;
    console.log(values);
  } catch (err) {
    console.error(err);
  }

  const request = {
    spreadsheetId: pasteSheetId,
    range: pasteRange,
    valueInputOption: "USER_ENTERED",
    resource: {
      values,
    },
  };

  try {
    await sheets.spreadsheets.values.update(request);
  } catch (error) {
    console.error("Error writing to sheet: ", error);
  }
};
module.exports = {
  copyAndPasteFromSheetToSheet,
};

// copyAndPasteFromSheetToSheet(
//   process.env.SPREADSHEET_ID3,
//   "test_Prod_DB!A2:D",
//   process.env.SPREADSHEET_ID3,
//   "test_Fetch_manual!A2:D"
// );
