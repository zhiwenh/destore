const program = require('commander');

program
  .version('0.0.1')
  .option('--init', 'Initialize')
  .option('--push', 'Push File to IPFS')
  .parse(process.argv);

if (program.init) {
  console.log('Initialize');
}

if (program.push) {
  console.log('push');
}
