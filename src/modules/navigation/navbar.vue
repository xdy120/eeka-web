<template>
  <el-menu background-color="#494d58" text-color="#a4a6ac" active-text-color="#fff"
           :default-active="activeModule.itemId" mode="horizontal" @select="selectModule">
    <el-menu-item v-for="module in moduleMap" :key="module.itemId" :index="module.itemId"
                  style="float:none;display:inline-block;">
      <template>
          <span><el-icon :name="module.icon"
                         v-if="module.icon"></el-icon>{{ module.itemName }}</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {ACTIVE_MODULE} from '@/libs/mutation.types';

  export default {
    name: 'navbar',
    computed: {
      ...mapGetters([
        'activeModule', 'moduleMap', 'sidebar'
      ])
    },
    methods: {
      selectModule(moduleId) {
        let module = this.moduleMap[moduleId];
        this.sidebar.opened = true;
        this.$store.dispatch(ACTIVE_MODULE, module);
      }
    }
  };
</script>

