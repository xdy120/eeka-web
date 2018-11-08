<template>
  <div style="display:inline">
    <el-button :type="type" @click="showDialog()" v-if="display">{{text}}</el-button>
    <el-dialog v-bind:title="title" :visible.sync="visible" :close-on-click-modal="false"
               width="80%" append-to-body>
      <el-container>
        <el-header :height="90" v-if="searchVisible">
          <el-form ref="queryForm" :rules="rules" :model="filter" @keyup.enter.native="clickSearch" label-width="110px">
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item label="商品编码" prop="query">
                  <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规格(套装)编码" prop="query">
                  <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规格条码" prop="query">
                  <el-input v-model="filter.barcodes" :placeholder="Placeholders.IN"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item label="商品名称" prop="query">
                  <el-input v-model="filter.productName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规格(套装)名称" prop="query">
                  <el-input v-model="filter.skuName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header height="35px">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset" v-show="searchVisible">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-container>
            <el-aside style="width:65%">
              <el-table ref="dataTable" :data="list" :height="250" @current-change="currentRowChange"
                        @selection-change="selectionChange" @row-dblclick="confirm">
                <go-selection-column v-if="iMultiple"></go-selection-column>
                <el-table-column label="数量" v-if="quantity" width="100PX">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.quantity" :min="1"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称"></el-table-column>
                <el-table-column prop="productCode" label="商品编码"></el-table-column>
                <el-table-column prop="skuName" label="规格名称"></el-table-column>
                <el-table-column prop="skuCode" label="规格编码"></el-table-column>
                <el-table-column prop="barcode" label="条码"></el-table-column>
                <template v-if="iColumns">
                  <el-table-column v-for="item in iColumns" width="100" fixed="right" :key="item.prop"
                                   :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                      <el-input-number v-if="item.type==='number'" v-model="scope.row[item.prop]"
                                       :min="0"></el-input-number>
                      <el-input v-else v-model="scope.row[item.prop]"></el-input>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
              <el-footer>
                <el-pagination :total="total" :page-size="paging.pageSize"
                               :current-page.sync="paging.page"
                               @size-change="pageSizeChange" @current-change="search">
                </el-pagination>
              </el-footer>
            </el-aside>
            <el-main style="margin-left:10px">
              <el-table :data="stockList" >
                <el-table-column label="虚拟仓名称" prop="virtualWarehouseName" width="150px"></el-table-column>
                <el-table-column label="库存数" prop="quantity" width="70px"></el-table-column>
                <el-table-column label="可销数" prop="saleable" width="70px"></el-table-column>
                <el-table-column label="可用数" prop="available"></el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
  import {List, PageList, Selector} from '@/libs/mixins';
  import {SkuApi} from '@/modules/product/api';
  import {StockApi} from '@/modules/stock/query/api';
  import {Assert, Placeholders} from '@/libs/util';

  class SkuFilter {
    constructor(combination) {
      this.enable = true;
      this.combination = combination;
    }
  }

  export default {
    name: 'SkuSelector',
    mixins: [List, PageList, Selector],
    props: {
      text: {
        type: String,
        default: '选择规格'
      },
      type: {
        type: String,
        default: 'primary'
      },
      quantity: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: true
      },
      combination: {
        type: Boolean,
        default: null
      },
      display: {
        type: Boolean,
        default: true
      },
      columns: {
        type: Array,
      },
      title: {
        type: String,
        default: '选择规格',
      }
    },
    data() {
      const queryValidator = (rule, value, callback) => {
        if (!Assert.isBlank(this.filter.productCodes)
          || !Assert.isBlank(this.filter.skuCodes)
          || !Assert.isBlank(this.filter.barcodes)
          || !Assert.isBlank(this.filter.productName)
          || !Assert.isBlank(this.filter.skuName)) {
          callback();
        } else {
          callback(new Error('至少输入一个条件'));
        }
      };
      return {
        Placeholders,
        filter: new SkuFilter(this.combination),
        searchVisible: true,
        visible: false,
        iColumns: this.columns,
        callback: Function,
        rules: {
          query: {validator: queryValidator}
        },
        stockList: []
      };
    },
    watch: {
      productId(val) {
        this.filter.productId = val;
      },
      productCode(val) {
        this.filter.productCode = val;
      },
      columns(val) {
        this.iColumns = val;
      }
    },
    methods: {
      showDialog({productId = undefined, multiple = this.multiple, onSelected} = {}) {
        this.filter = new SkuFilter(this.combination);
        this.list = [];
        this.total = 0;
        this.searchVisible = true;
        if (this.$refs.dataTable) {
          this.$refs.dataTable.clearSelection();
        }
        if (this.$refs.queryForm) {
          this.$refs.queryForm.resetFields();
        }
        if (productId) {
          this.filter.productId = productId;
          this.searchVisible = false;
          this.search();
        }
        this.iMultiple = multiple;
        if (onSelected) {
          this.onSelected = onSelected;
        }
        this.showList();
      },
      search() {
        if (this.$refs.queryForm) {
          this.$refs.queryForm.validate().then(() => {
            this.doSearch(SkuApi.listFull(this.filter, this.paging));
          });
        } else {
          this.doSearch(SkuApi.listFull(this.filter, this.paging));
        }
      },
      thenSearch(data) {
        for (let i = 0; i < data.length; i++) {
          data[i].quantity = 1;
          if (this.columns) {
            for (let col of this.columns) {
              if (col.type === 'number') {
                if (col.defaultValue) {
                  data[i][col.prop] = 1;
                } else {
                  data[i][col.prop] = 0;
                }
              }
            }
          }
        }
      },
      customConfirm() {
        if (this.onSelected) {
          this.onSelected(this.iMultiple ? this.selectedItems : this.selectedItem);
        }
      },
      currentRowChange(data) {
        this.selectedItem = data;
        let paging = {page: 1, pageSize: 500};
        let filter = {};
        filter.skuCodes = data.skuCode;
        StockApi.list(filter,paging).then(res=>{
          this.stockList = res.data;
        });
      }
    }
  };
</script>