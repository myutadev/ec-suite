const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const cookiesFilePath = `${__dirname}/cookies.json`;

async function useSavedCookies() {
  const browser = await puppeteer.launch({ headless: false }); // ヘッドレスモードを無効にしてブラウザを表示
  const page = await browser.newPage();

  // 保存したクッキーを読み込む
  const cookiesString = await fs.readFile(cookiesFilePath);
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  // クッキーを使用してログイン状態を復元
  await page.goto(
    "https://sellercentral.amazon.sg/product-search/search?q=B086Z2QF7H&ref_=xx_catadd_dnav_xx"
  ); // セッションが必要なページにアクセス

  // ... 以後の自動化処理 ...
  await page.click("a.copy-kat-button.primary");

  // await browser.close();
}

useSavedCookies();
