const logRoot = 'log/';
const logRouter = [
  {
    path: 'log/login',
    component: () => import('./login.log.vue')
  }, {
    path: 'log/system',
    component: () => import('./system.log.vue')
  }, {
    path: 'log/action',
    component: () => import('./action.log.vue')
  }, {
    path: 'log/mall',
    component: () => import('./mall.log.vue')
  }, {
    path: 'log/wms',
    component: () => import('./wms.log.vue')
  }, {
    path: 'log/translate/order',
    component: () => import('./translate.order.log.vue')
  }, {
    path: 'log/translate/refund',
    component: () => import('./translate.refund.log.vue')
  }, {
    path: 'log/translate/exchange',
    component: () => import('./translate.exchange.log.vue')
  }, {
    path: 'log/dispatch',
    component: () => import('./dispatch.log.vue')
  }];

export default logRouter;