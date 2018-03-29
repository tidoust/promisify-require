# promisify-require

Node.js module that exports a `require` function that can be used to load a "promisified" version of Node.js modules that export asynchronous functions using a Node-callback convention (callback function as last parameter with error passed as first parameter to the callback).

Part of the code is based on [promisify-node](https://github.com/nodegit/promisify-node#promisify-node), licensed under an MIT License. The main differences are:

1. This code makes use of the [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original) function that now ships with Node.js since v8.0.0.
2. This code can only run on module names and can only deal with simple cases (no recursion, no advanced logic)

## Installation

Run `npm install promisify-require`

## Usage

```js
const promisifyRequire = require('promisify-require');
const fs = promisifyRequire('fs');

async function run() {
  let data = await fs.readFile('./LICENSE', 'utf8');
  console.log(data);
}

run().then(_ => console.log('The end'));
```

## Important notes

1. There is no magic way to determine whether a function uses a callback mechanism or not. The code uses heuristics based on the signature of the function. This works for main Node.js modules. It may well break a few functions and modules, though.
2. The code does not parse objects exported by modules recursively. Only first level functions get promisified.

## Licensing

The code is available under an [MIT license](LICENSE).
