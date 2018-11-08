<template>
  <el-menu :default-active="activeMenuItemId" background-color="#e6eaee"
           text-color="#757d95" active-text-color="#2d8cf0" :collapse-transition="false"
           @open="loadMenu">
    <el-submenu v-for="menu in activeModule.menuMap" v-if="activeModule.menuMap"
                :index="menu.itemId" :key="menu.itemId">
      <template slot="title">
        <el-icon :name="menu.icon" v-if="menu.icon" style="font-size: 22px"></el-icon>
        <span slot="title">{{ menu.itemName }}</span>
      </template>
      <el-menu-item v-for="menuItem in menu.menuItemMap" v-if="menu.menuItemMap"
                    :key="menuItem.itemId" :index="menuItem.itemId"
                    @click="selectMenuItem(menuItem)">
                <span slot="title">
                    {{ menuItem.itemName }}
                </span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {ACTIVE_MENU, ACTIVE_MENU_ITEM, LOAD_MENU} from '@/libs/mutation.types';

  export default {
    name: 'sidebar',
    computed: {
      ...mapGetters(['activeModule', 'activeMenuItem', 'sidebar']),
      activeMenuItemId() {
        return this.activeMenuItem ? this.activeMenuItem.itemId : null;
      }
    },
    methods: {
      loadMenu(menuId) {
        let menu = this.activeModule.menuMap[menuId];
        this.$store.dispatch(LOAD_MENU, menu);
      },
      selectMenuItem(menuItem) {
        this.$store.dispatch(ACTIVE_MENU_ITEM, menuItem);
      }
    }
  };
</script>