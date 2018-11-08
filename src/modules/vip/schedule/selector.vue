<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="800" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="档期编码">
                  <el-input v-model="filter.vipScheduleCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="档期名称">
                  <el-input v-model="filter.vipScheduleName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header :height="35">
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
            <el-table-column prop="vipScheduleCode" width="150" label="档期编码"></el-table-column>
            <el-table-column prop="vipScheduleName" width="150" label="档期名称"></el-table-column>
            <el-table-column prop="storeName" width="150" label="店铺名称"></el-table-column>
            <el-table-column prop="virtualWarehouseName" width="150" label="仓库名称"></el-table-column>
            <go-date-time-column prop="beginTime" label="开始时间"></go-date-time-column>
            <go-date-time-column prop="endTime" label="结束时间"></go-date-time-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize"
                         :total="total" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择档期" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean"
                 v-if="selectedItem||selectedItems.length>0"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
  </div>
</template>
<script>
  import {List, PageList, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';
  import {VipScheduleApi} from './api';

  export default {
    name: 'VipScheduleSelector',
    mixins: [List, PageList, Selector],
    props: {
      vipScheduleCode: String,
      dialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        pk: 'vipScheduleId',
        api: VipScheduleApi,
        text: this.vipScheduleCode,
      };
    },
    created() {
      this.search();
    },
    watch: {
      purchaseOrderCode(val) {
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
        this.$emit('input', null);
        this.$emit('update:vipScheduleCode', null);
        this.$emit('confirm', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.storeName).join();
          this.$emit('input', this.selectedItems.map(x => x.vipScheduleCode).join());
          this.$emit('update:vipScheduleCode',
              this.selectedItems.map(x => x.vipScheduleCode).join());
          this.$emit('confirm', this.selectedItems);
        } else {
          this.text = this.selectedItem.vipScheduleName;
          this.$emit('input', this.selectedItem.vipScheduleId);
          this.$emit('update:vipScheduleCode', this.selectedItem.vipScheduleCode);
          this.$emit('confirm', this.selectedItem);
        }
      }
    }
  };
</script>
