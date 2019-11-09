'use strict';

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

module.exports = md2csv;
// Modified from https://github.com/Claude-Ray/md2xlsx

const { argv } = yargs
    .version()
    .usage(
        `Converts Markdown tables data to CSV file
(c) 2014-2019 by Rubyzhao, MIT License
Usage: md2csv mdfile`,
    )
    .example(
        `md2csv data.md
     Converts data.md to data.csv file`,
    )
    .help('h')
    .alias('h', 'help');

const lastArgument = process.argv.slice(-1)[0];

const inputFile = lastArgument.match(/\.md$/i) ? lastArgument : null;

md2csv(inputFile);

/**
 * Convert markdown table to xlsx file
 * @param {string} fpath - markdown filepath
 * @param {object} [opts={}]
 * @param {string} opts.basename - basename of csv file
 * @param {string} opts.extname - extname of csv file
 */

function md2csv(fpath, opts = {}) {
    const text = fs.readFileSync(fpath);
    const rowArray = toCSV(text);
    const extname = opts.extname || 'csv';
    const basename = opts.basename || path.basename(fpath, path.extname(fpath));
    const csvFileName = `${basename}.${extname}`;
    writeCSVFile(rowArray, csvFileName);
    console.log(`${fpath} was converted to ${csvFileName}`);
}
/**
 * Write rowArray to csvFileName
 * @param {array[]} rowArray
 * @param {string} csvFileName
 */

function writeCSVFile(rowArray, csvFileName) {
    const file = fs.createWriteStream(csvFileName);
    rowArray.forEach(row => {
        if (typeof row == 'object') {
            const line = row.map(str => str.trim()).join(',') + '\n';
            file.write(line);
        }
    });
    file.end();
}

/**
 * convert markdown table to object
 * @param {string|buffer} text
 * @return {array[]} rows
 */
function toCSV(text) {
    if (!text) throw new Error(`empty table`);
    if (Buffer.isBuffer(text)) text = text.toString();
    const rows = textParser(text);
    if (!isValidTable(rows)) throw new Error(`invalid table`);
    // splice the dividing line
    rows.splice(1, 1);
    return rows;
}

/**
 * check if the table is valid
 * @param {array[]} cells
 * @return {boolean}
 */
function isValidTable(cells) {
    return cells.length > 3 && cells[0] && cells[0].length === cells[1].length && /^-+$/.test(cells[1].join(''));
}

/**
 * parse markdown table to cells
 * @param {string} text
 * @return {array[]}
 */
function textParser(text) {
    return text.split('\n').map(line => {
        line = line.trim();
        if (!line) return '';
        if (!line.startsWith('|')) line = `|${line}`;
        if (!line.endsWith('|')) line = `${line}|`;

        return line.split('|').slice(1, -1);
    });
}
