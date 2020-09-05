const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * 过滤指定参数
 * @param {*} url 
 * @param {*} excludeParams 
 */
const filterParams = (url, excludeParams = []) => {
  const {
    origin,
    pathname,
    searchParams,
  } = new URL(url);

  excludeParams.forEach(delParams => searchParams.delete(delParams));

  return `${origin}${pathname}?${searchParams.toString()}`;
}

// 递归创建目录 异步方法  
const _mkdirs = (dirname, callback) => {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback();
    } else {
      _mkdirs(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
      });
    }
  });
};

const mkdir = (dirname) => new Promise((resolve) => {
  _mkdirs(dirname, resolve);
});

/**
 * 截图
 * @page {*} page 页面
 * @param {*} name 图片路径
 */
const screenshot = async (page, name) => {
  const imgUrl = path.join(__dirname, `${name}`)
  await mkdir(path.dirname(imgUrl));
  await page.screenshot({
    path: imgUrl,
    fullPage: true,
  });
  return imgUrl;
}

const setCookies = async (page, cookies = '') => {
  if (!cookies) return true;
  const _cookies = {};
  cookies.split(';').forEach(item => {
    const [name, ...value] = item.split('=');
    _cookies[name.trim()] = value.join('=').trim();
  });
  const list = Object.keys(_cookies).map(name => ({ 
    name,
    value: _cookies[name],
    domain: '.jd.com'
  }));
  return await page.setCookie(...list);
}

module.exports = {
  screenshot,
  filterParams,
  mkdir,
  setCookies,
}
