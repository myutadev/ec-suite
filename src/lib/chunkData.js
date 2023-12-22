const chunkData = (arr, num) => {
  const chunkedAsins = [];
  for (i = 0; i < arr.length; i += num) {
    chunkedAsins.push(arr.slice(i, i + num));
  }
  return chunkedAsins;
};

module.exports = {
  chunkData,
};
