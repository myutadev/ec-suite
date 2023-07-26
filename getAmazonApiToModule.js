const SellingPartnerAPI = require('amazon-sp-api');
require('dotenv').config();

// comment for githubtest
const getOrderMetrics = (async(params) => {//const getShipments = 
  let res;
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
        // endpoint: 'https://sellingpartnerapi-na.amazon.com', // ここも変更　無くても行ける
        path:'/sales/v1/orderMetrics',// ここ変更！
        query: {
          marketplaceIds: ['A2EUQ1WTGCTBG2'], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
          interval:'2023-07-01T00:00:00-07:00--2023-07-23T00:00:00-07:00',
          granularity:'Day'
        }
    });
  } catch(e){
    console.log(e);
  };
  return res;
  
})(); 

module.exports = getOrderMetrics;


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
          LastUpdatedBefore:'2023-07-31T00:00:00Z',
          QueryType:'DATE_RANGE',
          MarketplaceIds: ['A2EUQ1WTGCTBG2'] // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
        }
    });
    console.log(res);
  } catch(e){
    console.log(e);
  };
  return res;
  
})(); 

module.exports = {
  getOrderMetrics,
  getShipmentItems
};

