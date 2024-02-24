const axios = require("axios");
require("dotenv").config();

const getTranslatedText = async (target) => {
  const postData = new URLSearchParams({
    text: target,
    target_lang: "JA",
    // source_lang: "KO",
  });

  const config = {
    method: "post",
    url: "https://api-free.deepl.com/v2/translate",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: postData,
  };

  const response = await axios(config);

  // console.log(response.data);
  return response.data.translations;
};

module.exports = {
  getTranslatedText,
};

// getTranslatedText("유희왕 공식 카드 게임 듀얼 몬스터즈 듀얼리스트 카드 프로텍터 KC, 상세페이지 참조");

// メモ
// BG - Bulgarian
// CS - Czech
// DA - Danish
// DE - German
// EL - Greek
// EN - English
// ES - Spanish
// ET - Estonian
// FI - Finnish
// FR - French
// HU - Hungarian
// ID - Indonesian
// IT - Italian
// JA - Japanese
// KO - Korean
// LT - Lithuanian
// LV - Latvian
// NB - Norwegian (Bokmål)
// NL - Dutch
// PL - Polish
// PT - Portuguese (all Portuguese varieties mixed)
// RO - Romanian
// RU - Russian
// SK - Slovak
// SL - Slovenian
// SV - Swedish
// TR - Turkish
// UK - Ukrainian
// ZH - Chinese
