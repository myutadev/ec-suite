const getAvailablePriceArr = (obj, asin) => {
  //エラーobjだったとき
  if (obj[asin].error) return [`https://www.amazon.co.jp/dp/${asin}`, obj[asin].update, asin, obj[asin].error];

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
      return [
        `https://www.amazon.co.jp/dp/${asin}`,
        obj[asin].update,
        asin,
        obj[asin].LowestPrice[i] + obj[asin].Shipping[i],
      ];
    }
  }
  return [`https://www.amazon.co.jp/dp/${asin}`, obj[asin].update, asin, ""];
};

module.exports = {
  getAvailablePriceArr,
};

// forTest
// const obj = {
//   B00KKEBTEM: { update: "2023-12-22T17:29:07+09:00", error: "InvalidInput" },
// };

// const asin = "B00KKEBTEM";

// const obj2 = {
//   B00KKEBTEM: {
//     update: "2023-12-22T17:46:54+09:00",
//     Shipping: [590, 0],
//     LowestPrice: [2637, 3270],
//     BuyBoxPrices: "",
//     TotalOfferCount: 17,
//     Condition: "new",
//     ShipsFromCountry: ["JP", ""],
//     AvailabilityType: ["NOW", "NOW"],
//     MaximumHours: [72, 0],
//   },
// };

// const obj3 = {
//   B00KKEBTEM: {
//     update: "2023-12-22T11:20:22+09:00",
//     LowestPrice: [3027, 3730],
//     BuyBoxPrices: 2997,
//     TotalOfferCount: 14,
//     Condition: "new",
//     ShipsFromCountry: ["JP", "JP"],
//     AvailabilityType: ["NOW", "NOW"],
//     MaximumHours: [62, 24],
//   },
// };

// const obj4 = {
//   B00KKEBTEM: {
//     update: "2023-12-22T11:20:22+09:00",
//     LowestPrice: [3027, 3730],
//     BuyBoxPrices: 2997,
//     TotalOfferCount: 14,
//     Condition: "new",
//     ShipsFromCountry: ["KR", "KR"],
//     AvailabilityType: ["NOW", "NOW"],
//     MaximumHours: [62, 24],
//   },
// };

// const obj5 = {
//   B00KKEBTEM: {
//     update: "2023-12-22T11:20:22+09:00",
//     LowestPrice: [3027, 3730],
//     BuyBoxPrices: 2997,
//     TotalOfferCount: 14,
//     Condition: "new",
//     ShipsFromCountry: ["JP", "JP"],
//     AvailabilityType: ["NOW", "NOW"],
//     MaximumHours: [0, 1000],
//   },
// };
// const obj6 = {
//   B00KKEBTEM: {
//     update: "2023-12-22T12:09:40+09:00",
//     LowestPrice: [7245, 7466],
//     BuyBoxPrices: 7173,
//     TotalOfferCount: 23,
//     Condition: "new",
//     ShipsFromCountry: ["", "JP"],
//     AvailabilityType: ["FUTURE_WITH_DATE", "FUTURE_WITH_DATE"],
//     MaximumHours: [0, 24],
//   },
// };

// console.log(getAvailablePriceArr(obj, asin));
// console.log(getAvailablePriceArr(obj2, asin));
// console.log(getAvailablePriceArr(obj3, asin));
// console.log(getAvailablePriceArr(obj4, asin));
// console.log(getAvailablePriceArr(obj5, asin));
// console.log(getAvailablePriceArr(obj6, asin));

// // 3730,3730,3027,,
