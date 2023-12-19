
const checkStringIncludes = (targetStr, str1, str2) => {
  return !targetStr.includes(str1) && !targetStr.includes(str2);
};

module.exports = {
  checkStringIncludes
}
