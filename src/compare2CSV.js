const fs = require('fs');
const CSV = require('comma-separated-values');
module.exports = compare2CSV;
// file name.
const orgFile = './test/data_original.csv';
const compFile = './test/data.csv';

compare2CSV(orgFile,compFile);

/**
 * 
 * @param {string} orgFileName 
 * @param {string} compFileName 
 */
function compare2CSV(orgFileName,compFileName){

  let orgCsv = fs.readFileSync(orgFileName, 'utf-8');
  let compCsv = fs.readFileSync(compFileName, 'utf-8');

  let orgArr = new CSV(orgCsv, {header: false}).parse();
  let compArr = new CSV(compCsv, {header: false}).parse();

  let resultDiff = "";

  for(let i = 0; i < orgArr.length; i++){
    for(let j = 0; j < compArr.length; j++){
      if(orgArr[i][j] !== compArr[i][j]){
        resultString += orgArr[i][j] + '\n';
      }
    }
  }
  if(resultDiff.length>0){
      fs.writeFile('resultDiff.csv', resultString, 'utf-8', function(err){
          if(err){
            console.log(err);
          } else {
            console.log('Please check resultDiff.csv for detail difference!');
          }
      });
      return false
  }else{
      console.log('The two CSV file are exact same.');
      return true
  }
}