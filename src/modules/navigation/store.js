import router from '@/router';
import {NavigationApi} from './api';
import {Assert} from '@/libs/util';
import Vue from 'vue';
import {Message} from 'element-ui';
import {
  ACTIVE_MENU,
  ACTIVE_MENU_ITEM,
  ACTIVE_MODULE,
  CLOSE_ALL_QUICK_MENU_ITEM,
  CLOSE_QUICK_MENU_ITEM,
  CLEAR_QUICK_MENU_ITEM,
  LOAD_MENU,
  LOAD_MODULE,
  TOGGLE_SIDEBAR,
  USER_LOGOUT
} from '@/libs/mutation.types';

const store = {
  state: {
    sidebar: {
      opened: true,
      activeMenu: null,
      activeMenuItem: null,
      operatorMap: {}
    },
    navbar: {
      moduleMap: null,
      activeModule: null,
    },
    quickbar: []
  },
  mutations: {
    [TOGGLE_SIDEBAR]: state => {
      state.sidebar.opened = !state.sidebar.opened;
    },
    [LOAD_MODULE]: (state, moduleMap) => {
      state.navbar.moduleMap = moduleMap;
    },
    [ACTIVE_MODULE]: (state, {module, menuMap}) => {
      Vue.set(module, 'menuMap', menuMap);
      state.navbar.activeModule = module;
      state.sidebar.activeMenu = null;
      state.sidebar.activeMenuItem = null;
    },
    [ACTIVE_MENU]: (state, {menu, menuItemMap}) => {
      Vue.set(menu, 'menuItemMap', menuItemMap);
      state.sidebar.activeMenu = menu;
    },
    [LOAD_MENU]: (state, {menu, menuItemMap}) => {
      Vue.set(menu, 'menuItemMap', menuItemMap);
    },
    [ACTIVE_MENU_ITEM]: (state, menuItem) => {
      state.sidebar.activeMenuItem = menuItem;
      if (Assert.isEmpty(state.sidebar.activeMenu)
        || state.sidebar.activeMenu.itemId !== menuItem.menuId) {
        state.sidebar.activeMenu = state.navbar.activeModule.menuMap[menuItem.menuId];
      }
      if (!state.quickbar.find(x => x.router === menuItem.router)) {
        if (state.quickbar.length > 10) {
          state.quickbar.splice(0, 1);
        }
        state.quickbar.push(menuItem);
      }
      router.push(menuItem.router);
    },
    [CLOSE_QUICK_MENU_ITEM]: (state, menuItem) => {
      let index = state.quickbar.indexOf(menuItem);
      state.quickbar.splice(index, 1);
      let item = state.quickbar.length > index ? state.quickbar[index]
        : state.quickbar[--index];
      state.sidebar.activeMenuItem = item;
      router.push(item.router);
    },
    [CLOSE_ALL_QUICK_MENU_ITEM]: state => {
      state.quickbar = [];
      state.sidebar.activeMenuItem = null;
      router.push('/');
    },
    [CLEAR_QUICK_MENU_ITEM]: state => {
      state.quickbar = [];
      state.sidebar.activeMenuItem = null;
    },
    [USER_LOGOUT]: state => {
      state.quickbar = [];
      state.navbar.moduleMap = null;
      state.navbar.activeModule = null;
      state.sidebar.activeMenu = null;
      state.sidebar.activeMenuItem = null;
      state.sidebar.operatorMap = {};
    }
  },
  actions: {
    [LOAD_MODULE]: context => {
      let moduleMap = context.getters.moduleMap;
      if (!Assert.isEmpty(moduleMap)) {
        context.commit(LOAD_MODULE, moduleMap);
        context.dispatch(ACTIVE_MODULE, Object.values(moduleMap)[0]);
      } else {
        NavigationApi.listModule(context.getters.user.userId).then(modules => {
          if (modules.length > 0) {
            moduleMap = {};
            modules.forEach(module => {
              moduleMap[module.itemId] = module;
            });
            context.commit(LOAD_MODULE, moduleMap);
            context.dispatch(ACTIVE_MODULE, modules[0]);
          } else {
            Message.warning('您没有任何权限，请联系管理员开通权限后重试！');
          }
        });
      }
    },
    [ACTIVE_MODULE]: (context, module) => {
      let menuMap = module.menuMap;
      if (menuMap) {
        context.commit(ACTIVE_MODULE, {module, menuMap});
        context.dispatch(ACTIVE_MENU, Object.values(menuMap)[0]);
      } else {
        NavigationApi.listMenu(context.getters.user.userId, module.itemId).then(
          menus => {
            if (menus.length > 0) {
              menuMap = {};
              menus.forEach(menu => {
                menu.moduleId = module.itemId;
                menuMap[menu.itemId] = menu;
              });
              context.commit(ACTIVE_MODULE, {module, menuMap});
              if (menus.length > 0) {
                context.dispatch(ACTIVE_MENU, menus[0]);
              }
            }
          });
      }
    },
    [LOAD_MENU]: (context, menu) => {
      let menuItemMap = menu.menuItemMap;
      if (menuItemMap) {
        context.commit(LOAD_MENU, {menu, menuItemMap});
      } else {
        NavigationApi.listMenuItem(context.getters.user.userId,
          menu.itemId).then(menuItems => {
          if (menuItems.length > 0) {
            menuItemMap = {};
            menuItems.forEach(menuItem => {
              menuItem.menuId = menu.itemId;
              menuItemMap[menuItem.itemId] = menuItem;
            });
            context.commit(LOAD_MENU, {menu, menuItemMap});
          }
        });
      }
    },
    [ACTIVE_MENU]: (context, menu) => {
      let menuItemMap = menu.menuItemMap;
      if (menuItemMap) {
        context.commit(ACTIVE_MENU, {menu, menuItemMap});
        if (Assert.isEmpty(context.state.sidebar.activeMenuItem)) {
          context.dispatch(ACTIVE_MENU_ITEM, Object.values(menuItemMap)[0]);
        }
      } else {
        NavigationApi.listMenuItem(context.getters.user.userId,
          menu.itemId).then(menuItems => {
          if (menuItems.length > 0) {
            menuItemMap = {};
            menuItems.forEach(menuItem => {
              menuItem.menuId = menu.itemId;
              menuItemMap[menuItem.itemId] = menuItem;
            });
            context.commit(ACTIVE_MENU, {menu, menuItemMap});
            if (Assert.isEmpty(context.state.sidebar.activeMenuItem)) {
              context.dispatch(ACTIVE_MENU_ITEM, menuItems[0]);
            }
          }
        });
      }
    },

    [ACTIVE_MENU_ITEM]: (context, menuItem) => {
      context.commit(ACTIVE_MENU_ITEM, menuItem);
    }

  },
  getters: {
    sidebar: state => state.sidebar,
    quickbar: state => state.quickbar,
    moduleMap: state => state.navbar.moduleMap,
    activeModule: state => state.navbar.activeModule ? state.navbar.activeModule
      : {},
    activeMenu: state => state.sidebar.activeMenu,
    activeMenuItem: state => state.sidebar.activeMenuItem
  }
};
export default store;
