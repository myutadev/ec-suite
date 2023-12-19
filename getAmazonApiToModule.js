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
//12/19 will delete
// const getStartOfYesterday = () => {
//   let now = new Date();
//   let yesterday = new Date(now);
//   yesterday.setDate(now.getDate() - 2);

//   let startOfYesterday = yesterday.toISOString().split('T')[0] + "T00:00:00-07:00";
//   return `${startOfYesterday}`; //  2022-01-01T00:00:00-07:00
// };
//12/19 will delete

// const getEndOfYesterday =() => {
//   let now = new Date();
//   let yesterday = new Date(now);
//   yesterday.setDate(now.getDate() - 2);

//   let startOfYesterday = yesterday.toISOString().split('T')[0] + "T23:59:59-07:00";
//   return `${startOfYesterday}`; //  2022-01-01T00:00:00-07:00
// };
//12/19 will delete

// const getInterval = (startOfYesterday) => {
//   let end = getEndOfYesterday(startOfYesterday);
//   return `${startOfYesterday}--${end}`;
// };

// const startOfYesterday = getStartOfYesterday(); 
// console.log(getStartOfYesterday())
// console.log(getEndOfYesterday(startOfYesterday))
 
 // 12/19 切り出し  as getOrderMetrics
// const getOrderMetrics = async(marketPlaceId) => {//const getShipments = 
//   let res;
//   let yesterday = getInterval(startOfYesterday);
//   // console.log(yesterday);
//   try {
//     let sellingPartner = new SellingPartnerAPI({
//       region:'na', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
//       refresh_token: process.env.refresh_token, // The refresh token of your app user
//       credentials:{
//           SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
//           SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
//           AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
//           AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
//           AWS_SELLING_PARTNER_ROLE:process.env.AWS_SELLING_PARTNER_ROLE
//         }
//     });
//       res = await sellingPartner.callAPI({
//         operation:'getOrderMetrics', // ここ変更！
//         endpoint: 'sales', // ここも変更　無くても行ける
//         path:'/sales/v1/orderMetrics',// ここ変更！
//         query: {
//           marketplaceIds: [marketPlaceId], // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
//           interval: yesterday,//'2022-01-01T00:00:00-07:00--2023-07-31T23:59:59-07:00',// 
//           granularity:'Day'
//         }
//     });
//     // console.log(res);
//   } catch(e){
//     console.log(e);
//   };
//   return res;
  
// }; 

// const getOrderMetricsUS = getOrderMetrics(marketPlaceId['US']);
// const getOrderMetricsCA = getOrderMetrics(marketPlaceId['CA']);
// const getOrderMetricsMX = getOrderMetrics(marketPlaceId['MX']);


//＊FBAに納品された商品情報を取得
const getInventoryhLedgerReport = async(params) => { 
  console.log('Function started!');
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
              reportType: 'GET_LEDGER_SUMMARY_VIEW_DATA',
              marketplaceIds: ['ATVPDKIKX0DER'],
              dataStartTime : startOfYesterday, // 2023-09-10T00:00:00-07:00
              dataEndTime : getEndOfYesterday(startOfYesterday),//2023-09-10T23:59:59-07:00
              reportOptions:{
                  aggregateByLocation:'COUNTRY',
                  aggregatedByTimePeriod:'DAILY'
              }
          },
          version:'2021-06-30',
          interval:8000,
          // download:{
          //   json:true,
          //   file:'/Users/ssdef/AmazonApi/report.json'
          // }
      });
      // fs.writeFileSync('output.json', JSON.stringify(res, null, 2));
      // console.log(res);
  } catch(e) {     
      console.log(e);
  };
  console.log('Function end!');
  return res;
}; 




const getFinances = async(params) => { 
  let res;
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
              PostedAfter:startOfYesterday,
              // PostedAfter:'2023-08-01T23:59:59Z',              
              PostedBefore:getEndOfYesterday(startOfYesterday),
          //   LastUpdatedBefore:'2023-07-31T23:59:59Z',
          // QueryType:'DATE_RANGE'
          //   MarketplaceIds: ['A2EUQ1WTGCTBG2'] // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
          }
      });
      // fs.writeFileSync('output.json', JSON.stringify(res, null, 2));
    } catch(e) {
      console.log(e);
  };
  return res;
}; 

// //12/19 getFbaInventorySummaries.js で切り出し
// const getInventorySummaries = async(marketPlaceID,skuArray) => { 
//   let res;
//   // console.log('skuArray',skuArray)
//   try {
//       let sellingPartner = new SellingPartnerAPI({
//           region: 'na',
//           refresh_token: process.env.refresh_token,
//           credentials:{
//               SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
//               SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
//               AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
//               AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
//               AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
//           }
//       });
//       res = await sellingPartner.callAPI({
//           operation:'getInventorySummaries', // ここ変更！
//           endpoint: 'fbaInventory', // ここも変更　無くても行ける
//           // path:'/fba/inbound/v0/shipmentItems',// ここ変更！
//           query: {
//               granularityType:"Marketplace",
//               granularityId:marketPlaceID,              
//               sellerSkus:skuArray,
//               marketplaceIds:[marketPlaceID],
//           // QueryType:'DATE_RANGE'
//           //   MarketplaceIds: ['A2EUQ1WTGCTBG2'] // Ca A2EUQ1WTGCTBG2 / US ATVPDKIKX0DER // MX A1AM78C64UM0Y8
//           }
//       });
//       // console.log(res);
//       // console.log(res.inventorySummaries[0].fnSku);

//       // fs.writeFileSync('output.json', JSON.stringify(res, null, 2));
//     } catch(e) {
//       console.log(e);
//   };
//   return res;
// }; 

//2023/12/19 切り出し済み 削除OK
// //小山さん依頼:ビジネスレポートの値･ユニットセッション率･カート取得率等
// const getBusinessReport = async(sheetValues) => { 
//   console.log('getBusinessReport Function started!');
//   console.log(sheetValues[0])
//   console.log(sheetValues[1])
//   console.log(sheetValues[2])
//   let res
//   try {
//       let sellingPartner = new SellingPartnerAPI({
//           region: 'na',
//           refresh_token: process.env.refresh_token,
//           credentials:{
//               SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
//               SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
//               AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
//               AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
//               AWS_SELLING_PARTNER_ROLE:process.env.AWS_SELLING_PARTNER_ROLE
//           }
//       });
//       res = await sellingPartner.downloadReport({
//           body:{
//               reportType: 'GET_SALES_AND_TRAFFIC_REPORT',
//               marketplaceIds: [sheetValues[0]],
//               dataStartTime : sheetValues[1], // 2023-09-10T00:00:00-07:00 startOfYesterday
//               dataEndTime : sheetValues[2],//2023-09-10T23:59:59-07:00 getEndOfYesterday(startOfYesterday)
//               reportOptions:{
//                   dateGranularity:'DAY',//DAY, WEEK, MONTH. Default: DAY.
//                   asinGranularity:'CHILD'//PARENT, CHILD, SKU. Default: PARENT.
//               }
//           },
//           version:'2021-06-30',
//           interval:8000,
//           // download:{
//           //   json:true,
//           //   file:'/Users/ssdef/AmazonApi/report.json'
//           // }
//       });
//       // fs.writeFileSync('output.json', JSON.stringify(res, null, 2));
//       // console.log(res);
//   } catch(e) {     
//       console.log(e);
//   };
//   console.log('Function end!');
//   return res;
// }; 

// getBusinessReport();


// getInventorySummaries("A2EUQ1WTGCTBG2",["CA51003-231002-B01BZKPWTM-34.9","CA51003-231002-B01BZKPWTM-34.9"])
module.exports = {

  getInventoryhLedgerReport,
  getFinances,
  // getInventorySummaries,
  // getBusinessReport
};

