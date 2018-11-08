<template>
  <div v-if="dialog">
    <el-button @click="showList">选择店铺</el-button>
    <el-dialog title="选择店铺" :visible.sync="visible" :close-on-click-modal="false" append-to-body>
      <el-container>
        <el-header height="35px">
          <el-form>
            <el-row>
              <el-col :span="20">
                <el-input v-model="filterText" prefix-icon="el-icon-search"
                          placeholder="编码/名称"></el-input>
              </el-col>
              <el-col :span="4" align="right">
                <el-button @click="confirm">确认</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-table ref="dataTable" :data="filterList" :height="300"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="iMultiple"></go-selection-column>
            <el-table-column prop="storeCode" label="店铺编码"></el-table-column>
            <el-table-column prop="storeName" label="店铺名称"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
  <div v-else>
    <el-popover ref="grid" placement="bottom" width="400" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form>
            <el-row>
              <el-col :span="20">
                <el-input v-model="filterText" prefix-icon="el-icon-search"
                          placeholder="编码/名称"></el-input>
              </el-col>
              <el-col :span="4" align="right">
                <el-button @click="confirm">确认</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-table ref="dataTable" :data="filterList" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="iMultiple"></go-selection-column>
            <el-table-column prop="storeCode" label="店铺编码"></el-table-column>
            <el-table-column prop="storeName" label="店铺名称"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择店铺" v-model="text" class="selector" v-popover:grid
              suffix-icon="el-icon-arrow-down" readonly>
      <el-button slot="append" icon="el-icon-close" @click="clean" v-if="text"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {StoreApi} from './api';
  import {List, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';

  export default {
    name: 'StoreSelector',
    mixins: [List, Selector],
    props: {
      storeCode: String,
      storeName: String,
      mallType: String,
      mallTypes: Array,
      dialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pk: 'storeId',
        api: StoreApi,
        filterText: null,
        filterList: [],
        text: this.storeName
      };
    },
    created() {
      this.search();
      this.init();
    },
    watch: {
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.$refs.dataTable.clearSelection();
        } else {
          this.init();
        }
      },
      storeName(val) {
        this.text = val;
      },
      filterText() {
        this.localSearch();
      },
      mallType(val) {
        this.mallType = val;
        this.search();
        this.init();
      },
      mallTypes(val) {
        this.mallTypes = val;
        this.search();
        this.init();
      }
    },
    methods: {
      search() {
        return this.doSearch(StoreApi.getMy());
      },
      thenSearch(data) {
        if (this.mallType) {
          this.list = data.filter(x => x.mallType === this.mallType);
        } else if (this.mallTypes) {
          this.list = data.filter(x => {
            for (let mallType of this.mallTypes) {
              return x.mallType === mallType;
            }
          });
        } else {
          this.list = data;
        }
        this.filterList = this.list;
      },
      init() {
        if (!this.dialog) {
          if (!Assert.isEmpty(this.value)) {
            if (this.iMultiple) {
              let ids = this.value.split(',');
              let selectedItems = this.list.filter(x => ids.some(y => y === x.storeId));
              for (let row of selectedItems) {
                this.$refs.dataTable.toggleRowSelection(row, true);
              }
              this.text = selectedItems.map(x => x.storeName).join(',');
            } else {
              let row = this.list.find(x => x.storeId === this.value);
              if (row) {
                this.$refs.dataTable.setCurrentRow(row);
                this.selectedItem = row;
                this.text = row.storeName;
              }
            }
          }
        }
      },
      localSearch() {
        if (!Assert.isEmpty(this.filterText)) {
          let filterData = [];
          let reg = new RegExp(this.filterText.trim(), 'i');
          for (let item of this.list) {
            if (reg.test(item.storeCode) || reg.test(item.storeName)) {
              filterData.push(item);
            }
          }
          this.filterList = filterData;
        }
        else {
          this.filterList = this.list;
        }
      },
      customClean() {
        this.text = null;
        this.$emit('update:storeName', null);
        this.$emit('update:storeCode', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.storeName).join();
          this.$emit('update:storeName', this.text);
          this.$emit('update:storeCode', this.selectedItems.map(x => x.storeCode).join());
        } else {
          this.text = this.selectedItem.storeName;
          this.$emit('update:storeName', this.text);
          this.$emit('update:storeCode', this.selectedItem.storeCode);
        }
        this.$refs.dataTable.clearSelection();
      },
    }
  };
</script>
