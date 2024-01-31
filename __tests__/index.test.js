import savePage from '../index.js'
import nock from 'nock';
import * as fs from 'node:fs/promises';
import { readFileSync, readFile } from 'node:fs';


const expected = `<!DOCTYPE html>
<html>
<body>

<h1>My test Heading</h1>
<p>My test paragraph.</p>

</body>
</html>`;

test('works with async/await', async () => {
  console.log('file test',(readFileSync('./index.html')).toString());
  nock('http://test.com')
    .get('/')
    .reply(200, expected);
  await savePage('http://test.com');
  const data = await fs.readFile('./index.html');
  expect(data.toString()).toBe(expected);
});