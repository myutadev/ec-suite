const {getFinances} = require('./getFinances'); 
const {
  appendArrayDataToSheets,
} = require("../../../lib/appendArrayDataToSheets.js");
const {
  checkIfUpdateNeeded,
} = require("../../../lib/checkIfUpdateNeeded.js");

const writeFinances = async (spreadsheetId,range) => {
    const amazonData = await getFinances();
    
    const values = amazonData.FinancialEvents.ShipmentEventList.map(item => [
        item.AmazonOrderId,
        item.MarketplaceName,
        item.PostedDate,
        item.ShipmentItemList[0].SellerSKU,
        item.ShipmentItemList[0].QuantityShipped,
        item.ShipmentItemList[0].ItemChargeList[0].ChargeAmount.CurrencyCode,
        item.ShipmentItemList[0].ItemChargeList[0].ChargeAmount.CurrencyAmount,
        item.ShipmentItemList[0].ItemChargeList[1].ChargeAmount.CurrencyAmount,
        item.ShipmentItemList[0].ItemChargeList[2].ChargeAmount.CurrencyAmount,
        item.ShipmentItemList[0].ItemChargeList[3].ChargeAmount.CurrencyAmount,
        item.ShipmentItemList[0].ItemChargeList[4].ChargeAmount.CurrencyAmount,
        item.ShipmentItemList[0].ItemChargeList[5].ChargeAmount.CurrencyAmount,
        item.ShipmentItemList[0]?.ItemFeeList ? item.ShipmentItemList[0]?.ItemFeeList[0].FeeAmount?.CurrencyAmount : "",
        item.ShipmentItemList[0]?.ItemFeeList ? item.ShipmentItemList[0]?.ItemFeeList[1].FeeAmount?.CurrencyAmount : "",
        item.ShipmentItemList[0]?.ItemFeeList ? item.ShipmentItemList[0]?.ItemFeeList[2].FeeAmount?.CurrencyAmount : "",
        item.ShipmentItemList[0]?.ItemFeeList ? item.ShipmentItemList[0]?.ItemFeeList[3].FeeAmount?.CurrencyAmount : "",
        // item.ShipmentItemList[0]?.ItemFeeList[4]?.FeeAmount?.CurrencyAmount ?? "", // ここまで入れるとメキシコのデータでエラーになる
        // item.ShipmentItemList[0]?.ItemFeeList[5]?.FeeAmount?.CurrencyAmount ?? "",
    ])

    const newLastRowData = values.length > 0 ? values[values.length-1][0] : null;// 更新データのA列に入る最終行のデータ

    if(await checkIfUpdateNeeded(newLastRowData,spreadsheetId,range)){
        appendArrayDataToSheets(spreadsheetId,range,values);
    }else{
        console.log('GET FINANCE  / data had been updated before')
    };

  };

// writeFinances(process.env.SPREADSHEET_ID,"getFinances!A3:Z")

module.exports = {
  writeFinances
}
