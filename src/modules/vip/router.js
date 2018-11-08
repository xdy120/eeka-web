import Layout from '@/modules/navigation/layout';

let activity = [{
  path: '/vip',
  component: Layout,
  children: [
    {
      path: 'schedule',
      component: () => import ('./schedule/list.vue')
    },
    {
      path: 'schedule/adjust',
      component: () => import ('./schedule/adjust/list.vue')
    },
    {
      path: 'dispatch',
      component: () => import ('./dispatch/list.vue')
    },
    {
      path: 'delivery',
      component: () => import ('./delivery/list.vue')
    },
    {
      path: 'return',
      component: () => import ('./return/list.vue')
    },
    {
      path: 'return/notice',
      component: () => import ('./return/notice/list.vue')
    }
  ]
}];

export default activity;
