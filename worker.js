const {writeOrderMetricsCA,writeOrderMetricsUS,writeOrderMetricsMX} = require('./writeGetOrderMetrics');
const {writeGetFinances} = require('./writeGetFinances');
const {writeInventoryhLedgerReport} = require('./writeInventoryLedgerReportToSpreadsheet');
const {writeRefundsGetFinances} = require('./writeRefundGetFinances');
const cron = require('node-cron');

cron.schedule('0 9 * * *',()=>{
    writeOrderMetricsCA();
    writeOrderMetricsUS();
    writeOrderMetricsMX();
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

