const getStartOfYesterday = () => {
  let now = new Date();
  let jstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // JSTに変換
  jstTime.setDate(jstTime.getDate() - 1); // 昨日の日付に設定
  let startOfYesterday = jstTime.toISOString().split('T')[0] + "T00:00:00";
  console.log('Start of Yesterday is', startOfYesterday);
  return startOfYesterday; // 例: 2022-01-01T00:00:00
};

const getEndOfYesterday =() => {
  let now = new Date();
  let jstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // JSTに変換
  jstTime.setDate(jstTime.getDate() - 1); // 昨日の日付に設定
  let endOfYesterday = jstTime.toISOString().split('T')[0] + "T23:59:59";
  return `${endOfYesterday}`; //  2022-01-01T00:00:00-07:00
};

const getInterval = (startOfYesterday) => {
  let end = getEndOfYesterday(startOfYesterday);
  return `${startOfYesterday}--${end}`;
};


console.log(getStartOfYesterday())
console.log(getEndOfYesterday())

module.exports = {
  getStartOfYesterday,
  getEndOfYesterday,
  getInterval
};

