import Layout from '@/modules/navigation/layout';

let path = '/product';
let product = [{
  path,
  component: Layout,
  children: [
    {
      path: `${path}/index`,
      component: () => import ('./product.list.vue')
    },
    {
      path: `${path}/combination`,
      component: () => import ('./combination/combination.vue')
    },
    {
      path: `${path}/attribute`,
      component: () => import ('./attribute/attribute.vue')
    },
    {
      path: `${path}/category`,
      component: () => import ('./category/category.vue')
    },
    {
      path: `${path}/mapping`,
      component: () => import ('./mapping/mapping.vue')
    },
    {
      path: `${path}/mapping/log`,
      component: () => import ('./mapping/mapping.log.vue')
    }
  ]
}];

export default product;
