import Layout from '@/modules/navigation/layout';

const reportRouter = [
  {
    path: '/report',
    component: Layout,
    children: [{
      path: 'product/return',
      component: () => import('./product/return/list.vue')
    }, {
      path: 'product/sales',
      component: () => import('./product/sales/list.vue')
    }, {
      path: 'salesorder/salesDetail',
      component: () => import('./salesorder/salesdetail/list.vue')
    }, {
      path: 'salesorder/deliveryStatistics',
      component: () => import('./salesorder/deliverystatistics/list.vue')
    }, {
      path: 'salesorder/salesstatistics',
      component: () => import('./salesorder/salesstatistics/list.vue')
    }, {
      path: 'salesorder/oosstatistics',
      component: () => import('./salesorder/oosstatistics/list.vue')
    }, {
      path: 'salesorder/returnstatistics',
      component: () => import('./salesorder/returnstatistics/list.vue')
    }, {
      path: 'salesorder/sales',
      component: () => import('./salesorder/sales/list.vue')
    },{
      path: 'salesorder/salesdetailsellstatistics',
      component: () => import('./salesorder/salesdetailsellstatistics/list.vue')
    },{
        path: 'salesorder/salesmonthstatistics',
        component: () => import('./salesorder/salesmonthstatistics/list.vue')
    },{
      path: 'vip/deliver',
      component: () => import('./vip/deliver/list.vue')
    }, {
      path: 'vip/return',
      component: () => import('./vip/return/list.vue')
    }, {
      path: 'vip/sales',
      component: () => import('./vip/sales/list.vue')
    },{
      path: 'vip/salesstatistics',
      component: () => import('./vip/salesstatistics/list.vue')
    },{
      path: 'vip/salesmonthstatistics',
      component: () => import('./vip/salesmonthstatistics/list.vue')
    },{
      path: 'salesorder/eekasalesdetail',
      component: () => import('./salesorder/eekasalesdetail/list.vue')
    },{
      path: 'salesorder/eekareturndetail',
      component: () => import('./salesorder/eekareturndetail/list.vue')
    },{
      path: 'vip/eekasalesdetail',
      component: () => import('./vip/eekasalesdetail/list.vue')
    },{
      path: 'vip/eekareturndetail',
      component: () => import('./vip/eekareturndetail/list.vue')
    },{
      path: 'salesorder/eekasellandreturnstatistics',
      component: () => import('./salesorder/eekasellandreturnstatistics/list.vue')
    },{
      path: 'salesorder/eekasellstatistics',
      component: () => import('./salesorder/eekasellstatistics/list.vue')
    },{
      path: 'vip/eekasellstatistics',
      component: () => import('./vip/eekasellstatistics/list.vue')
    }]
  }
];

export default reportRouter;
