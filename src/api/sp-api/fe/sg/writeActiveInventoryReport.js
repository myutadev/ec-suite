const {getActiveInventoryReport} = require('./getActiveInventoryReport');
const {updateArrayDataToSheets} = require('../../../../lib/updateArrayDataToSheets')
require('dotenv').config();

const writeActiveInventoryReport = async () => {
    console.log("writeActiveInventoryReport starts");
    const amazonData = await getActiveInventoryReport();
    if (amazonData == null) {
        console.log('writeActiveInventoryReport no data for today');
        return; 
    }

    const tsvData = amazonData/* ここにTSV形式のデータを入れます */;
    const lines = tsvData.split('\n');
    const headers = lines[0].split('\t');

    const arrayData = lines.slice(1).map(line => {
        const values = line.split('\t');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

    console.log(arrayData.slice(0, 10));

    const values = arrayData.map(item => [
        item.asin1,
        item['seller-sku'],
        item['item-name'],
        item.price,
        item.quantity
    ])
        console.log(values);
        // updateData(range,values); // かえる
    updateArrayDataToSheets(process.env.SPREADSHEET_ID2,'SGCurSelling!A2:F',values)
    console.log("writeInventoryhLedgerReport ends");

  };


// writeActiveInventoryReport()

  module.exports = {
    writeActiveInventoryReport
  };