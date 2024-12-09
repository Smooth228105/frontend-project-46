import _ from 'lodash';

export const indent = (it, left = 0, i = 4) => {
  const repeats = Math.max(it * i - left, 0);
  return ' '.repeat(repeats);
};

export const mergeKeys = (keys1, keys2) => {
  const merged = _.union(keys1, keys2);
  return _.sortBy(merged);
};

export const mergeDiffKeys = (diff) => {
  const merged = _.union(
    Object.keys(diff.added),
    Object.keys(diff.removed),
    Object.keys(diff.common)
  );
  return _.sortBy(merged);
};

const createDiffEntry = (diff, key, type, value1, value2) => {
  if (type === 'added') {
    return {
      ...diff,
      added: { ...diff.added, [key]: value2 },
    };
  }
  if (type === 'removed') {
    return {
      ...diff,
      removed: { ...diff.removed, [key]: value1 },
    };
  }
  if (type === 'common') {
    return {
      ...diff,
      common: { ...diff.common, [key]: value1 },
    };
  }
  if (type === 'updated') {
    return {
      ...diff,
      added: { ...diff.added, [key]: value2 },
      removed: { ...diff.removed, [key]: value1 },
    };
  }
  return diff;
};

export const createDiff = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const mergedKeys = mergeKeys(keys1, keys2);

  return mergedKeys.reduce((diff, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (keys1.includes(key) && keys2.includes(key)) {
      if (_.isObject(value1) && _.isObject(value2)) {
        return {
          ...diff,
          common: {
            ...diff.common,
            [key]: createDiff(value1, value2),
          },
        };
      }
      if (value1 === value2) {
        return createDiffEntry(diff, key, 'common', value1, value2);
      }
      return createDiffEntry(diff, key, 'updated', value1, value2);
    }

    if (keys1.includes(key)) {
      return createDiffEntry(diff, key, 'removed', value1, value2);
    }

    return createDiffEntry(diff, key, 'added', value1, value2);
  }, { added: {}, removed: {}, common: {} });
};