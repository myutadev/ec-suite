const stringSimilarity = require("string-similarity");
require("dotenv").config();

const getMatch = async (targetString, compareStrings) => {
  const bestMatch = stringSimilarity.findBestMatch(targetString, compareStrings);
  const sortedBestMatch = bestMatch.ratings.sort((a, b) => b.rating - a.rating);
  console.log(sortedBestMatch);
  return sortedBestMatch;
};

module.exports = {
  getMatch,
};

// getBestMatch(
//   "資生堂 ビューラー",
//   [
//     "SHISEIDO(資生堂) 資生堂 アイラッシュカーラー 213+資生堂 アイラッシュカーラー 替えゴム 本体 + 替えゴム付き 単品 1個 (x 1)",
//     "資生堂 アイラッシュカーラー 213 (ビューラー) [並行輸入品]",
//     "資生堂 ミニアイラッシュカーラー 215 1個 (x 1)",
//     "資生堂アイラッシュカーラー213本体1個＋替えゴム3個",
//     "２個セット　資生堂　アイラッシュカーラー213",
//     "shu uemura(シュウ ウエムラ) S カーラー",
//     "資生堂 アイラッシュカーラー 213 1個 (x 1)",
//     "ミニアイラッシュカーラー",
//     "資生堂 まつげカーラー ソートゴム レギュラーサイズリフィル(214) 3本入 計6本入 (日本製)",
//     "ビューラー 日本製 替えゴム 1本付 アイラッシュカーラー",
//     "excel(エクセル) スプリングパワーカーラー ビューラー",
//     "ビューティ ワールド 3Dフィットアップカーラー【FUC682】",
//     "マキアージュ エッジフリー アイラッシュカーラー しっかりカール",
//     "[DeeBrain] アイラッシュカーラー ビューラー まつ毛ビューラー (替えゴム3個付き)ｘ山形ｘまつ毛を根元からキャッチ (ピンクゴールド, 替えゴム3個)",
//     "ANNA SUI(アナ スイ) アイラッシュ カーラー N",
//     "資生堂 アイラッシュカーラー替えゴム 214 (2コ入) (2コ入2袋) 1個 (x 1)",
//     "資生堂 ミニまつ毛カーラー 215",
//     "資生堂 アイラッシュカーラー替えゴム 214 (2コ入3袋)",
//     "ORBIS(オルビス) アイラッシュカーラー◎ビューラー◎ 1個 (x 1)",
//     "アイプチ(Eyeputti) ひとえ・奥ぶたえ用カーラー(替えゴム2個付き)",
//   ]
// );
