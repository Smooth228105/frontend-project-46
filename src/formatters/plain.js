import _ from 'lodash';
import { mergeDiffKeys } from '../utils.js';

const complexValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  return typeof value === 'string' ? `'${value}'` : `${value}`;
};

const plain = (diff, path = '') => {
  const keys = mergeDiffKeys(diff);
  return keys.reduce((result, key) => {
    const currentPath = `${path}${path ? '.' : ''}${key}`;

    if (Object.prototype.hasOwnProperty.call(diff.added, key)
       && Object.prototype.hasOwnProperty.call(diff.removed, key)) {
      return `${result}Property '${currentPath}' was updated. From ${complexValue(diff.removed[key])} to ${complexValue(diff.added[key])}\n`;
    }

    if (_.isObject(diff.common[key])) {
      return result + plain(diff.common[key], currentPath);
    }

    if (Object.prototype.hasOwnProperty.call(diff.removed, key)) {
      return `${result}Property '${currentPath}' was removed\n`;
    }

    if (Object.prototype.hasOwnProperty.call(diff.added, key)) {
      return `${result}Property '${currentPath}' was added with value: ${complexValue(diff.added[key])}\n`;
    }

    return result;
  }, '');
};

export default { plain };
