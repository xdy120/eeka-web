import Layout from '@/modules/navigation/layout';

let path = '/marketing';
let activity = [{
  path,
  component: Layout,
  children: [
    {
      path: `${path}/activity`,
      component: () => import ('./activity/list.vue')
    }, {
      path: `${path}/presell`,
      component: () => import ('./presell/list.vue')
    }, {
      path: `${path}/member`,
      component: () => import ('./member/list.vue')
    }, {
      path: `${path}/gift/strategy`,
      component: () => import ('./gift/strategy.list.vue')
    }
  ]
}];

export default activity;
