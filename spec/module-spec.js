const promisifyRequire = require('../');

describe('Node.js modules', function () {
  it('promisifies a Node-callback function', async function () {
    let fs = promisifyRequire('fs');
    let data = await fs.readFile(__dirname + '/../LICENSE', 'utf8');
    expect(data).toContain('The MIT License');
  });

  it('does not promisify a sync function', async function () {
    let fs = promisifyRequire('fs');
    let data = fs.readFileSync(__dirname + '/../LICENSE', 'utf8');
    expect(data).toContain('The MIT License');
  });
});