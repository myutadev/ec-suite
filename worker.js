// const {writeOrderMetricsCA,writeOrderMetricsUS,writeOrderMetricsMX} = require('./writeGetOrderMetrics');
const {writeGetFinances} = require('./writeGetFinances');
const {writeInventoryhLedgerReport} = require('./writeInventoryLedgerReportToSpreadsheet');
const {writeRefundsGetFinances} = require('./writeRefundGetFinances');
const {writeOrderMetrics} = require('./src/api/sp-api/na/writeOrderMetrics');
const cron = require('node-cron');

cron.schedule('0 9 * * *',()=>{
    writeOrderMetrics(process.env.SPREADSHEET_ID,"CA","getOrderMetricsCA!A2:X");
    writeOrderMetrics(process.env.SPREADSHEET_ID,"US","getOrderMetricsUS!A2:X");
    writeOrderMetrics(process.env.SPREADSHEET_ID,"MX","getOrderMetricsMX!A2:X");
    writeGetFinances();
    writeRefundsGetFinances();
    writeInventoryhLedgerReport();

})

//テスト用 1分ごとに実行
// cron.schedule('*/1 * * * *', () => {
// cron.schedule('0 9 * * *',()=>{ ````````




// writeOrderMetricsCA();
// writeOrderMetricsUS();
// writeOrderMetricsMX();
// writeGetFinances();
// writeRefundsGetFinances();
// writeInventoryhLedgerReport();

