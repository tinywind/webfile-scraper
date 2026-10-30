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
    child.on('close', code => { clearTimeout(timer); resolve({code, output}); });
  });
}

test('scheduler retries a file that could not be saved', async t => {
  const temporary = path.join(project, '.tmp');
  fs.mkdirSync(temporary, {recursive: true});
  const root = fs.mkdtempSync(path.join(temporary, 'runtime-test-'));
  const directory = path.join(root, 'downloads');
  fs.mkdirSync(directory);
  const payload = Buffer.from('retry download bytes');
  let filename;
  let fileRequests = 0;
  const server = http.createServer((request, response) => {
    if (request.url === '/page') {
      response.end('<a href="/bad%00.zip">Download</a>');
    } else {
      fileRequests += 1;
      if (filename) response.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
      response.end(payload);
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, {recursive: true, force: true});
  });
  const base = 'http://127.0.0.1:' + server.address().port;
  const database = path.join(root, 'state.json');
  const config = path.join(root, 'config.json');
  fs.writeFileSync(config, JSON.stringify({interval: 0, runCount: 1, dbPath: database,
    downloadLocation: directory, webpageUrls: [{url: base + '/page',
      scrapingUrlPattern: '^' + base, filePattern: '\\.zip$', depth: 0}]}));

  const first = await run('scheduler.js', [config]);
  assert.equal(first.code, 0, first.output);
  assert.deepEqual(JSON.parse(fs.readFileSync(database)), [], 'a failed save must remain eligible for retry');
  assert.deepEqual(fs.readdirSync(directory), []);
  assert.equal(fileRequests, 1);

  filename = 'recovered.zip';
  const second = await run('scheduler.js', [config]);
  assert.equal(second.code, 0, second.output);
  assert.deepEqual(fs.readFileSync(path.join(directory, filename)), payload);
  assert.deepEqual(JSON.parse(fs.readFileSync(database)), [base + '/bad%00.zip']);
  assert.equal(fileRequests, 2);
});

test('CLI crawls nested pages without overwriting colliding filenames', async t => {
  const temporary = path.join(project, '.tmp');
  fs.mkdirSync(temporary, {recursive: true});
  const root = fs.mkdtempSync(path.join(temporary, 'crawl-test-'));
  const server = http.createServer((request, response) => {
    if (request.url === '/page') {
      response.end('<a href="/nested/one">One</a><a href="/nested/two">Two</a>');
    } else if (request.url.startsWith('/nested/')) {
      const file = request.url.endsWith('/one') ? 'one' : 'two';
      response.end('<a href="../' + file + '.zip">Download</a>');
    } else {
      response.setHeader('Content-Disposition', 'attachment; filename="report.zip"');
      response.end(request.url === '/one.zip' ? 'first download' : 'second download');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, {recursive: true, force: true});
  });
  const base = 'http://127.0.0.1:' + server.address().port;
  const directory = path.join(root, 'downloads');
  const result = await run('scrap.js', [base + '/page', '^' + base + '/nested/', '\\.zip$', directory, '1']);
  assert.equal(result.code, 0, result.output);
  assert.equal(fs.readFileSync(path.join(directory, 'report.zip'), 'utf8'), 'first download');
  assert.equal(fs.readFileSync(path.join(directory, 'report (1).zip'), 'utf8'), 'second download');
  assert.deepEqual(fs.readdirSync(directory).sort(), ['report (1).zip', 'report.zip']);
});

test('scheduler accepts JavaScript config and preserves state across restarts', async t => {
  const temporary = path.join(project, '.tmp');
  fs.mkdirSync(temporary, {recursive: true});
  const root = fs.mkdtempSync(path.join(temporary, 'restart-test-'));
  const directory = path.join(root, 'downloads');
  fs.mkdirSync(directory);
  let fileRequests = 0;
  const server = http.createServer((request, response) => {
    if (request.url === '/page') {
      response.end('<a href="/state.zip">Download</a>');
    } else {
      fileRequests += 1;
      response.end('persistent download');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, {recursive: true, force: true});
  });
  const base = 'http://127.0.0.1:' + server.address().port;
  const database = path.join(root, 'state.json');
  const config = path.join(root, 'config.js');
  const options = {interval: 0, runCount: 1, dbPath: database, downloadLocation: directory,
    webpageUrls: [{url: base + '/page', scrapingUrlPattern: '^' + base, filePattern: '\\.zip$', depth: 0}]};
  fs.writeFileSync(config, 'module.exports = ' + JSON.stringify(options) + ';');
  for (let execution = 0; execution < 2; execution++) {
    const result = await run('scheduler.js', [config]);
    assert.equal(result.code, 0, result.output);
    assert.deepEqual(JSON.parse(fs.readFileSync(database)), [base + '/state.zip']);
    assert.equal(fileRequests, 1);
  }
  assert.equal(fs.readFileSync(path.join(directory, 'state.zip'), 'utf8'), 'persistent download');
  assert.deepEqual(fs.readdirSync(directory), ['state.zip']);
});
