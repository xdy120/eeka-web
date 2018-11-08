import VueRouter from 'vue-router';
import store from '@/store';
import auth from './modules/auth/router';
import base from './modules/base/router';
import product from './modules/product/router';
import purchase from './modules/purchase/router';
import marketing from './modules/marketing/router';
import stock from './modules/stock/router';
import vip from './modules/vip/router';
import trade from './modules/trade/router';
import exportRouter from './modules/report/router';
import finance from './modules/finance/router';

const routers = [{
  path: '/',
  component: () => import('./modules/navigation/layout.vue')
}, {
  path: '*',
  component: () => import('./error/404.vue')
}];

routers.push(...auth);
routers.push(...base);
routers.push(...product);
routers.push(...purchase);
routers.push(...marketing);
routers.push(...stock);
routers.push(...vip);
routers.push(...trade);
routers.push(...exportRouter);
routers.push(...finance);

const RouterConfig = {
  mode: 'history',
  routes: routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'organization') {
    next();
  } else {
    let token = store.getters.token;
    if (token) {
      next();
    } else {
      next('/login');
    }
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});
export default router;
