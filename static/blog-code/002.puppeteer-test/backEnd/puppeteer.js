const puppeteer = require('puppeteer');
const path = require('path');
const { screenshot, filterParams, setCookies } = require('./utils');
const { apiList } = require('./config');
const uuid = require('node-uuid');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone6 = devices.devicesMap['iPhone 6'];

const createBrowser = ((option = {}) => {
  let browser

  return async () => {
    if (browser) {
      return browser
    } else {
      console.log('created------------')
      browser = await (puppeteer.launch({
        ...{
          //如果是访问https页面 此属性会忽略https错误
          ignoreHTTPSErrors: true,
          // 关闭headless模式, 不会打开浏览器
          headless: true,
          defaultViewport: {
            width: 750,
            height: 1334,
            isMobile: true,
          }
        },
        ...option
      }));
    }
    return browser
  };
})()

const launch = async (pageUrl, cookie) => {
  const apiRequestList = [];
  const browser = await createBrowser();
  try {
    const page = await browser.newPage();
    // await page.emulate(iPhone6);
    if (cookie) {
      await setCookies(page, cookie);
    }
    await page.setRequestInterception(true);
    page.on('request', async (interceptedRequest) => {
      const currentRequestUrl = interceptedRequest.url();
      const apiRequest = apiList.find(item => currentRequestUrl.includes(item.includeUrl));
      if (apiRequest) {
        const _url = filterParams(currentRequestUrl, apiRequest.excludeParams);
        apiRequestList.push({
          apiUrl: _url,
          pageUrl,
          method: interceptedRequest.method(),
          timeStart: Date.now(),
          timeEnd: Date.now(),
        });
      }
      interceptedRequest.continue();
    })
      .on('requestfinished', (interceptedRequest) => {
        const currentRequestUrl = interceptedRequest.url();
        const apiRequest = apiList.find(item => currentRequestUrl.includes(item.includeUrl));
        if (apiRequest) {
          const _url = filterParams(currentRequestUrl, apiRequest.excludeParams);
          const _apiItem = apiRequestList.find(item => item.apiUrl === _url);
          if (_apiItem) {
            _apiItem.timeEnd = Date.now();
          }
        }
      })
      .on('load', () => {
        console.log('--------------');
        console.log(apiRequestList);
        console.log('--------------');
      });

    await page.goto(pageUrl);
    // 延迟1s
    await page.waitFor(1000);
    const pageImg = await screenshot(page,
      // path.join('static/screenshot', encodeURIComponent(pageUrl), `${encodeURIComponent(apiUrl)}.png`)
      path.join('static/screenshot', `${uuid.v1()}.png`)
    );
    page.close();
    return {apiRequestList, pageImg};
  } catch (e) {
    console.log(e);
    page.close();
    throw e;
  }
}


const abortApi = async (pageUrl, apiUrl, cookie) => {
  // const browser = await (puppeteer.launch({
  //   //如果是访问https页面 此属性会忽略https错误
  //   ignoreHTTPSErrors: true,
  //   // 关闭headless模式, 不会打开浏览器
  //   headless: true,
  //   defaultViewport: {
  //     width: 750,
  //     height: 1334,
  //     isMobile: true,
  //   }
  // }));
  const browser = await createBrowser();
  try {
    const page = await browser.newPage();
    if (cookie) {
      await setCookies(page, cookie);
    }
    await page.setRequestInterception(true);
    page.on('request', async (interceptedRequest) => {
      const currentRequestUrl = interceptedRequest.url();
      const apiRequest = apiList.find(item => currentRequestUrl.includes(item.includeUrl));
      if (apiRequest) {
        const _url = filterParams(currentRequestUrl, apiRequest.excludeParams);
        if (apiUrl === _url) {
          interceptedRequest.abort();
          return;
        }
      }
      interceptedRequest.continue();
    })
      .on('requestfailed', (interceptedRequest) => {
        const currentRequestUrl = interceptedRequest.url();
        console.log('1-------------');
        console.log(currentRequestUrl);
        console.log('1-------------');
      });

    await page.goto(pageUrl);
    const apiErrorImg = await screenshot(page,
      // path.join('static/screenshot', encodeURIComponent(pageUrl), `${encodeURIComponent(apiUrl)}.png`)
      path.join('static/screenshot', `${uuid.v1()}.png`)
    );
    page.close();
    return apiErrorImg;
  } catch (e) {
    console.log(e);
    page.close();
    throw e;
  }
}

module.exports = {
  launch,
  abortApi,
};
