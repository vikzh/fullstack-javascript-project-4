import axios from 'axios';
import fs from 'node:fs/promises';

const getPageData = (url) =>
  axios.get(url)
    .then((response) =>
      response.data);

const writeDataToFile = (data) => {
  fs.writeFile('index.html', data);
}

const savePage = (url) =>
  getPageData(url)
    .then(writeDataToFile)

export default savePage;
