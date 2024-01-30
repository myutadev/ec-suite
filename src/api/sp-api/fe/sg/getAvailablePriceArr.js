const getAvailablePriceArr = (obj, asin) => {
  //エラーobjだったとき
  if (obj[asin].error) return [`https://www.amazon.co.jp/dp/${asin}`, obj[asin].update, asin, obj[asin].error];

  const isShipFromJp = (str) => str === "" || str === "JP";
  const isMaximumHoursBelow72 = (num) => num <= 144;
  const isAvailabilityTypeNow = (str) => str === "NOW";
  const isMaximumHoursValid = (num) => num <= 144 && num > 0;
  const isAvailabilityTypeNotFuture = (str) => str !== "FUTURE_WITH_DATE";

  const offerLength = obj[asin].LowestPrice.length;

  for (let i = 0; i < offerLength; i++) {
    const conditionGroup1 =
      isShipFromJp(obj[asin].ShipsFromCountry[i]) &&
      isMaximumHoursBelow72(obj[asin].MaximumHours[i]) &&
      isAvailabilityTypeNow(obj[asin].AvailabilityType[i]);

    const conditionGroup2 =
      isShipFromJp(obj[asin].ShipsFromCountry[i]) &&
      isMaximumHoursValid(obj[asin].MaximumHours[i]) &&
      isAvailabilityTypeNotFuture(obj[asin].AvailabilityType[i]);

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

// const asin = "B00FF2PUTY";

//これは省きたい→ FUTURE with Dateを研究
// const obj2 = {
//   B07FBCM724: {
//     update: "2024-01-30T15:19:05+09:00",
//     Shipping: [0, ""],
//     LowestPrice: [6160, ""],
//     BuyBoxPrices: 6098,
//     TotalOfferCount: 1,
//     Condition: "new",
//     ShipsFromCountry: ["JP", ""],
//     AvailabilityType: ["FUTURE_WITH_DATE", ""],
//     MaximumHours: [24, ""],
//   },
// };

// const obj3 = {
//   B00I6QPR4E: {
//     update: "2024-01-30T15:29:29+09:00",
//     Shipping: [0, ""],
//     LowestPrice: [4730, ""],
//     BuyBoxPrices: 4683,
//     TotalOfferCount: 1,
//     Condition: "new",
//     ShipsFromCountry: ["JP", ""],
//     AvailabilityType: ["FUTURE_WITH_DATE", ""],
//     MaximumHours: [240, ""],
//   },
// };

// const obj4 = {
//   B00FF2PUTY: {
//     update: '2024-01-30T15:34:42+09:00',
//     Shipping: [ 0, '' ],
//     LowestPrice: [ 4070, '' ],
//     BuyBoxPrices: 4029,
//     TotalOfferCount: 1,
//     Condition: 'new',
//     ShipsFromCountry: [ 'JP', '' ],
//     AvailabilityType: [ 'NOW', '' ],
//     MaximumHours: [ 24, '' ]
//   }
// }

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
