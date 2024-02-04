import savePage from '../index.js'
import nock from 'nock';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (name) => path.join(__dirname, '..','__tests__', '__fixtures__', name);

const websiteHtmlFile = 'without_sources.html';
const websiteHtmlSavedFile = 'without_sources_expected.html'

const bodyResponse = await fs.readFile(getFixturePath(websiteHtmlFile), 'utf-8');
const expected = await fs.readFile(getFixturePath(websiteHtmlSavedFile), 'utf-8');


test('works with async/await', async () => {
  nock('http://test.com')
    .get('/')
    .reply(200, bodyResponse);
  await savePage('http://test.com');
  const data = await fs.readFile('./index.html');

  expect(data.toString().replaceAll(' ','').replaceAll('\n', '')).toBe(expected.replaceAll(' ','').replaceAll('\n', ''));
});