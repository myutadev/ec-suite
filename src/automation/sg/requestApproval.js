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
  await page.goto("https://sellercentral.amazon.sg/product-search/search?q=B086Z2QF7H&ref_=xx_catadd_dnav_xx"); // セッションが必要なページにアクセス

  // パスワードを入力フィールドに入力
  await page.type("#ap_password", "1974221Ds");

  // サインインボタンをクリック
  await page.click("#signInSubmit");


    // 要素を確認1.Approvalリクエスト or available 
    // if available - なにもしない  B07FMFLS8L
    // if approval request = click 




  // await browser.close();
}

useSavedCookies();
