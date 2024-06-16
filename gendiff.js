#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .version('0.1.0') 
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, options) => {
    const diff = genDiff(filepath1, filepath2);
    console.log(diff);
  })
  .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }