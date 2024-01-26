const puppeteer = require("puppeteer");
const { readSpreadsheetValue } = require("../../lib/readSpreadsheetValue");
const { updateArrayDataToSheets } = require("../../lib/updateArrayDataToSheets");
const { updateSpreadsheetIfNecessary } = require("../../lib/updateArrayDataIfNecessary");
const fs = require("fs").promises;

const cookiesFilePath = `${__dirname}/cookies.json`;

async function submitApprovalRequest(spreadsheetId, sheetName) {
  const browser = await puppeteer.launch({ headless: false }); // ヘッドレスモードを無効にしてブラウザを表示
  const page = await browser.newPage();

  const rangeData = await readSpreadsheetValue(spreadsheetId, `${sheetName}!AA1:AB1`);
  const readDataFlattened = rangeData.flat();
  const start = readDataFlattened[0];
  const end = readDataFlattened[1];

  // 実行範囲読み取り
  const writeRange = `${sheetName}!AA${start}:AB${end}`;
  const readRange = `${sheetName}!Y${start}:Y${end}`;
  const sheetData = await readSpreadsheetValue(spreadsheetId, readRange);

  const urlArr = sheetData.flat();

  // 保存したクッキーを読み込む
  const cookiesString = await fs.readFile(cookiesFilePath);
  const cookies = JSON.parse(cookiesString);
  const resultArray = [];
  let currentRow = parseInt(start);
  console.log("type of", typeof currentRow); // 現在の行を保持する変数

  // クッキーを使用してログイン状態を復元
  await page.setCookie(...cookies);

  for (url of urlArr) {
    await page.goto(url); // セッションが必要なページにアクセス

    let elementText;
    try {
      elementText = await page.$eval("span.a-list-item", (element) => {
        return element.textContent.trim();
      });
    } catch {}
    console.log(elementText);

    if (!elementText) {
      console.log("no page");
      resultArray.push(["no page"]);
      const updatedRows = await updateSpreadsheetIfNecessary(spreadsheetId, sheetName, resultArray, currentRow);
      currentRow += updatedRows; // currentRowを更新した行数だけ増やす
      continue;
    }

    const approvalButton = await page.$('input[data-csm="saw-landing-page-request-approval-button-click"]');

    if (approvalButton) {
      const resArrNow = [elementText];

      await page.click('input[data-csm="saw-landing-page-request-approval-button-click"]');

      // ここから
      try {
        await page.waitForNavigation(); // ページが読み込まれるまで待つ
        const elementExists = await page.$eval("h3.saw-module-header", (element) => {
          return element.textContent.trim() === "Before you list your products, please watch the following video(s):";
        });

        if (elementExists) {
          // 要素が存在する場合に実行したいコードをここに書く
          console.log("指定の要素が存在します。");
          await page.waitForTimeout(2000);

          // ここにコードを追加
          await page.click("#saw_ques_seller_type__saw_reseller_dstr");
          await page.click("#saw_ques_listing_resp_header__saw_ques_listing_resp_option4");
          await page.click("#saw_ques_illegal_product_header__saw_ques_illegal_product_option_aotb");
          await page.click("#saw_ques_best_pract_compl_header__saw_ques_best_pract_compl_option_aotb");

          // チェックボックスを選択
          await page.click("#saw_ack_auth__saw_ack_auth");

          // メールアドレスを入力
          await page.type("#myq-application-form-email-input", "recievingjobs.y0414+aus@gmail.com");

          await page.click("#button-submit-form-category");
          resArrNow.push("approved");

          console.log(resArrNow);
        } else {
          console.log("指定の要素が存在しません。");
          resArrNow.push("Restrected");
          console.log(resArrNow);
        }
      } catch (error) {
        resArrNow.push("error happened");
        console.log(error);
      }
      resultArray.push(resArrNow);
      const updatedRows = await updateSpreadsheetIfNecessary(spreadsheetId, sheetName, resultArray, currentRow);
      currentRow += updatedRows; // currentRowを更新した行数だけ増やす
    } else {
      const resArrNow = ["already approved"];
      resultArray.push(resArrNow);
      const updatedRows = await updateSpreadsheetIfNecessary(spreadsheetId, sheetName, resultArray, currentRow);
      currentRow += updatedRows; // currentRowを更新した行数だけ増やす
    }
  }

  console.log("result Array is", resultArray);
  updateArrayDataToSheets(spreadsheetId, writeRange, resultArray);

  await browser.close(); // ブラウザインスタンスを閉じる
}

submitApprovalRequest(process.env.SPREADSHEET_ID3, "Au_Listing");

module.exports = {
  submitApprovalRequest,
};
