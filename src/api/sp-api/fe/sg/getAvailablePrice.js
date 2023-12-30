const { getItemOffers } = require("../jp/getItemOffers");

const getAvailablePrice = async (asin) => {
  //エラーobjだったとき

  const obj = await getItemOffers(asin);
  // console.log("obj is", obj);

  if (obj[asin].error) {
    console.log("error obj");
    return [`https://www.amazon.co.jp/dp/${asin}`, obj[asin].update, asin, obj[asin].error];
  }

  const isShipFromJp = (str) => str === "" || str === "JP";
  const isMaximumHoursBelow72 = (num) => num <= 144;
  const isAvailabilityTypeNow = (str) => str === "NOW";
  const isMaximumHoursValid = (num) => num <= 144 && num > 0;
  const isAvailabilityTypeFuture = (str) => str === "FUTURE_WITH_DATE";

  const offerLength = obj[asin].LowestPrice.length;

  for (let i = 0; i < offerLength; i++) {
    const conditionGroup1 =
      isShipFromJp(obj[asin].ShipsFromCountry[i]) &&
      isMaximumHoursBelow72(obj[asin].MaximumHours[i]) &&
      isAvailabilityTypeNow(obj[asin].AvailabilityType[i]);

    const conditionGroup2 =
      isShipFromJp(obj[asin].ShipsFromCountry[i]) &&
      isMaximumHoursValid(obj[asin].MaximumHours[i]) &&
      isAvailabilityTypeFuture(obj[asin].AvailabilityType[i]);

    // console.log(conditionGroup1);
    // console.log(conditionGroup2);

    if (conditionGroup1 || conditionGroup2) {
      // console.log("price is", obj[asin].LowestPrice[i] + obj[asin].Shipping[i]);
      return obj[asin].LowestPrice[i] + obj[asin].Shipping[i];
    }
  }
  // console.log("no available listing");
  return "";
};

module.exports = {
  getAvailablePrice,
};
