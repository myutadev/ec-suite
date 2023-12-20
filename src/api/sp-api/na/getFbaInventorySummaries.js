const SellingPartnerAPI = require('amazon-sp-api');
require('dotenv').config();


//marketplaceIDを配列に保存し、パラメーターで取得先を管理
const marketPlaceId = {
    'US':'ATVPDKIKX0DER',
    'CA':'A2EUQ1WTGCTBG2',
    'MX':'A1AM78C64UM0Y8'
}

const getFbaInventorySummaries = async(marketPlace) => { 
  let res;
  // console.log('skuArray',skuArray)
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
          operation:'getInventorySummaries', // ここ変更！
          endpoint: 'fbaInventory', // ここも変更　無くても行ける
          query: {
              granularityType:"Marketplace",
              granularityId:marketPlaceId[marketPlace],              
              // sellerSkus:skuArray,
              marketplaceIds:[marketPlaceId[marketPlace]],
          }
      });
    console.log(res);
    } catch(e) {
      console.log(e);
  };
  return res;
}; 


// getFbaInventorySummaries('CA',[`CA20001-220305-B07FBJ5SQJ-74.85-89.81`,`CA3973-221002-B07DVPWQ23-72.46`])
getFbaInventorySummaries('CA')

module.exports = {
  getFbaInventorySummaries,
}
