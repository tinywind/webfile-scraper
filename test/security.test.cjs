const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {spawn} = require('node:child_process');

const project = path.resolve(__dirname, '..');

function run(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(project, script), ...args], {cwd: project});
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    const timer = setTimeout(() => { child.kill(); reject(new Error(output || 'CLI timed out')); }, 10000);
    child.on('error', reject);
    child.on('close', code => { clearTimeout(timer); code === 0 ? resolve(output) : reject(new Error(output)); });
  });
}

test('scraper CLI and scheduler preserve safe download paths', async t => {
  const temporary = path.join(project, '.tmp');
  fs.mkdirSync(temporary, {recursive: true});
  const root = fs.mkdtempSync(path.join(temporary, 'security-test-'));
  const payload = Buffer.from('downloaded fixture bytes');
  let fileRequests = 0;
  let link = '/file.zip';
  let disposition = 'attachment; filename="report.zip"';
  const server = http.createServer((request, response) => {
    if (request.url === '/page') {
      response.setHeader('Content-Type', 'text/html');
      response.end(`<a href="${link}">Download</a>`);
    } else {
      fileRequests += 1;
      if (disposition) response.setHeader('Content-Disposition', disposition);
      response.end(payload);
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, {recursive: true, force: true});
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const download = async directory => {
    fs.mkdirSync(directory, {recursive: true});
    await run('scrap.js', [base + '/page', '^' + base, '\\.zip$', directory, '0']);
  };

  await t.test('downloads the real HTTP response through the public CLI', async () => {
    const directory = path.join(root, 'cli');
    await download(directory);
    assert.deepEqual(fs.readFileSync(path.join(directory, 'report.zip')), payload);
    assert.equal(fileRequests, 1);
  });

  await t.test('scheduler persists URLs and avoids repeated file downloads', async () => {
    const directory = path.join(root, 'scheduler');
    fs.mkdirSync(directory);
    const database = path.join(root, 'downloads.json');
    const config = path.join(root, 'config.json');
    fs.writeFileSync(config, JSON.stringify({interval: 0, runCount: 2, dbPath: database,
      downloadLocation: directory, webpageUrls: [{url: base + '/page', scrapingUrlPattern: '^' + base,
        filePattern: '\\.zip$', depth: 0}]}));
    await run('scheduler.js', [config]);
    assert.deepEqual(fs.readFileSync(path.join(directory, 'report.zip')), payload);
    assert.deepEqual(JSON.parse(fs.readFileSync(database)), [base + '/file.zip']);
    assert.equal(fileRequests, 2);
  });

  for (const [name, remoteLink, header, filename] of [
    ['parent path in response header', '/file.zip', 'attachment; filename="../escaped.zip"', 'escaped.zip'],
    ['Windows path in response header', '/file.zip', 'attachment; filename="..\\escaped-windows.zip"', 'escaped-windows.zip'],
    ['encoded path in URL', '/%2e%2e%2fencoded.zip', null, 'encoded.zip'],
  ]) {
    await t.test(name, async () => {
      link = remoteLink;
      disposition = header;
      const directory = path.join(root, filename + '-downloads');
      await download(directory);
      assert.equal(fs.existsSync(path.join(root, filename)), false, 'download escaped its destination');
      assert.deepEqual(fs.readFileSync(path.join(directory, filename)), payload);
    });
  }
});
