import Layout from '@/modules/navigation/layout';

let trade = [{
  path: '/trade',
  component: Layout,
  children: [
    {
      path: 'sales',
      component: () => import ('./sales/order.list.vue')
    }, {
      path: 'dispatch',
      component: () => import ('./dispatch/dispatch.list.vue')
    }, {
      path: 'aftersale/apply',
      component: () => import ('./apply/list.vue')
    }, {
      path: 'aftersale/sign',
      component: () => import ('./scan/sign.list.vue')
    }, {
      path: 'aftersale/scan',
      component: () => import ('./scan/list.vue')
    }, {
      path: 'aftersale/return',
      component: () => import ('./return/list.vue')
    }, {
      path: 'aftersale/return/notice',
      component: () => import ('./return/notice/list.vue')
    }, {
      path: 'aftersale/refund',
      component: () => import ('./refund/list.vue')
    }, {
      path: 'aftersale/exchange',
      component: () => import ('./exchange/list.vue')
    }, {
      path: 'aftersale/abnormalReturn',
      component: () => import ('./abnormalReturn/list.vue')
    }, {
      path: 'sales/batch',
      component: () => import ('./sales/batch/order.list.vue')
    }
  ]
}];

export default trade;