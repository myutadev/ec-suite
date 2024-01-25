const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const loginUrl =
  "https://sellercentral.amazon.sg/ap/signin?clientContext=358-4836554-8639369&openid.return_to=https%3A%2F%2Fsellercentral.amazon.sg%2Fhome&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=sc_sg_amazon_v2&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&mons_redirect=sign_in&ssoResponse=eyJ6aXAiOiJERUYiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiQTI1NktXIn0.gccY_e38JDynb2ROjU1Z7GeO5nOlaFszV2e-DV1vJYCIMB4e8E5XPg.obxy24YgCeY_Ceej.Y3cOq4pmR24qqV9NZqcBHZWQefSIGJqVBwWQr3Dxh8x7mNXpLAGKAO0tK7txRmkfimBt18BDU7y176Jy9Iq0Qf04J5TBpeXknmdSm3hKmG8nJPe5Fr7QjdtGrJFFoAPFnotiZj0gXBZMlrngKF0u2Pg8a35S5aGMB43w7Q9IC0prO9WV9SpZL4z7-z4e_0sA3b6cPfD4oH6cYyVivOeF4quKFG5emO5hFGwPSd7XP5lmWNnAc8OrGKgoFYj4EEw.o9iR5AjZXImkt3tYP753Ow";
const cookiesFilePath = `${__dirname}/cookies.json`;

async function loginAndSaveCookies() {
  const browser = await puppeteer.launch({ headless: false }); // ヘッドレスモードを無効にしてブラウザを表示
  const page = await browser.newPage();

  await page.goto(loginUrl);

  // ユーザー名とパスワードの入力
  await page.type("#ap_email", "");
  await page.type("#ap_password", "");
  await page.click("#signInSubmit");

  // 二段階認証コードの入力を待つ（手動で入力）
  await page.waitForNavigation();

  // 特定のボタンが現れるまで待つ
  // ログイン後の処理が完了し、特定の要素が表示されるまで待つ
  await page.waitForSelector(".kpi-section-title", { visible: true });

  // 特定の要素が表示された後の処理を続ける

  // ログイン後、クッキーを保存
  const cookies = await page.cookies();
  await fs.writeFile(cookiesFilePath, JSON.stringify(cookies, null, 2));

  // await browser.close();
}

// loginAndSaveCookies();
