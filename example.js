/**
 * Usage example.
 *
 * Run with `node example.js`. This should output the contents of the LICENSE
 * file to the console, followed by a "The end" message.
 */
const promisifyRequire = require('./');
const fs = promisifyRequire('fs');

async function run() {
  let data = await fs.readFile('./LICENSE', 'utf8');
  console.log(data);
}

run().then(_ => console.log('-- The end --'));