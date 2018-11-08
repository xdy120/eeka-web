<template>
  <div>
    <div style="margin-bottom: 5px" v-if="canEdit">
      <store-selector @confirm="selectedStore" ref="storeSelector" multiple dialog></store-selector>
    </div>
    <el-table ref="dataTable" :data="list" :height="canEdit?tabsMinTableHeight:tabsTableHeight">
      <el-table-column prop="storeName" label="店铺名称"></el-table-column>
      <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
      <el-table-column label="操作" width="80" v-if="canEdit">
        <template slot-scope="scope">
          <go-delete-button @click="removeStore(scope.row)"></go-delete-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {GiftStrategyApi} from '../api';
  import {StoreSelector} from '@/modules/selector';
  import {Gift} from '../mixin';

  export default {
    components: {StoreSelector},
    mixins: [TableResize, List, Tabs, Gift],
    data() {
      return {
        tab: 'store',
        pk: 'giftStrategyStoreId',
        api: GiftStrategyApi,
        domain: this.parentData
      };
    },
    methods: {
      search() {
        if (this.parentData) {
          this.domain = this.parentData;
          this.doSearch(GiftStrategyApi.listStores(this.parentData.giftStrategyId));
        } else {
          this.list = [];
        }
      },
      removeStore(store) {
        this.$confirm('删除后不可恢复，是否删除？').then(() => {
          this.api.removeStore(this.parentData.giftStrategyId, store.giftStrategyStoreId).then(
            this.search);
        });
      },
      selectedStore(selected) {
        if (selected) {
          let stores = [];
          selected.forEach(row => {
            let store = {};
            store.storeId = row.storeId;
            store.storeName = row.storeName;
            stores.push(store);
          });
          GiftStrategyApi.addStore(this.domain.giftStrategyId, stores).then(this.search);
        }
      },
    }
  };
</script>