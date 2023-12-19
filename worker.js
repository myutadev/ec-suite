// const {writeOrderMetricsCA,writeOrderMetricsUS,writeOrderMetricsMX} = require('./writeGetOrderMetrics');
// const {writeGetFinances} = require('./writeGetFinances');
// const {writeInventoryhLedgerReport} = require('./writeInventoryLedgerReportToSpreadsheet');
// const {writeRefundsGetFinances} = require('./writeRefundGetFinances');
const {writeOrderMetrics} = require('./src/api/sp-api/na/writeOrderMetrics');
const {writeFinances} = require('./src/api/sp-api/na/writeFinances');
const {writeRefundsFromFinances} = require('./src/api/sp-api/na/writeRefundsFromFinances');
const {writeInventoryLedgerReport} = require('./src/api/sp-api/na/writeInventoryLedgerReport');
const cron = require('node-cron');

cron.schedule('0 9 * * *',()=>{
    writeOrderMetrics(process.env.SPREADSHEET_ID,"CA","getOrderMetricsCA!A2:X");
    writeOrderMetrics(process.env.SPREADSHEET_ID,"US","getOrderMetricsUS!A2:X");
    writeOrderMetrics(process.env.SPREADSHEET_ID,"MX","getOrderMetricsMX!A2:X");
    writeFinances(process.env.SPREADSHEET_ID,"getFinances!A3:Z");
    writeRefundsFromFinances(process.env.SPREADSHEET_ID,"refunds");
    writeInventoryLedgerReport(process.env.SPREADSHEET_ID,"getInventoryLedger!A3:Z");
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

