const settingRouter = [
  {
    path: 'setting/order/audit',
    component: () => import('./order/audit/list.vue')
  }, {
    path: 'setting/stock/dispatch',
    component: () => import('./stock/dispatch/list.vue')
  }, {
    path: 'setting/stock/upload',
    component: () => import('./stock/upload/list.vue')
  }, {
    path: 'setting/order',
    component: () => import('./business/order.setting.vue')
  }, {
    path: 'setting/return',
    component: () => import('./business/return.setting.vue')
  }, {
    path: 'setting/stock',
    component: () => import('./business/stock.setting.vue')
  }, {
    path: 'setting/product',
    component: () => import('./business/product.setting.vue')
  }, {
    path: 'setting/iobill',
    component: () => import('./business/io.bill.setting.vue')
  }, {
    path: 'setting/express',
    component: () => import('./express/list.vue')
  }
];

export default settingRouter;