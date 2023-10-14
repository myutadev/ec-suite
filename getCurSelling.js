const SellingPartnerAPI = require('amazon-sp-api');
const fs = require('fs');
require('dotenv').config();


//marketplaceIDを配列に保存し、パラメーターで取得先を管理
const marketPlaceId = {
    'US':'ATVPDKIKX0DER',
    'CA':'A2EUQ1WTGCTBG2',
    'MX':'A1AM78C64UM0Y8'
}


const getActiveInventoryReport = async() => { 
  console.log('getAcriveInventoryReport Function started!');
  let res
  try {
      let sellingPartner = new SellingPartnerAPI({
          region: 'na',
          refresh_token: process.env.refresh_token,
          credentials:{
              SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
              SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
              AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
              AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
              AWS_SELLING_PARTNER_ROLE:process.env.AWS_SELLING_PARTNER_ROLE
          }
      });
      res = await sellingPartner.downloadReport({
          body:{
              reportType: 'GET_MERCHANT_LISTINGS_DATA',
              marketplaceIds: ['A2EUQ1WTGCTBG2'],
              reportOptions:{
                  aggregateByLocation:'COUNTRY',
                  aggregatedByTimePeriod:'DAILY'
              }
          },
          version:'2021-06-30',
          interval:8000,
      });
      // console.log(res);
  const tsvData = res/* ここにTSV形式のデータを入れます */;
    const lines = tsvData.split('\n');
    const headers = lines[0].split('\t');

    const arrayData = lines.slice(1).map(line => {
        const values = line.split('\t');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

    // console.log(arrayData.slice(0, 10));

    const values = arrayData.map(item => [
        item.asin1,
        item['seller-sku'],
        item['item-name'],
        item.price,
        item.quantity // caなぜかquantity入ってない。
    ])
// console.log(`values is `,values);
  return values;

  } catch(e) {     
      console.log(e);
  };
};

getActiveInventoryReport()

module.exports = {
getActiveInventoryReport
};
