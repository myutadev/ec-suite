const {getFbaInventorySummaries} = require('./getFbaInventorySummaries.js');

require('dotenv').config();

const getCurSellingFbaInventoryObj = async (marketPlace) =>{ // 配列を渡して複数対応する。
    const apiResponse = await getFbaInventorySummaries(marketPlace);

    const skuInfoObj = apiResponse['inventorySummaries'].reduce((acc,item)=>{
      acc[item.sellerSku] = item;
      return acc
    },{});
    
    console.log(skuInfoObj);
    return skuInfoObj
}


module.exports ={
    getCurSellingFbaInventoryObj
  }

// getCurSellingFbaInventoryObj("CA");
