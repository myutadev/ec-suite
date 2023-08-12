const SellingPartnerAPI = require('amazon-sp-api');
const fs = require('fs');

require('dotenv').config();


//marketplaceIDを配列に保存し、パラメーターで取得先を管理
const marketPlaceId = {
    'US':'ATVPDKIKX0DER',
    'CA':'A2EUQ1WTGCTBG2',
    'MX':'A1AM78C64UM0Y8'
}

// 前日の日付を動的に取得する関数 

const getStartOfYesterday = ()=>{
  let now = new Date();
  let yesterday = new Date(now);
  yesterday.setDate(now.getDate()-2);

  let startOfYesterday = yesterday.toISOString().split('T')[0] + "T00:00:00-07:00";
  return `${startOfYesterday}` //  2022-01-01T00:00:00-07:00

}

const getInterval = (getStartOfYesterday) => ()=>{
  let start = getStartOfYesterday();
  let end = start.split('T')[0] + "T23:59:59-07:00";
  return `${start}--${end}` // 2022-01-01T00:00:00-07:00--2023-07-31T23:59:59-07:00
}

// 
const getOrderMetrics = async(marketPlaceId) => {//const getShipments = 
  let res;
  let yesterday = getInterval(getStartOfYesterday)();
  // console.log(yesterday);
  try {
    let sellingPartner = new SellingPartnerAPI({
      region:'na', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token: process.env.refresh_token, // The refresh token of your app user
      credentials:{
          SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
          SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
          AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
          AWS_SELLING_PARTNER_ROLE:process.env.AWS_SELLING_PARTNER_ROLE
        }
    });
      res = await sellingPartner.callAPI({
        operation:'getOrderMetrics', // ここ変更！
        // endpoint: '', // ここも変更　無くても行ける
        path:'/sales/v1/orderMetrics',// ここ変更！
        query: {
          marketplaceIds: [marketPlaceId], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
          interval: yesterday,//'2022-01-01T00:00:00-07:00--2023-07-31T23:59:59-07:00',// 
          granularity:'Day'
        }
    });
    // console.log(res);
  } catch(e){
    console.log(e);
  };
  return res;
  
}; 

const getOrderMetricsUS = getOrderMetrics(marketPlaceId['US']);
const getOrderMetricsCA = getOrderMetrics(marketPlaceId['CA']);
const getOrderMetricsMX = getOrderMetrics(marketPlaceId['MX']);


//＊FBAに納品されてた商品情報を取得
const getShipmentItems = (async(params) => {//const getShipments = 
  let res;
  try {
    let sellingPartner = new SellingPartnerAPI({
      region:'na', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token:process.env.refresh_token, // The refresh token of your app user
      credentials:{
          SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
          SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
          AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
          AWS_SELLING_PARTNER_ROLE:process.env.AWS_SELLING_PARTNER_ROLE
        }
    });
      res = await sellingPartner.callAPI({
        operation:'getShipmentItems', // ここ変更！
        // endpoint: 'https://sellingpartnerapi-na.amazon.com', // ここも変更　無くても行ける
        path:'/fba/inbound/v0/shipmentItems',// ここ変更！
        query: {
          LastUpdatedAfter:'2023-07-01T00:00:00Z',
          LastUpdatedBefore:'2023-07-31T23:59:59Z',
          QueryType:'DATE_RANGE',
          MarketplaceIds: ['A2EUQ1WTGCTBG2'] // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        }
    });
    // console.log(res);
  } catch(e){
    console.log(e);
  };
  return res;
  
})(); 




const getFinances = async(params) => { 
  let res;
  let yesterday = getStartOfYesterday();
  try {
      let sellingPartner = new SellingPartnerAPI({
          region: 'na',
          refresh_token: process.env.refresh_token,
          credentials:{
              SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
              SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
              AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
              AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
              AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
          }
      });
      res = await sellingPartner.callAPI({
          operation:'listFinancialEvents', // ここ変更！
          endpoint: 'finances', // ここも変更　無くても行ける
          // path:'/fba/inbound/v0/shipmentItems',// ここ変更！
          query: {
              PostedAfter:yesterday,
          //   LastUpdatedBefore:'2023-07-31T23:59:59Z',
            // QueryType:'DATE_RANGE'
          //   MarketplaceIds: ['A2EUQ1WTGCTBG2'] // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
          }
      });
      fs.writeFileSync('output.json', JSON.stringify(res, null, 2));
    } catch(e) {
      console.log(e);
  };
  return res;
}; 

getFinances()
module.exports = {
  getOrderMetricsUS,
  getOrderMetricsCA,
  getOrderMetricsMX,
  getShipmentItems,
  getFinances
};

