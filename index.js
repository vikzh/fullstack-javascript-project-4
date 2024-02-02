import axios from 'axios';
import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
const getPageData = (url) =>
  axios.get(url)
    .then((response) =>
      response.data);

const writeDataToFile = (data, name = 'index.html') => {
  fs.writeFile(`./_files/${name}`, data);
}

const saveSource = (url, fileName, dir) => {
  axios.get(url, {responseType: "arraybuffer"})
    .then(response => {
      return writeDataToFile(response.data, fileName);
    });
}

const saveImages = (data) => {
  const $ = cheerio.load(data);
  const imgTags = $('img');
  for(const imgTag of imgTags) {
    const regexp = /([^\/]+$)/g;
    const [[fileName]] = [...imgTag.attribs.src.matchAll(regexp)];

    saveSource(imgTag.attribs.src, fileName)
    imgTag.attribs.src = `./_files/${fileName}`;
  }

  console.log(imgTags);
  return data;
}
const savePage = (url) =>
  getPageData(url)
    .then(data => {
      fs.mkdir('./_files', {recursive: true});

      return data;
    })
    .then(saveImages)
    .then(writeDataToFile)

export default savePage;
