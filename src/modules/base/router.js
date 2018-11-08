import Layout from '@/modules/navigation/layout';

import settingRouter from './setting/router';
import smsRouter from './sms/router';
import logRouter from './log/router';

const baseRouter = [{
  path: '/base',
  component: Layout,
  children: [{
    path: 'store',
    component: () => import('./store/store.list.vue')
  }, {
    path: 'store/download/config',
    component: () => import('./store/store.download.config.list.vue')
  }, {
    path: 'company',
    component: () => import('./company/list.vue')
  }, {
    path: 'warehouse',
    component: () => import('./warehouse/list.vue')
  }, {
    path: 'express',
    component: () => import('./express/list.vue')
  }, {
    path: 'expressMapping',
    component: () => import('./express/express.wms.mapping.vue')
  }, {
    path: 'role',
    component: () => import('./role/list.vue')
  }, {
    path: 'datadict',
    component: () => import('./datadict/datadict.list.vue')
  }, {
    path: 'modifyPwd',
    component: () => import('./company/modify.pwd.vue')
  }, {
    path: 'region',
    component: () => import('./region/region.vue')
  }, {
    path: 'quartz',
    component: () => import('./quartz/quartz.list.vue')
  }, {
    path: 'mallRegionMapping',
    component: () => import('./region/mall.region.mapping.vue')
  },
    ...smsRouter,
    ...settingRouter,
    ...logRouter,
  ]
}];

export default baseRouter;