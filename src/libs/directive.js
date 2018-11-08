import Vue from 'vue';

Vue.directive('resize', {
  bind(el, binding, vnode) {
    vnode.handler = function () {
      setInterval(function () {
        vnode.context[binding.expression] = el.clientHeight;
      }, 100);
    }.bind(this);
    window.addEventListener('resize', vnode.handler);
  },
  inserted(el, binding, vnode) {
    vnode.handler();
  },
  unbind(el, binding, vnode) {
    window.removeEventListener('resize', vnode.handler);
  }
});

Vue.directive('permission', {
  bind: function (el, binding) {
    // let menuItemId = binding.arg;
    // if (!menuItemId) {
    //     menuItemId = store.getters.activeMenuItem;
    // }
    // if (!menuItemId) {
    //     el.parentNode.removeChild(el);
    //     return;
    // }
    // let map = store.getters.sidebar.operatorMap[menuItemId];
    // if (map === null || map === undefined || !map[binding.value]) {
    //     el.parentNode.removeChild(el);
    // }
  }
});