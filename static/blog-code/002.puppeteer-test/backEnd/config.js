const apiList = [
  {
    includeUrl: 'api.m.jd.com',
    excludeParams: ['t']
  },
  {
    includeUrl: 'bizgw.jd.com',
    excludeParams: ['callback']
  },
  {
    includeUrl: 'jxgw.jd.com',
    excludeParams: ['t']
  }
];

module.exports = {
  apiList,
};