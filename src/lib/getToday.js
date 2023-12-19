const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // 月は0から始まるため、+1しています
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  return `${formattedDate}`; // 日付と時間を結合
};

module.exports = {
  getToday,
};
