<template>
  <el-table ref="marketTable" :data="list" :height="tabsTableHeight">
    <el-table-column prop="marketingCode" label="活动编码" :width="150"></el-table-column>
    <go-enum-column prop="marketingType" label="类型" enum-name="MarketingType"
                    :width="100"></go-enum-column>
    <el-table-column prop="marketingName" label="活动名称"></el-table-column>
  </el-table>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {SalesOrderMarketingApi} from '../api';

  export default {
    name: 'SalesOrderMarketing',
    mixins: [TableResize, List, Tabs],
    data() {
      return {
        tab: 'marketing',
        pk: 'salesOrderMarketingId'
      };
    },
    methods: {
      search() {
        if (this.parentData != null) {
          this.doSearch(SalesOrderMarketingApi.list(this.parentData.salesOrderId),
              this.$refs.marketTable);
        }
      }
    }
  };
</script>