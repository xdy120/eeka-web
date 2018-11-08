import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import {NavigationStore} from './modules/navigation';
import {AuthStore} from './modules/auth';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    auth: AuthStore,
    navigation: NavigationStore
  },
  plugins: [VuexPersistedState()]
});

export default store;