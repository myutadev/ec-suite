const express = require("express");
const { writeBusinessReport } = require("./src/api/sp-api/na/writeBusinessReport");
const { writeGetCatalogItemToSheet } = require("./src/api/sp-api/na/writeGetCatalogItemToSheet");
const { writeSkuToFnsku } = require("./src/api/sp-api/na/writeskuToFnsku");
const { writeCatalogItemFromSheet } = require("./src/api/sp-api/fe/jp/writeCatalogItemFromSheet");
const {
  writeCurSellingCompetitivePrice,
} = require("./src/api/sp-api/fe/sg/archive/writeCurSellingCompetitivePrice.js");
const { writeActiveInventoryReport } = require("./src/api/sp-api/fe/sg/writeActiveInventoryReport");
const { writeProdCurPriceBySheet } = require("./src/api/sp-api/fe/sg/writeProdCurPriceBySheet.js");
const { writeShippingInfo } = require("./src/api/sp-api/fe/sg/writeShippingInfo.js");
const { writeInventoryUpdateInfo } = require("./src/api/sp-api/fe/sg/writeInventoryUpdateInfo.js");
const { writeNewListing } = require("./src/api/sp-api/fe/sg/writeNewListing.js");
const { writeListingsRestrictions } = require("./src/api/sp-api/fe/sg/writeListingsRestrictions.js");
const { writeInventoryUpdateInfoSpMy } = require("./src/api/shopee/my/writeInventoryUpdateInfo.js");
const { writeInventoryUpdateInfoSpSg } = require("./src/api/shopee/sg/writeInventoryUpdateInfo.js");
const { readSpreadsheetValue } = require("./src/lib/readSpreadsheetValue.js");
const { writeSearchCatalogItems } = require("./src/api/sp-api/fe/jp/writeSearchCatalogItems.js");
const { writeSearchCatalogItemsAll } = require("./src/api/sp-api/fe/jp/writeSearchCatalogItemsAll.js");
const { writeRivalSellerAsins } = require("./src/api/keepa/writeRivalSellerAsins.js");
const { writeNewListingAu } = require("./src/api/sp-api/fe/aus/writeNewListing.js");
const { writeListingsRestrictionsAu } = require("./src/api/sp-api/fe/aus/writeListingsRestrictions.js");
// const { loginAndSaveCookies } = require("./src/automation/aus/loginAndSaveCookies.js");
// const { submitApprovalRequest } = require("./src/automation/aus/requestApproval.js");
const { writeActiveInventoryReportAu } = require("./src/api/sp-api/fe/aus/writeActiveInventoryReport.js");
const { writeInventoryUpdateInfoAu } = require("./src/api/sp-api/fe/aus/writeInventoryUpdateInfo.js");
const { writeCheckDengerousProduct } = require("./src/api/sp-api/fe/aus/writeCheckDengerousProduct.js");
const { writeCheckNgWordsProduct } = require("./src/api/sp-api/fe/aus/writeCheckNgWordsProduct.js");
const { writeTranslatedText } = require("./src/api/deepL/writeTranslatedText.js");
const { writeAsinsFromTitle } = require("./src/api/sp-api/fe/jp/writeAsinsFromTitle.js");
const { writeAsinsFromTitleTranslate } = require("./src/api/sp-api/fe/jp/writeAsinsFromTitleTranslate.js");
const { getMatch } = require("./src/lib/getMatch.js");
const { writeCatalogItemFromSheetShopee } = require("./src/api/sp-api/fe/jp/writeCatalogItemFromSheetShopee.js");
const { writeInventoryLedgerReport } = require("./src/api/sp-api/na/writeInventoryLedgerReport");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2>ec-suite v1.1</h2>");
});

// 12/19 changed
app.get("/write/bizreport", async (req, res, next) => {
  try {
    await writeBusinessReport();
    console.log(`writeBusinessReport started`);
    res.send("writeBusinessReport completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeBusinessReport.");
  }
});

// 12/19 changed
app.get("/write/catalog", async (req, res, next) => {
  try {
    await writeGetCatalogItemToSheet(process.env.SPREADSHEET_ID, "NAfetchProdInfo");
    console.log(`writeGetCatalogItemToSheet started`);
    res.send("writeGetCatalogItemToSheet completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeGetCatalogItemToSheet.");
  }
});

//12/19 changed
app.get("/write/fnsku", async (req, res, next) => {
  try {
    await writeSkuToFnsku(process.env.SPREADSHEET_ID, "skuToFnsku");
    console.log(`writeSkuToFnsku`);
    res.send("writeSkuToFnsku completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred.");
  }
});

//Amazon JP need to check

app.get("/main", async (req, res, next) => {
  try {
    await writeCatalogItemFromSheet(process.env.SPREADSHEET_ID2, "fetchProdInfo", 20);
    console.log(`writeCatalogItemFromSheet started`);
    res.send("writeCatalogItemFromSheet completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeCatalogItemFromSheet.");
  }
});

// 12/24 新しいツール作成したため不要

// app.get("/writesg", async (req, res) => {
//   try {
//     await writeCurSellingCompetitivePrice();
//     console.log(`writesg started`);
//     res.send("writesg completed.");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("An error occurred in writesg.");
//   }
// });

//12/24 新しいシートに変更

app.get("/write/activesg", async (req, res, next) => {
  try {
    writeActiveInventoryReport(process.env.SPREADSHEET_ID3, "Sg_Selling!A3:F");
    console.log(`writeactivesg started`);
    res.send("writeactivesg completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeactivesg.");
  }
});
app.get("/write/activeau", async (req, res, next) => {
  try {
    writeActiveInventoryReportAu(process.env.SPREADSHEET_ID3, "Au_Selling!A3:F");
    console.log(`activeau started`);
    res.send("activeau completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in activeau.");
  }
});

//Amazon JP end

app.get("/write/prodprice/", async (req, res, next) => {
  try {
    await writeProdCurPriceBySheet(
      process.env.SPREADSHEET_ID3,
      "Prod_DB",
      "D", // asinのある列
      "C",
      "B",
      "E",
      600 // 100個で実行 1h 1600 /  500個実行してみる→12.5h  1h1800のペース 1秒0.5リクエスト 目安  10万で2.5  /
      // 12/24 11:51 twtime 500-> 800
    );
    console.log(`writeProdCurPriceBySheet started`);
    res.send("writeProdCurPriceBySheet completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeactivesg.");
  }
});

app.get("/write/prodprice/manual", async (req, res, next) => {
  try {
    await writeProdCurPriceBySheet(
      process.env.SPREADSHEET_ID3,
      "Fetch_manual",
      "D", // asinのある列
      "C",
      "B",
      "E",
      600
    );
    console.log(`writeProdCurPriceBySheet started`);
    res.send("writeProdCurPriceBySheet completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeactivesg.");
  }
});

app.get("/write/shippingInfo", async (req, res, next) => {
  try {
    writeShippingInfo(process.env.SPREADSHEET_ID3, "Prod_DB");
    console.log(`writeShippingInfo started`);
    res.send("writeShippingInfo completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeShippingInfo.");
  }
});

app.get("/write/inventoryupdateinfo", async (req, res, next) => {
  try {
    writeInventoryUpdateInfo(process.env.SPREADSHEET_ID3, "Config", "Sg_Selling", "Prod_DB");
    console.log(`writeInventoryUpdateInfo started`);
    res.send("writeInventoryUpdateInfo completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeInventoryUpdateInfo.");
  }
});

app.get("/write/inventoryupdateinfoau", async (req, res, next) => {
  try {
    writeInventoryUpdateInfoAu(process.env.SPREADSHEET_ID3, "Config", "Au_Selling", "Prod_DB");
    console.log(`inventoryupdateinfoau started`);
    res.send("inventoryupdateinfoau completed.");
  } catch (error) {
    console.log(error);
    // res.status(500).send("An error occurred in inventoryupdateinfoau.");
    next(error);
  }
});

app.get("/write/listingrestrictions/all", async (req, res, next) => {
  try {
    writeListingsRestrictions(process.env.SPREADSHEET_ID3, "Sg_Listing", 2, "");
    console.log(`listingrestrictions/all started`);
    res.send("listingrestrictions/all completed.");
  } catch (error) {
    console.log(error);
    // res.status(500).send("An error occurred in listingrestrictions/all.");
    next(error);
  }
});

app.get("/write/listingrestrictions/manual", async (req, res, next) => {
  try {
    const rangeData = await readSpreadsheetValue(process.env.SPREADSHEET_ID3, "Sg_Listing!Y1:Z1");

    const readDataFlattened = rangeData.flat();
    const start = readDataFlattened[0];
    const end = readDataFlattened[1];
    writeListingsRestrictions(process.env.SPREADSHEET_ID3, "Sg_Listing", start, end);
    console.log(`write/listingrestrictions/manual`);
    res.send("write/listingrestrictions/manual completed.");
  } catch (error) {
    console.log(error);
    // res.status(500).send("An error occurred in write/listingrestrictions/manual.");
    next(error);
  }
});

// australia
app.get("/write/listingrestrictions/au/all", async (req, res, next) => {
  try {
    writeListingsRestrictionsAu(process.env.SPREADSHEET_ID3, "Au_Listing", 2, "");
    console.log(`writeListingsRestrictionsAu started`);
    res.send("writeListingsRestrictionsAu completed.");
  } catch (error) {
    console.log(error);
    // res.status(500).send("An error occurred in writeListingsRestrictionsAu.");
    next(error);
  }
});

app.get("/write/listingrestrictions/au/manual", async (req, res, next) => {
  try {
    const rangeData = await readSpreadsheetValue(process.env.SPREADSHEET_ID3, "Au_Listing!Y1:Z1");

    const readDataFlattened = rangeData.flat();
    const start = readDataFlattened[0];
    const end = readDataFlattened[1];
    writeListingsRestrictionsAu(process.env.SPREADSHEET_ID3, "Au_Listing", start, end);
    console.log(`writeListingsRestrictionsAu/manual`);
    res.send("writeListingsRestrictionsAu/manual completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeListingsRestrictionsAu/manual.");
  }
});

app.get("/write/newlisting", async (req, res, next) => {
  try {
    console.log(`writeNewListing starts`);

    await writeNewListing(process.env.SPREADSHEET_ID3, "Config", "Sg_Listing", "Prod_DB");
    res.send("writeNewListing completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeNewListing.");
  }
});

app.get("/write/searchcatalogitems", async (req, res, next) => {
  try {
    console.log(`writeNewListing starts`);

    await writeSearchCatalogItems();
    res.send("writeSearchCatalogItems completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeSearchCatalogItems.");
  }
});

app.get("/write/searchcatalogitemsall", async (req, res, next) => {
  try {
    console.log(`writeNewListing starts`);

    await writeSearchCatalogItemsAll();
    res.send("writeSearchCatalogItemsAll completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeSearchCatalogItemsAll.");
  }
});

//Amazon AUS
app.get("/write/newlisting/au", async (req, res, next) => {
  try {
    console.log(`writeNewListingAu starts`);

    await writeNewListingAu(process.env.SPREADSHEET_ID3, "Config", "Au_Listing", "Prod_DB");
    res.send("writeNewListingAu completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeNewListingAu.");
  }
});
//Amazon NA inventoryledger Report button
app.get("/write/na/inventoryledger", async (req, res, next) => {
  try {
    console.log(`writeInventoryLedgerReport starts`);

    await writeInventoryLedgerReport(process.env.SPREADSHEET_ID, "getInventoryLedger!A3:J");
    res.send("writeInventoryLedgerReport completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeInventoryLedgerReport.");
  }
});

// prod DB

app.get("/write/ngs", async (req, res, next) => {
  try {
    console.log(`writeCheck Dengerous and NgWords starts`);

    await writeCheckDengerousProduct(process.env.SPREADSHEET_ID3, "Prod_DB", 2, "Ama_NG_Brand&ASIN!D2:D");
    await writeCheckNgWordsProduct(process.env.SPREADSHEET_ID3, "Prod_DB", 2, "Ama_NG_Brand&ASIN!B2:B");

    res.send("writeCheck Dengerous and NgWords completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeNewListingAu.");
  }
});

// shopee endpoint

app.get("/write/spmy/newlisting", async (req, res, next) => {
  try {
    console.log(`writeNewListing starts`);

    await writeInventoryUpdateInfoSpMy(process.env.SPREADSHEET_ID3, "Config_Sp", "Sp_My_Selling", "Prod_DB");
    res.send("writeInventoryUpdateInfoSpMy completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeInventoryUpdateInfoSpMy.");
  }
});
app.get("/write/spsg/newlisting", async (req, res, next) => {
  try {
    console.log(`writeNewListing starts`);
    await writeInventoryUpdateInfoSpSg(process.env.SPREADSHEET_ID3, "Config_Sp", "Sp_Sg_Selling", "Prod_DB");
    res.send("writeInventoryUpdateInfoSpSg completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeInventoryUpdateInfoSpSg.");
  }
});

// keepa endpoint

app.get("/write/keepa/rivalsellerasins", async (req, res, next) => {
  try {
    console.log(`writeRivalSellerAsins starts`);
    await writeRivalSellerAsins();
    res.send("writeRivalSellerAsins completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeRivalSellerAsins.");
  }
});

// DeepL Transration endpoint

app.get("/write/deepl/transrate", async (req, res, next) => {
  try {
    console.log(`writeTranslatedText starts`);
    await writeTranslatedText(process.env.SPREADSHEET_ID2, "asinsByName", 10);
    res.send("writeTranslatedText completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeTranslatedText.");
  }
});

// Title -> ASINS

app.get("/write/jp/titleasins", async (req, res, next) => {
  try {
    console.log(`writeAsinsFromTitle starts`);
    await writeAsinsFromTitle(process.env.SPREADSHEET_ID2, "asinsByName", 10);
    res.send("writeAsinsFromTitle completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeAsinsFromTitle.");
  }
});

//deepL + title->Asins

app.get("/write/jp/titleasinswithtranslate", async (req, res, next) => {
  try {
    console.log(`writeAsinsFromTitleTranslate`);
    await writeAsinsFromTitleTranslate(process.env.SPREADSHEET_ID2, "asinsByName", 10);
    res.send("writeTranslatedText + asisFromTitle completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeTranslatedText + asisFromTitle.");
  }
});

// DeepL Transration endpoint sample

app.get("/write/deepl/transrate/sample", async (req, res, next) => {
  try {
    console.log(`writeTranslatedText starts`);
    await writeTranslatedText(process.env.SPREADSHEET_ID_sample, "asinsByName", 10);
    res.send("writeTranslatedText completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeTranslatedText.");
  }
});

// Title -> ASINS sample

app.get("/write/jp/titleasins/sample", async (req, res, next) => {
  try {
    console.log(`writeAsinsFromTitle starts`);
    await writeAsinsFromTitle(process.env.SPREADSHEET_ID_sample, "asinsByName", 10);
    res.send("writeAsinsFromTitle completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeAsinsFromTitle.");
  }
});

//deepL + title->Asins sample

app.get("/write/jp/titleasinswithtranslate/sample", async (req, res, next) => {
  try {
    console.log(`writeAsinsFromTitleTranslate starts`);
    writeAsinsFromTitleTranslate(process.env.SPREADSHEET_ID_sample, "asinsByName", 10);
    res.send("writeAsinsFromTitleTranslate.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeTranslatedText + asisFromTitle.");
  }
});

// bestMatch用APIエンドポイント
app.post("/api/get/bestmatch", async (req, res, next) => {
  console.log(res.body);
  const { targetString, compareStrings } = req.body;
  if (!targetString || !compareStrings) {
    return res.status(400).send({ error: "targetString and compareStrings are required" });
  }

  try {
    const result = await getMatch(targetString, compareStrings);
    res.json({ result });
  } catch (error) {
    next(error);
    res.status(500).send({ error: error.message });
  }
});

// fetch_shopee_data
app.get("/write/jp/shopee/catalog", async (req, res, next) => {
  try {
    console.log(`writeCatalogItemFromSheetShopee starts`);
    writeCatalogItemFromSheetShopee(process.env.SPREADSHEET_ID6, "fetch_shopee_data", 50);
    res.send("writeCatalogItemFromSheetShopee completed.");
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).send("An error occurred in writeCatalogItemFromSheetShopee.");
  }
});

// Approval submission for Amazon AU,SG
// app.get("/automation/aus/savecookie", async (req, res) => {
//   try {
//     console.log(`savecookie aus starts`);
//     await loginAndSaveCookies();
//     res.send("savecookie aus completed.");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("An error occurred in savecookie aus.");
//   }
// });

// app.get("/automation/aus/requestapproval", async (req, res) => {
//   try {
//     console.log(`requestapproval aus starts`);
//     await submitApprovalRequest(process.env.SPREADSHEET_ID3, "Au_Listing");
//     res.send("requestapproval aus completed.");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("An error occurred in requestapproval aus.");
//   }
// });

//エラーをSlackに通知する関数

app.get("/error", async (req, res, next) => {
  try {
    await writeCatalogItemFromSheetShopee(process.env.SPREADSHEET_ID61, "fetch_shopee_data", 50);
    res.send("writeCatalogItemFromSheetShopee completed.");
  } catch (error) {
    next(error);
  }
});

function notifySlack(error) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  axios
    .post(SLACK_WEBHOOK_URL, {
      text: `An error occurred in EC-suite: ${error.message} \n stack trace:${error.stack}`,
    })
    .then(() => console.log("Notified Slack about the error."))
    .catch(() => console.log("Error occurred while notifying Slack."));
}
//ミドルウェアの設定
app.use((error, req, res, next) => {
  //notify Slack
  notifySlack(error);

  res.status(500).send("An error occurred on the server");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
