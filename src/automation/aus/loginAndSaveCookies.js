const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const loginUrl = "https://sellercentral.amazon.com.au/gp/homepage.html?cor=login_FE&";
const cookiesFilePath = `${__dirname}/cookies.json`;

async function loginAndSaveCookies() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "/usr/bin/google-chrome", // Chromeの実行可能ファイルのパスを指定
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  }); // ヘッドレスモードを無効にしてブラウザを表示
  const page = await browser.newPage();

  await page.goto(loginUrl);

  // ログイン画面が表示されるのを待つ
  await page.waitForSelector("#ap_email");

  console.log("手動でログインしてください。ログインが完了したら何かキーを押してください...");

  // 二段階認証コードの入力を待つ（手動で入力）
  await page.waitForNavigation();

  // 特定のボタンが現れるまで待つ
  // ログイン後の処理が完了し、特定の要素が表示されるまで待つ
  await page.waitForSelector(".kpi-section-title", { visible: true });

  // 特定の要素が表示された後の処理を続ける

  // ログイン後、クッキーを保存
  const cookies = await page.cookies();
  await fs.writeFile(cookiesFilePath, JSON.stringify(cookies, null, 2));

  await browser.close();
}

module.exports = {
  loginAndSaveCookies,
};

// loginAndSaveCookies();
