const formatReportResponse = (reportResponse)=>{

    const tsvData = reportResponse/* ここにTSV形式のデータを入れます */
    const lines = tsvData.split('\n');
    const headers = lines[0].split('\t');

    const arrayData = lines.slice(1).map(line => {
    const values = line.split('\t');

    return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
        }, {});
      });

    //レポート系はデータを整形する必要あり。
    const cleanData = arrayData.map(item => {
        const cleanedItem = {};
        for (const key in item) {
            cleanedItem[key.replace(/"/g, '')] = item[key].replace(/"/g, '').replace(/\r/g, '');
        }
        return cleanedItem;
        });
  return cleanData
}

module.exports = {
  formatReportResponse
}


