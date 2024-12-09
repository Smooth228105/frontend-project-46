import { parseData } from './parsers.js';
import format from './formatters/index.js';

const parseFile = (filepath) => {
  try {
    return parseData(filepath);
  } catch (error) {
    console.error(`Error parsing file ${filepath}: ${error.message}`);
    return null;
  }
};

const genDiff = (filepath1, filepath2, formatter) => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);

  if (data1 === null || data2 === null) {
    return null;
  }

  return format(data1, data2, formatter);
};

export default genDiff;
