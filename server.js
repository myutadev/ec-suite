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

const app = express();
const port = process.env.PORT || 3000;

// 12/19 changed
app.get("/write/bizreport", async (req, res) => {
  try {
    await writeBusinessReport();
    console.log(`writeBusinessReport started`);
    res.send("writeBusinessReport completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeBusinessReport.");
  }
});

// 12/19 changed
app.get("/write/catalog", async (req, res) => {
  try {
    await writeGetCatalogItemToSheet(process.env.SPREADSHEET_ID, "NAfetchProdInfo");
    console.log(`writeGetCatalogItemToSheet started`);
    res.send("writeGetCatalogItemToSheet completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeGetCatalogItemToSheet.");
  }
});

//12/19 changed
app.get("/write/fnsku", async (req, res) => {
  try {
    await writeSkuToFnsku(process.env.SPREADSHEET_ID, "skuToFnsku");
    console.log(`writeSkuToFnsku`);
    res.send("writeSkuToFnsku completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred.");
  }
});

//Amazon JP need to check

app.get("/main", async (req, res) => {
  try {
    await writeCatalogItemFromSheet(process.env.SPREADSHEET_ID2, "fetchProdInfo", 20);
    console.log(`writeCatalogItemFromSheet started`);
    res.send("writeCatalogItemFromSheet completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeCatalogItemFromSheet.");
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

app.get("/write/activesg", async (req, res) => {
  try {
    await writeActiveInventoryReport(process.env.SPREADSHEET_ID3, "Sg_Selling!A2:F");
    console.log(`writeactivesg started`);
    res.send("writeactivesg completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeactivesg.");
  }
});

//Amazon JP end

app.get("/write/prodprice/", async (req, res) => {
  try {
    await writeProdCurPriceBySheet(
      process.env.SPREADSHEET_ID3,
      "Prod_DB",
      "D", // asinのある列
      "C",
      "B",
      "E",
      800 // 100個で実行 1h 1600 /  500個実行してみる→12.5h  1h1800のペース 1秒0.5リクエスト 目安  10万で2.5  /
      // 12/24 11:51 twtime 500-> 800
    );
    console.log(`writeProdCurPriceBySheet started`);
    res.send("writeProdCurPriceBySheet completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeactivesg.");
  }
});

app.get("/write/prodprice/manual", async (req, res) => {
  try {
    await writeProdCurPriceBySheet(
      process.env.SPREADSHEET_ID3,
      "Fetch_manual",
      "D", // asinのある列
      "C",
      "B",
      "E",
      800
    );
    console.log(`writeProdCurPriceBySheet started`);
    res.send("writeProdCurPriceBySheet completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeactivesg.");
  }
});

app.get("/write/shippingInfo", async (req, res) => {
  try {
    writeShippingInfo(process.env.SPREADSHEET_ID3, "Prod_DB");
    console.log(`writeShippingInfo started`);
    res.send("writeShippingInfo completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeShippingInfo.");
  }
});

app.get("/write/inventoryupdateinfo", async (req, res) => {
  try {
    writeInventoryUpdateInfo(process.env.SPREADSHEET_ID3, "Config", "Sg_Selling", "Prod_DB");
    console.log(`writeInventoryUpdateInfo started`);
    res.send("writeInventoryUpdateInfo completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeInventoryUpdateInfo.");
  }
});

app.get("/write/listingrestrictions/all", async (req, res) => {
  try {
    writeListingsRestrictions(process.env.SPREADSHEET_ID3, "Sg_Listing", 2, "");
    console.log(`listingrestrictions/all started`);
    res.send("listingrestrictions/all completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in listingrestrictions/all.");
  }
});

app.get("/write/listingrestrictions/manual", async (req, res) => {
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
    res.status(500).send("An error occurred in write/listingrestrictions/manual.");
  }
});

app.get("/write/newlisting", async (req, res) => {
  try {
    console.log(`writeNewListing starts`);

    await writeNewListing(process.env.SPREADSHEET_ID3, "Config", "Sg_Listing", "Prod_DB");
    res.send("writeNewListing completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeNewListing.");
  }
});

app.get("/write/searchcatalogitems", async (req, res) => {
  try {
    console.log(`writeNewListing starts`);

    await writeSearchCatalogItems();
    res.send("writeSearchCatalogItems completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeSearchCatalogItems.");
  }
});

app.get("/write/searchcatalogitemsall", async (req, res) => {
  try {
    console.log(`writeNewListing starts`);

    await writeSearchCatalogItemsAll();
    res.send("writeSearchCatalogItemsAll completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeSearchCatalogItemsAll.");
  }
});

// shopee endpoint

app.get("/write/spmy/newlisting", async (req, res) => {
  try {
    console.log(`writeNewListing starts`);

    await writeInventoryUpdateInfoSpMy(process.env.SPREADSHEET_ID3, "Config_Sp", "Sp_My_Selling", "Prod_DB");
    res.send("writeInventoryUpdateInfoSpMy completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeInventoryUpdateInfoSpMy.");
  }
});
app.get("/write/spsg/newlisting", async (req, res) => {
  try {
    console.log(`writeNewListing starts`);
    await writeInventoryUpdateInfoSpSg(process.env.SPREADSHEET_ID3, "Config_Sp", "Sp_Sg_Selling", "Prod_DB");
    res.send("writeInventoryUpdateInfoSpSg completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeInventoryUpdateInfoSpSg.");
  }
});

// keepa endpoint

app.get("/write/keepa/rivalsellerasins", async (req, res) => {
  try {
    console.log(`writeRivalSellerAsins starts`);
    await writeRivalSellerAsins();
    res.send("writeRivalSellerAsins completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeRivalSellerAsins.");
  }
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
