const SellingPartnerAPI = require("amazon-sp-api");
const { getSearchCatalogItems } = require("./getSearchCatalogItems");
const stringSimilarity = require("string-similarity");
require("dotenv").config();


const getAsinsFromTitle = async (keywordArray) => {
  const resObj = await getSearchCatalogItems(keywordArray);
  const asinsObjArr = resObj.items;

  //タイトルだけの配列が必要 それと同じ並び順のASINのデータが必要:これはobj.asinでとればOK
  const targetString = keywordArray[0];
  const compareStrings = [];
  const asins = [];

  console.log('compare',compareStrings);

  for (obj of asinsObjArr) {
    compareStrings.push(obj.summaries[0].itemName);
    asins.push(obj.asin);
  }

  const bestMatch = stringSimilarity.findBestMatch(targetString, compareStrings);
  const sortedBestMatch = bestMatch.ratings.sort((a, b) => b.rating - a.rating);

  //トップ5のインデックスを取得

  const indexArr = [];

  for (let i = 0; i < 5; i++) {
    const selectedTitle = sortedBestMatch[i].target;
    const targetIndex = compareStrings.indexOf(selectedTitle);
    indexArr.push(targetIndex);
  }

  const asinsByMatchRank = indexArr.map((index) => asins[index]);
  const TitleByMatchRank = indexArr.map((index)=>compareStrings[index]);

  console.log("result is", asinsByMatchRank);
  console.log("strings check", TitleByMatchRank);

  return asinsByMatchRank;
};

module.exports = {
  getAsinsFromTitle,
};

// getSearchCatalogItems(["資生堂 ビューラー"]);
// getAsinsFromTtile(["遊戯王公式カードゲーム デュエルモンスターズ デュエリストカードプロテクター KC","ガシャポン HG ウルトラ怪獣バトル スペシャル 2. 古代怪獣ゴモラ 単品"]);
// getAsinsFromTitle(["遊戯王公式カードゲーム デュエルモンスターズ デュエリストカードプロテクター KC"]);
