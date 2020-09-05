const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors')
const iPhone6 = devices.devicesMap['iPhone 6'];
const { screenshot } = require('./utils');
const path = require('path');

console.log(devices);

(async () => {

  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage()

  await page.emulate(iPhone6)

  await page.goto('http://www.baidu.com')

  await page.type('#index-kw', 'puppeteer')

  await page.waitForSelector('#index-bn', {visible: true})

  await Promise.all([
    page.click('#index-bn'),
    page.waitForNavigation({ timeout: 3000 })
  ])

  await screenshot(page, path.join('static/screenshot', 'baidu.png'));
})()
