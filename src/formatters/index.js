import { stylish } from './stylish.js';
import { plain } from './plain.js';
import json from './json.js';
import { createDiff } from '../utils.js';

const format = (data1, data2, formatter) => {
  const diff = createDiff(data1, data2);

  if (formatter === 'json') {
    return json(diff);
  }

  if (formatter === 'plain') {
    return plain(diff).trim();
  }

  return stylish(diff);
};

export default format;
