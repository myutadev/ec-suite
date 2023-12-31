const axios = require("axios");
require("dotenv").config();
const fs = require("fs");

const marketObj = {
  com: 1,
  "co.uk": 2,
  de: 3,
  fr: 4,
  "co.jp": 5,
  ca: 6,
  it: 8,
  es: 9,
  in: 10,
  "com.mx": 11,
};

const getSellerInfo = async (market, sellerId, storeFront) => {
  const config = {
    method: "post",
    url: "https://api.keepa.com/seller",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: {
      key: process.env.KEEPA_ACCESS_KEY,
      domain: marketObj[market],
      seller: sellerId,
      storefront: storeFront,
    },
  };

  const response = await axios(config);

  return response.data.sellers

  // console.log(response.data.sellers);
};

// getSellerInfo("ca", "AZBOZ1WY12RDV", 0);

module.exports = {
  getSellerInfo,
};
