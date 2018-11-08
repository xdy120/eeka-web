import Layout from '@/modules/navigation/layout';

let finance = [{
  path: '/finance',
  component: Layout,
  children: [
    {
      path: 'alipay',
      component: () => import ('./alipay/alipay.record.list.vue')
    }
  ]
}];

export default finance;