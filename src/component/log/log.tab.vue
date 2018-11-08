<template>
  <log-page :module-name="moduleName" auto-refresh v-model="logId" :height="tabsTableHeight"/>
</template>
<script>
  import {TableResize, Tabs} from '@/libs/mixins';

  export default {
    name: 'LogTab',
    mixins: [TableResize, Tabs],
    props: {
      moduleName: String,
      prop: String
    },
    data() {
      return {
        tab: 'log',
        logId: null
      };
    },
    methods: {
      search() {
        if (this.parentData) {
          this.logId = this.parentData[this.prop];
        }
      }
    }
  };
</script>