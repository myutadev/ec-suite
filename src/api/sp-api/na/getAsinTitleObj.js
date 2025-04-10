const { getActiveInventoryReport } = require("./getActiveInventoryReport");

const getAsinTitleObj = async (marketPlace) => {
  const curSelling = await getActiveInventoryReport(marketPlace);
  console.log(curSelling);
  // curSellingのデータ構造
  //   [
  //       item.asin1,
  //       item['seller-sku'],
  //       item['item-name'],
  //       item.price,
  //       item.quantity
  //   ]

  const asinTitleObj = curSelling.reduce((acc, item) => {
    acc[item[0]] = 
      { 
        name:item[2],
        sku:item[1],
        price:item[3],
        quantity:item[4]
      }
    return acc;
  }, {});

  console.log(asinTitleObj);
  // console.log(asinTitleObj['B000AQYY38'])

  return asinTitleObj;
};

// getAsinTitleObj("CA");

module.exports = {
getAsinTitleObj
}
