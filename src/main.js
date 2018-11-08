import Vue from 'vue';
import ElementUI from '@/libs/compnents.init';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import GoUI from '@/component';
import mixin from '@/libs/mixins/global';
import router from '@/router';
import app from '@/app.vue';
import store from '@/store';
import '@/libs/directive';
import '@/styles/common.less';
import '@/assets/iconfont/icon.css';

Vue.use(ElementUI, {size: 'mini'});
Vue.use(VueRouter);
Vue.use(GoUI);
Vue.mixin(mixin);

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(app)
});
