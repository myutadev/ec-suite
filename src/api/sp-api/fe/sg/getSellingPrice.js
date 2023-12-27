require("dotenv").config();

const getSellingPrice = async (
  shippingWeight,
  shippingMethod,
  jpPrice,
  rates,
  shippingFees
) => {
  let ceiledShippingWeight;

  const profitRate = parseFloat(rates[0][0]);
  const amazonFeeRate = parseFloat(rates[0][1]);
  const sgdToJpy = parseFloat(rates[0][2]);
  const otherFees = parseFloat(rates[0][3]); //国内の作業手数料300円を原価に加算

  const shippingFeeObj = {};

  shippingFees.forEach((arr) => {
    shippingFeeObj[arr[0]] = {
      ["smallPacket"]: arr[2],
      ["EMS"]: arr[3],
    };
  });

  if (shippingWeight <= 2000) {
    ceiledShippingWeight = Math.ceil(shippingWeight / 100) * 100;
  } else if (shippingWeight <= 6000) {
    ceiledShippingWeight = Math.ceil(shippingWeight / 500) * 500;
  } else {
    ceiledShippingWeight = Math.ceil(shippingWeight / 1000) * 1000;
  }

  const shippingFee = parseFloat(
    shippingFeeObj[ceiledShippingWeight][shippingMethod]
  );

  const totalCost = shippingFee + otherFees + jpPrice;
  const sgdTotalCost = Math.ceil(totalCost / sgdToJpy);
  const newListingPrice =
    Math.ceil((sgdTotalCost / (1 - profitRate - amazonFeeRate)) * 100) / 100;
  // console.log(newListingPrice);
  return newListingPrice;
};

module.exports = {
  getSellingPrice,
};

// getSellingPrice(280, "smallPacket", "280", 90, 300);
