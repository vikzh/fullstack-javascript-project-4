import axios from 'axios';
import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';

let bodyResponse;

const getPageData = (url) =>
  axios.get(url)
    .then((response) =>
      response.data);

const writeDataToFile = (data, name = 'index.html') => {
  fs.writeFile(name === 'index.html' ? `./${name}` : `./_files/${name}`, data);
}

const saveSource = (url, fileName, dir) => {
  axios.get(url, {responseType: "arraybuffer"})
    .then(response => {
      return writeDataToFile(response.data, fileName);
    });
}

const saveImages = (data, url) => {
  const $ = cheerio.load(data);
  const imgTags = $('img');
  for(const imgTag of imgTags) {
    const regexp = /([^\/]+$)/g;
    const [[fileName]] = [...imgTag.attribs.src.matchAll(regexp)];

    saveSource(new URL(imgTag.attribs.src, (new URL(url)).origin), fileName)
    imgTag.attribs.src = `./_files/${fileName}`;
  }

  return $.html();
}

const saveLinks = (data, url) => {
  const $ = cheerio.load(data);
  const linkTags = $('link');
  for (const link of linkTags) {
    const regexp = /([^\/]+$)/g;
    const [[fileName]] = [...imgTag.attribs.src.matchAll(regexp)];

    saveSource(URL(imgTag.attribs.src), fileName)
    imgTag.attribs.src = `./_files/${fileName}`;
  }
}

const savePage = (url) =>
  getPageData(url)
    .then(data => {
      fs.mkdir('./_files', {recursive: true});

      return data;
    })
    .then(data => saveImages(data, url))
    .then(data => writeDataToFile(data))

export default savePage;
