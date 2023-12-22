const express = require("express");
const {
  writeBusinessReport,
} = require("./src/api/sp-api/na/writeBusinessReport");
const {
  writeGetCatalogItemToSheet,
} = require("./src/api/sp-api/na/writeGetCatalogItemToSheet");
const { writeSkuToFnsku } = require("./src/api/sp-api/na/writeskuToFnsku");
const {
  writeCatalogItemFromSheet,
} = require("./src/api/sp-api/fe/jp/writeCatalogItemFromSheet");
const {
  writeCurSellingCompetitivePrice,
} = require("./src/api/sp-api/fe/sg/writeCurSellingCompetitivePrice");
const {
  writeActiveInventoryReport,
} = require("./src/api/sp-api/fe/sg/writeActiveInventoryReport");
const {
  writeProdCurPriceBySheet,
} = require("./src/api/sp-api/fe/sg/writeProdCurPriceBySheet.js");

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
    await writeGetCatalogItemToSheet(
      process.env.SPREADSHEET_ID,
      "NAfetchProdInfo"
    );
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
    await writeCatalogItemFromSheet(
      process.env.SPREADSHEET_ID2,
      "fetchProdInfo"
    );
    console.log(`writeCatalogItemFromSheet started`);
    res.send("writeCatalogItemFromSheet completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeCatalogItemFromSheet.");
  }
});

app.get("/writesg", async (req, res) => {
  try {
    await writeCurSellingCompetitivePrice();
    console.log(`writesg started`);
    res.send("writesg completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writesg.");
  }
});

app.get("/writeactivesg", async (req, res) => {
  try {
    await writeActiveInventoryReport();
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
      100
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
      100
    );
    console.log(`writeProdCurPriceBySheet started`);
    res.send("writeProdCurPriceBySheet completed.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in writeactivesg.");
  }
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
