/**
 * Returns a "require" function that loads a "promisified" version of a module
 * that uses callbacks instead of Promises.
 *
 * IMPORTANT:
 * 1. There is no magic way to determine whether a function uses a callback
 * mechanism or not. The code uses heuristic based on the signature of the
 * function. This works for main Node.js modules. It may well break a few
 * functions and modules, though.
 * 2. The code does not parse objects exported by modules recursively. Only
 * first level functions get promisified.
 *
 * Usage:
 * let promisifyRequire = require('promisify-require');
 * let fs = promisifyRequire('fs');
 * fs.readFile('test.json', 'utf8').then(data => {}).catch(err => {});
 *
 * Note the code was adapted from promisify-node:
 * https://github.com/nodegit/promisify-node
 * ... used under an MIT license
 *
 * The new code only deals with simple cases. The main advantage is that it
 * uses the Node.js "util.promisify" method that was added to Node.js in v8.
 *
 * @module promisify-require
 */

const promisify = require('util').promisify;

// The list of "callback" argument names that are commonly used in Node.js
// modules. The code will use that list to detect that a function has the right
// signature and needs to be promisified. This supposes that modules follow
// such conventions, and that is most likely going to break things in some
// cases. But, hey, it works on main Node.js modules, and exceptions to the
// rule can be added over time.
const callbacks = ['cb', 'callback', 'callback_', 'done'];

function args(func) {
  // First match everything inside the function argument parens.
  let args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
 
  // Split the arguments string into an array comma delimited.
  return args.split(', ').map(arg => {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(arg => !!args);
};

module.exports = moduleName => {
  let cbVersion = require(moduleName);
  let promiseVersion = {};
  Object.keys(cbVersion).map(name => {
    let fn = cbVersion[name];
    if ((typeof fn === 'function') &&
        (callbacks.indexOf(args(fn).slice(-1)[0]) > -1)) {
      return [name, promisify(fn)];
    }
    else {
      return [name, fn];
    }
  }).forEach(keyval => promiseVersion[keyval[0]] = keyval[1]);
  return promiseVersion;
};
