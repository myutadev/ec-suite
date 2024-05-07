const assemblePricingQueryParams = (asinArr) => {
  const requestArr = asinArr.map((asin) => {
    return {
      uri: `/products/pricing/v0/items/${asin}/offers`,
      method: "GET",
      MarketplaceId: "A1VC38T7YXB528",
      ItemCondition: "New",
      CustomerType: "Consumer",
    };
  });

  return requestArr;
};

module.exports = {
  assemblePricingQueryParams,
};

// assemblePricingQueryParams(["B000OQA3N4", "B00601CABA"]);
