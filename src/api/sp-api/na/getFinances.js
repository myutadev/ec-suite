const SellingPartnerAPI = require("amazon-sp-api");
const { getStartOfYesterday, getEndOfYesterday } = require("../../../lib/getYesterday");
require("dotenv").config();

const getFinances = async () => {
  let res;
  const start = `${getStartOfYesterday()}-07:00`; // `${getStartOfYesterday()}-07:00`
  const end = `${getEndOfYesterday()}-07:00`; //`${getEndOfYesterday()}-07:00`

  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "na",
      refresh_token: process.env.refresh_token,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });
    res = await sellingPartner.callAPI({
      operation: "listFinancialEvents", // ここ変更！
      endpoint: "finances", // ここも変更　無くても行ける
      // path:'/fba/inbound/v0/shipmentItems',// ここ変更！
      query: {
        PostedAfter: start, // 2024-01-23T00:00:00-07:00
        PostedBefore: end, //  2024-01-23T23:59:59-07:00
        // PostedAfter: '2024-01-23T00:00:00-07:00', // 2024-01-23T00:00:00-07:00
        // PostedBefore: '2024-01-23T23:59:59-07:00', //  2024-01-23T23:59:59-07:00
      },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
  // console.log(res);
  return res;
};

module.exports = {
  getFinances,
};

// getFinances();
