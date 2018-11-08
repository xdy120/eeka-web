<template>
  <div v-if="dialog">
    <el-button @click="showList">选择仓库</el-button>
    <el-dialog title="选择仓库" :visible.sync="visible" :close-on-click-modal="false" width="300px"
               append-to-body>
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="实体仓编码">
                  <el-input v-model="filter.warehouseCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实体仓名称">
                  <el-input v-model="filter.warehouseName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="仓库类型">
                  <enum-selector v-model="filter.warehouseType"
                                 enum-name="WarehouseType"></enum-selector>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header height="35px">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="warehouseCode" label="实体仓库编码" width="120px"></el-table-column>
            <el-table-column prop="warehouseName" label="实体仓库名称" width="120px"></el-table-column>
            <go-enum-column prop="warehouseType" enum-name="warehouseType" label="实体仓库类型"
                            width="100px"></go-enum-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize"
                         :total="total" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
  <div v-else>
    <el-popover ref="grid" placement="bottom" width="300px" v-model="visible">
      <el-container>
        <el-header height="70px" class="oms-search">
          <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="实体仓编码">
                  <el-input v-model="filter.warehouseCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实体仓名称">
                  <el-input v-model="filter.warehouseName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="实体仓类型">
                  <enum-selector v-model="filter.warehouseType"
                                 enum-name="WarehouseType"></enum-selector>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header height="35px">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="warehouseCode" label="实体仓库编码" width="120px"></el-table-column>
            <el-table-column prop="warehouseName" label="实体仓库名称"></el-table-column>
            <go-enum-column prop="warehouseType" enum-name="WarehouseType" label="实体仓库类型"
                            width="100px"></go-enum-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize"
                         :total="total" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择仓库" v-model="text" class="selector" v-popover:grid
              suffix-icon="el-icon-arrow-down" readonly>
      <el-button slot="append" icon="el-icon-close" @click="clean" v-if="text"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {WarehouseApi} from './api';
  import {Assert} from '@/libs/util';
  import {List, PageList, Selector} from '@/libs/mixins';

  export default {
    name: 'WarehouseSelector',
    mixins: [List, PageList, Selector],
    props: {
      warehouseCode: String,
      warehouseName: String,
      dialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        pk: 'warehouseId',
        api: WarehouseApi,
        text: this.warehouseName
      };
    },
    created() {
      this.search();
    },
    watch: {
      warehouseName(val) {
        this.text = val;
      },
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.selectedItems = [];
        }
      },
    },
    methods: {
      customClean() {
        this.text = null;
        this.$emit('update:warehouseName', null);
        this.$emit('update:warehouseCode', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.warehouseName).join();
          this.$emit('input', this.selectedItems.map(x => x.warehouseId).join());
          this.$emit('update:warehouseName', this.text);
          this.$emit('update:warehouseCode', this.selectedItems.map(x => x.warehouseCode).join());
          this.$emit('confirm', this.selectedItems);
        } else {
          this.text = this.selectedItem.warehouseName;
          this.$emit('input', this.selectedItem.warehouseId);
          this.$emit('update:warehouseName', this.text);
          this.$emit('update:warehouseCode', this.selectedItem.warehouseCode);
          this.$emit('confirm', this.selectedItem);
        }
      }
    }
  };
</script>