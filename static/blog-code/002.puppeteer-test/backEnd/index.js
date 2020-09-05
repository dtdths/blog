const Koa = require('koa');
const path = require('path');
const Router = require('koa-router')
const static = require('koa-static');
const body = require('koa-bodyparser');
const cors = require('koa2-cors');

const { launch, abortApi } = require('./puppeteer');

const app = new Koa();
const router = new Router()
// 静态目录

// router.get('/', (ctx, next) => {
//   // ctx.router available
//   ctx.response.type = 'html';
//   ctx.response.body = fs.createReadStream('./demos/template.html');
// });
router.post('/api/getAllApiByUrl', async (ctx) => {
  const { pageUrl, cookie } = ctx.request.body;
  let result = {
    code: 0,
    data: {},
    error: 'url 为空',
  };
  if (pageUrl) {
    try {
      // 启动puppeteer
      const { apiRequestList: apiList, pageImg } = await launch(pageUrl, cookie);
      result = {
        code: 200,
        data: {
          apiList,
          pageImg: pageImg.split('/static/')[1]
        },

      }
    } catch (e) {
      result = {
        code: 0,
        data: {},
        error: `${e}`,
      };
    }
  }
  ctx.body = result;
});

router.post('/api/getApiErrorScreenshot', async (ctx) => {
  const { pageUrl, apiUrl, cookie } = ctx.request.body;
  let result = {
    code: 0,
    data: {},
    error: 'url 为空',
  };
  if (pageUrl && apiUrl) {
    try {
      // 启动puppeteer
      const errorImg = await abortApi(pageUrl, apiUrl, cookie);
      result = {
        code: 200,
        data: {
          pageUrl,
          apiUrl,
          errorImg: errorImg.split('/static/')[1],
        },

      }
    } catch (e) {
      result = {
        code: 0,
        data: {},
        error: `${e}`,
      };
    }
  }
  ctx.body = result;
})

app
  .use(static(path.join(__dirname, './static')))
  .use(body())
  .use(cors({
    origin: '*'
  }))
  .use(router.routes());

app.listen(10086, () => {
  console.log('done')
});
