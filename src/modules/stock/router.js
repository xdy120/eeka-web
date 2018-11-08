import Layout from '@/modules/navigation/layout';

let stock = [{
  path: '/stock',
  component: Layout,
  children: [
    {
      path: 'query',
      component: () => import ('./query/list.vue')
    }, {
      path: 'turnover',
      component: () => import ('./query/sync.log.vue')
    }, {
      path: 'log',
      component: () => import ('./query/track.log.vue')
    }, {
      path: 'upload',
      component: () => import ('./upload/upload.vue')
    }, {
      path: 'upload/store',
      component: () => import ('./upload/upload.store.vue')
    }, {
      path: 'upload/log',
      component: () => import ('./upload/upload.log.vue')
    }, {
      path: 'virtual/allot',
      component: () => import ('./allot/list.vue')
    },
    {
      path: 'in',
      component: () => import ('./in/list.vue')
    },
    {
      path: 'out',
      component: () => import ('./out/list.vue')
    },
    {
      path: 'loanIn',
      component: () => import('./loan/loan.in.list.vue')
    },
    {
      path: 'loanOut',
      component: () => import('./loan/loan.out.list.vue')
    }
  ]
}];

export default stock;
