const {readSpreadsheetValue} = require('./readSpreadsheetValue');


const checkIfUpdateNeeded = async(newLastRowData,spreadsheetId,range) =>{
  try{
        const sheetDataArr = await readSpreadsheetValue(spreadsheetId,range)
        const lastUpdatedData = sheetDataArr[sheetDataArr.length-1][0];

        return newLastRowData !== lastUpdatedData;
    }catch(err){
        console.error('Error fetching sheet data',err);
        return false;
    };
}

module.exports = {
    checkIfUpdateNeeded
}
