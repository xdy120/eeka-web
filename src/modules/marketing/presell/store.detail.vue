<template>
  <el-dialog title="店铺明细" :visible.sync="visible" :fullscreen="true">
    <el-container>
      <el-header class="oms-search">
        <product-search-part v-model="filter">
          <template slot="firstRow">
            <el-col :span="6">
              <el-form-item label="状态">
                <enum-selector v-model="filter.status"
                               enum-name="PresellDetailStatus"></enum-selector>
              </el-form-item>
            </el-col>
          </template>
        </product-search-part>
      </el-header>
      <el-header class="oms-action">
        <el-button-group>
          <go-search-button @click="clickSearch">搜索</go-search-button>
          <go-clean-button @click="reset">清空</go-clean-button>
        </el-button-group>
        <el-button @click="retry">失败重试</el-button>
      </el-header>
      <el-container>
        <el-aside>
          <el-table ref="storeTable" :data="presellStores" @current-change="storeChange"
                    height="400px">
            <el-table-column prop="storeName" label="店铺名称"></el-table-column>
            <el-table-column prop="rate" label="上传比例">
              <template slot-scope="scope">
                {{scope.row.rate}}%
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-table :data="details" height="400px" style="margin-left: 5px">
          <go-selection-column></go-selection-column>
          <go-enum-column prop="status" label="状态" enum-name="PresellDetailStatus"></go-enum-column>
          <el-table-column prop="presellDetail.productCode" label="商品编码"></el-table-column>
          <el-table-column prop="presellDetail.productName" label="商品名称"></el-table-column>
          <el-table-column prop="presellDetail.skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="presellDetail.skuName" label="规格名称"></el-table-column>
          <go-quantity-column prop="presellDetail.quantity" label="数量"></go-quantity-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <!--<el-table-column label="操作" width="100px">-->
          <!--<template slot-scope="scope">-->
          <!--<go-begin-button v-if="scope.row.status==='NOT_STARTED'"-->
          <!--@click="begin(scope.row)"></go-begin-button>-->
          <!--<go-begin-button v-if="scope.row.status==='BEGIN'"-->
          <!--@click="end(scope.row)"></go-begin-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-container>
      <el-footer>
        <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
    </el-container>
  </el-dialog>
</template>
<script>
  import {PresellApi, PresellStoreApi, PresellStoreDetailApi} from './api';
  import {ProductSearchPart} from '@/modules/product/index';
  import {DetailEdit, List, PageList, TableResize} from '@/libs/mixins';

  export default {
    name: 'AllDetail',
    mixins: [List, PageList, DetailEdit, TableResize],
    components: {ProductSearchPart},
    data() {
      return {
        api: PresellStoreDetailApi,
        pk: 'presellStoreDetailId',
        orderId: 'presellId',
        presellStores: [],
        presell: {},
        currentStore: null
      };
    },
    methods: {
      show(row) {
        this.presell = row;
        this.presellStores = [];
        this.details = [];
        this.visible = true;
        this.searchStore();
      },
      searchStore() {
        PresellStoreApi.listStores(this.presell.presellId).then(data => {
          this.presellStores = data;
          if (data.length > 0) {
            this.$refs.storeTable.setCurrentRow(data[0], true);
          }
        });
      },
      storeChange(store) {
        this.currentStore = store;
        this.search();
      },
      retry() {
        PresellApi.retry(this.presell.presellId, this.currentStore.presellStoreId).then(
          this.search);
      },
      search() {
        if (this.currentStore) {
          PresellStoreDetailApi.listDetail(this.presell.presellId, this.currentStore.storeId,
            this.filter, this.paging).then(res => {
            if (this.paging.page === 1) {
              this.total = res.total;
            }
            this.details = res.data;
          });
        } else {
          this.details = [];
        }
      }
    }
  };
</script>