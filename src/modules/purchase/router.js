import Layout from '@/modules/navigation/layout';

let path = '/purchase';
let purchase = [{
  path,
  component: Layout,
  children: [
    {
      path: `${path}/supplier`,
      component: () =>
        import ('./supplier/list.vue')
    }, {
      path: `${path}/order`,
      component: () =>
        import ('./list.vue')
    }, {
      path: `${path}/notice`,
      component: () =>
        import ('./notice/list.vue')
    }, {
      path: `${path}/return`,
      component: () =>
        import ('./return/list.vue')
    }, {
      path: `${path}/way`,
      component: () =>
        import ('./way/list.vue')
    }
  ]
}, {
  path: `${path}/print/:purchaseOrderId`,
  component: () =>
    import ('./print.vue')
}];

export default purchase;
