const assert = require('assert');

const md2csv = require('../src');
const compare2CSV=require('../src/compare2CSV');

describe('csv', () => {
  describe('Same as Original CSV', () => {
    it('Converted and Same as Original', () => {
      md2csv('./test/data.md');
      assert.equal(true, compare2CSV('./test/data_original.csv','./test/data.csv'));
    });
    
  });
})