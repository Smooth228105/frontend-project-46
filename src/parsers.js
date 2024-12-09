import * as fs from 'node:fs';
import yaml from 'js-yaml';
import * as path from 'node:path';

const readFile = (pathToFile) => fs.readFileSync(pathToFile, 'utf-8');

const parseJSONData = (data) => JSON.parse(data);
const parseYAMLData = (data) => yaml.load(data);

const getParser = (extension) => {
  switch (extension.toLowerCase()) {
    case '.json':
      return parseJSONData;
    case '.yml':
    case '.yaml':
      return parseYAMLData;
    default:
      throw new Error(`Unsupported file format: ${extension}`);
  }
};

export const parseData = (pathToFile) => {
  const absPath = path.resolve(pathToFile);
  const fileExtension = path.extname(absPath);
  const data = readFile(absPath);

  const parse = getParser(fileExtension);
  return parse(data);
};