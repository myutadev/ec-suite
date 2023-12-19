const getTodayWithTime = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // 月は0から始まるため、+1しています
  const dd = String(today.getDate()).padStart(2, "0");
  const hh = String(today.getHours()).padStart(2, "0"); // 時間を取得
  const min = String(today.getMinutes()).padStart(2, "0"); // 分を取得
  const ss = String(today.getSeconds()).padStart(2, "0"); // 秒を取得

  const formattedDate = `${yyyy}/${mm}/${dd}`;
  const formattedTime = `${hh}:${min}:${ss}`;

  return `${formattedDate} ${formattedTime}`; // 日付と時間を結合
};

module.exports = {
  getTodayWithTime,
};
