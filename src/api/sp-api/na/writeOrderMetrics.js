const {getOrderMetrics} = require('./getOrderMetrics');
const {
  appendArrayDataToSheets,
} = require("../../../lib/appendArrayDataToSheets.js");
const {
  checkIfUpdateNeeded,
} = require("../../../lib/checkIfUpdateNeeded.js");


const writeOrderMetrics =  async (spreadsheetId,marketPlace,range) => { // getOrderMetricsCA
    const amazonData = await getOrderMetrics(marketPlace) ;// 更新する範囲を指定 要変更
    
    const values = amazonData.map(item => [
        item.interval,
        item.unitCount,
        item.orderItemCount,
        item.orderCount,
        item.averageUnitPrice.amount,
        item.totalSales.amount,
        item.totalSales.currencyCode
    ])

    const newLastRowData = values[values.length-1][0]; // 更新データのA列に入る最終行のデータ

    if(await checkIfUpdateNeeded(newLastRowData,spreadsheetId,range)){
        appendArrayDataToSheets(spreadsheetId,range,values);
    }else{
        console.log('ORDER METRICS / data had been updated before')
    };
}

// writeOrderMetrics(process.env.SPREADSHEET_ID,"CA","getOrderMetricsCA!A2:X")
// writeOrderMetrics(process.env.SPREADSHEET_ID,"US","getOrderMetricsUS!A2:X")
// writeOrderMetrics(process.env.SPREADSHEET_ID,"MX","getOrderMetricsMX!A2:X")
module.exports = {
  writeOrderMetrics
}
