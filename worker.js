const {writeOrderMetricsCA,writeOrderMetricsUS,writeOrderMetricsMX} = require('./writeGetOrderMetrics');
const {writeGetFinances} = require('./writeGetFinances');
const cron = require('node-cron');

cron.schedule('0 9 * * *',()=>{ 
    writeOrderMetricsCA();
    writeOrderMetricsUS();
    writeOrderMetricsMX();
    writeGetFinances();
})


// writeOrderMetricsCA();
// writeOrderMetricsUS();
// writeOrderMetricsMX();
// writeGetFinances();

