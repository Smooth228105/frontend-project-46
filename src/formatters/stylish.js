import _ from 'lodash';
import { mergeDiffKeys, indent } from '../utils.js';

export const printDiff = (key, value, sign, it) => {
  if (_.isObject(value)) {
    return `${indent(it, 2)}${sign} ${key}: {\n${
      Object.keys(value)
        .map((key1) => `${_.isObject(value[key1]) ? printDiff(key1, value[key1], ' ', it + 1) : `${indent(it + 1, 2)}  ${key1}: ${value[key1]}`}`)
        .join('')
    }\n${indent(it)}}`;
  }
  return `${indent(it, 2)}${sign} ${key}: ${value}`;
};

export const isDiffObject = (obj) => {
  const keys = Object.keys(obj);
  return keys.length === 3 && keys.includes('added') && keys.includes('removed') && keys.includes('common');
};

export const printObjDeep = (obj, it = 0) => Object.keys(obj).map((key) => (_.isObject(obj[key])
  ? `${indent(it)}${key}: {\n${printObjDeep(obj[key], it + 1)}${indent(it)}}\n`
  : `${indent(it)}${key}: ${obj[key]}\n`)).join('');

const printIfObject = (obj, key, sign, it) => (_.isObject(obj[key])
  ? `${indent(it, 2)}${sign} ${key}: {\n${printObjDeep(obj[key], it + 1)}${indent(it)}}`
  : printDiff(key, obj[key], sign, it));

export const stylish = (diff, it = 1) => {
  const formatDiff = (key) => {
    if (Object.keys(diff.common).includes(key)) {
      return _.isObject(diff.common[key])
        ? `${printDiff(key, '{', ' ', it)}\n${stylish(diff.common[key], it + 1)}${indent(it)}}\n`
        : `${printDiff(key, diff.common[key], ' ', it)}\n`;
    }
    return '';
  };

  return mergeDiffKeys(diff).reduce((accumulator, key) => (
    accumulator
      + formatDiff(key)
      + (Object.keys(diff.removed).includes(key) ? `${printIfObject(diff.removed, key, '-', it)}\n` : '')
      + (Object.keys(diff.added).includes(key) ? `${printIfObject(diff.added, key, '+', it)}\n` : '')
  ), it === 1 ? '{\n' : '') + (it === 1 ? '}' : '');
};
