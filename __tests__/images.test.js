import savePage from '../index.js'
import nock from 'nock';
import * as fs from 'node:fs/promises';
import { readFileSync, readFile } from 'node:fs';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (name) => path.join(__dirname, '..','__tests__', '__fixtures__', name);

const websiteHtmlFile = 'images.html';
const websiteHtmlSavedFile = 'images_expected.html'
const imageFileName = 'mozila-logo.png'

const bodyResponse = await fs.readFile(getFixturePath(websiteHtmlFile), 'utf-8');
const expected = await fs.readFile(getFixturePath(websiteHtmlSavedFile), 'utf-8');

test('works with async/await', async () => {
  nock('http://test.com')
    .get('/')
    .reply(200, bodyResponse);

  const pngImage = await fs.readFile(getFixturePath(imageFileName));
  nock('http://test.com')
    .get('/imagename.png')
    .reply(200, pngImage, { 'Content-Type': 'image/png' });

  await savePage('http://test.com');
  const data = await fs.readFile('./index.html');

  expect(data.toString().replaceAll(' ','').replaceAll('\n', '')).toBe(expected.replaceAll(' ','').replaceAll('\n', ''));
});