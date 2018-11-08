<template>
  <div v-if="dialog">
    <el-button @click="showList">请选择虚拟仓库</el-button>
    <el-dialog title="请选择虚拟仓库" :visible.sync="visible" :close-on-click-modal="false" append-to-body>
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
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="virtualWarehouseCode" label="虚拟仓编码"
                             width="120px"></el-table-column>
            <el-table-column prop="virtualWarehouseName" label="虚拟仓名称"></el-table-column>
            <go-enum-column prop="virtualWarehouseType" label="虚拟仓类型"
                            enum-name="VirtualWarehouseType" width="120px"></go-enum-column>
          </el-table>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
  <div v-else>
    <el-popover ref="grid" placement="bottom" width="400" v-model="visible">
      <el-container>
        <el-header class="dialog-search" height="35px">
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
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="virtualWarehouseCode" label="虚拟仓编码" width="120px"
                             sortable></el-table-column>
            <el-table-column prop="virtualWarehouseName" label="虚拟仓名称"></el-table-column>
            <go-enum-column prop="virtualWarehouseType" enum-name="VirtualWarehouseType"
                            label="虚拟仓类型" width="100px"></go-enum-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择虚拟仓库" v-model="text" class="selector" v-popover:grid suffix-icon="el-icon-arrow-down" readonly>
      <el-button slot="append" icon="el-icon-close" @click="clean" v-if="text"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {VirtualWarehouseApi} from './api';
  import {Assert} from '@/libs/util';
  import {List, Selector} from '@/libs/mixins';

  export default {
    name: 'VirtualWarehouseSelector',
    mixins: [List, Selector],
    props: {
      virtualWarehouseCode: String,
      virtualWarehouseName: String,
      warehouseId: String,
      warehouseName: String,
      matchWarehouseId: String,
      virtualWarehouseType: {
        type: String,
        default: 'SHARE,EXCLUSIVE',
      },
      clearWarehouse: {
        type: Boolean,
        required: false,
        default: true
      },
      dialog: {
        type: Boolean,
        default: false
      },
      defaultFirst: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pk: 'virtualWarehouseId',
        api: VirtualWarehouseApi,
        filterText: null,
        filterList: [],
        text: this.virtualWarehouseName
      };
    },
    created() {
      this.search();
    },
    watch: {
      virtualWarehouseName(val) {
        this.text = val;
      },
      matchWarehouseId() {
        this.localSearch();
        this.clean();
      },
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.selectedItems = [];
        }
      },
      filterText() {
        this.localSearch();
      }

    },
    methods: {
      search() {
        return this.doSearch(VirtualWarehouseApi.getMy());
      },
      thenSearch(data) {
        this.list = data;
        this.localSearch();
      },
      localSearch() {
        if (!Assert.isEmpty(this.filterText)) {
          let reg = new RegExp(this.filterText.trim(), 'i');
          if (this.matchWarehouseId) {
            this.filterList = this.list.filter(
              x => x.warehouseId === this.matchWarehouseId && (reg.test(x.virtualWarehouseCode)
                || reg.test(x.virtualWarehouseName)));
          } else {
            this.filterList = this.list.filter(
              x => reg.test(x.virtualWarehouseCode) || reg.test(x.virtualWarehouseName));
          }
        }
        else {
          if (this.matchWarehouseId) {
            this.filterList = this.list.filter(x => x.warehouseId === this.matchWarehouseId);
          } else {
            this.filterList = this.list;
            if (this.defaultFirst && this.filterList.length > 0) {
              this.$refs.dataTable.setCurrentRow(this.filterList[0]);
              this.confirm(this.filterList[0]);
            }
          }
        }
      },
      customClean() {
        this.text = null;
        this.$emit('update:virtualWarehouseName', null);
        this.$emit('update:virtualWarehouseCode', null);
        if (this.clearWarehouse) {
          this.$emit('update:warehouseId', null);
        }
      },
      reset() {
        this.filter = {warehouseId: this.warehouseId};
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.virtualWarehouseName).join();
          this.$emit('input', this.selectedItems.map(x => x.virtualWarehouseId).join());
          this.$emit('update:virtualWarehouseName', this.text);
          this.$emit('update:virtualWarehouseCode',
            this.selectedItems.map(x => x.virtualWarehouseCode).join());
          this.$emit('update:warehouseId', this.selectedItems.map(x => x.warehouseId).join());
          this.$emit('update:warehouseName', this.selectedItems.map(x => x.warehouseName).join());
        } else {
          this.text = this.selectedItem.virtualWarehouseName;
          this.$emit('input', this.selectedItem.virtualWarehouseId);
          this.$emit('update:virtualWarehouseName', this.text);
          this.$emit('update:virtualWarehouseCode', this.selectedItem.virtualWarehouseCode);
          this.$emit('update:warehouseId', this.selectedItem.warehouseId);
          this.$emit('update:warehouseName', this.selectedItem.warehouseName);
        }
      }
    },
  };
</script>