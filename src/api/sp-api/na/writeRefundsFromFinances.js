const { getFinances } = require("./getFinances.js");
const { updateArrayDataToSheets } = require("../../../lib/updateArrayDataToSheets.js");
const { checkIfUpdateNeeded } = require("../../../lib/checkIfUpdateNeeded.js");
const { readSpreadsheetValue } = require("../../../lib/readSpreadsheetValue.js");
const { getStartOfYesterday, getEndOfYesterday } = require("../../../lib/getYesterday");

const writeRefundsFromFinances = async (spreadsheetId, sheetName) => {
  console.log("writeRefundsGetFinancesStarted");
  const start = `${getStartOfYesterday()}-07:00`; // `${getStartOfYesterday()}-07:00`
  const end = `${getEndOfYesterday()}-07:00`; //`${getEndOfYesterday()}-07:00`

  // const start = `2024-09-11T00:00:00-07:00`; // `${getStartOfYesterday()}-07:00`
  // const end = `2024-09-13T23:59:59-07:00`; //`${getEndOfYesterday()}-07:00`

  const range = `${sheetName}!A1:L`;
  const amazonData = await getFinances(start, end);
  console.log(range);
  const sheetData = await readSpreadsheetValue(spreadsheetId, range);
  const updateStartRow = sheetData.length + 1;
  console.log(updateStartRow);
  const updateRange = `${sheetName}!A${updateStartRow}:L`;
  console.log(updateRange);
  const values = amazonData.FinancialEvents.RefundEventList.map((item) => [
    item.AmazonOrderId,
    item.MarketplaceName,
    item.PostedDate,
    item.ShipmentItemAdjustmentList[0].SellerSKU,
    item.ShipmentItemAdjustmentList[0].QuantityShipped,
    item.ShipmentItemAdjustmentList[0].ItemChargeAdjustmentList[0].ChargeAmount.CurrencyCode,
    item.ShipmentItemAdjustmentList[0].ItemChargeAdjustmentList[0].ChargeAmount.CurrencyAmount,
    item.ShipmentItemAdjustmentList[0].ItemChargeAdjustmentList[1].ChargeAmount.CurrencyAmount,
    item.ShipmentItemAdjustmentList[0]?.ItemChargeAdjustmentList[2]?.ChargeAmount?.CurrencyAmount ?? "",
    item.ShipmentItemAdjustmentList[0]?.ItemChargeAdjustmentList[3]?.ChargeAmount?.CurrencyAmount ?? "",
    item.ShipmentItemAdjustmentList[0].ItemFeeAdjustmentList[0].FeeAmount.CurrencyAmount,
    item.ShipmentItemAdjustmentList[0].ItemFeeAdjustmentList[1].FeeAmount.CurrencyAmount,
    // item.ShipmentItemAdjustmentList[0]?.ItemTaxWithheldList[0]?.TaxesWithheld?.CurrencyAmount ?? '',
    // item?.ShipmentItemAdjustmentList[0]?.PromotionAdjustmentList[0]?.PromotionAmount?.CurrencyAmount    ?? ''
    // item.ShipmentItemList[0].ItemFeeList[2].FeeAmount.CurrencyAmount,
    // item.ShipmentItemList[0].ItemFeeList[3].FeeAmount.CurrencyAmount,
    // item.ShipmentItemList[0].ItemFeeList[4].FeeAmount.CurrencyAmount, // ここまで入れるとメキシコのデータでエラーになる
    // item.ShipmentItemList[0].ItemFeeList[5].FeeAmount.CurrencyAmount,
  ]);
  console.log(values);
  const newLastRowData = values.length > 0 ? values[values.length - 1][0] : null; // 更新データのA列に入る最終行のデータ
  console.log(newLastRowData);

  if (await checkIfUpdateNeeded(newLastRowData, spreadsheetId, range)) {
    try {
      await updateArrayDataToSheets(spreadsheetId, updateRange, values);
    } catch (error) {
      throw error;
    }
  } else {
    console.log("REFUND / data had been updated before");
  }
};
// writeRefundsFromFinances(process.env.SPREADSHEET_ID, "refunds");

module.exports = {
  writeRefundsFromFinances,
};
