<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="400" v-model="visible">
      <el-container class="dialog-search">
        <el-header>
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="出仓单号">
                  <el-input v-model="filter.vipDeliveryCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="PO单号">
                  <el-input v-model="filter.poCode"></el-input>
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
        <el-main style="position: relative;">
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="vipDeliveryCode" label="出仓单号"></el-table-column>
            <el-table-column prop="storeName" label="店铺名称"></el-table-column>
            <el-table-column prop="poCode" label="PO单号"></el-table-column>
            <el-table-column prop="vipWarehouseName" label="唯品仓库"></el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize"
                         :total="total" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择出仓单" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
  </div>
</template>
<script>
  import {List, PageList, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';
  import {VipDeliveryApi} from './api';

  export default {
    name: 'VipDeliverySelector',
    mixins: [List, PageList, Selector],
    props: {
      vipDeliveryCode: String,
      vipDispatch: null,
    },
    data() {
      return {
        pk: 'vipDeliveryId',
        api: VipDeliveryApi,
        text: this.vipDeliveryCode
      };
    },
    created() {
      this.createFilter();
    },
    watch: {
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
        }
      },
      vipDeliveryCode(val) {
        this.text = val;
      },
      vipDispatch() {
        this.filter = {};
        this.list = [];
        this.createFilter();
      }
    },
    methods: {
      customClean() {
        this.$emit('input', null);
        this.$emit('update:vipDeliveryCode', null);
        this.$emit('confirm', null);
      },
      customConfirm() {
        this.text = this.selectedItem.vipDeliveryCode;
        this.$emit('input', this.selectedItem.vipDeliveryId);
        this.$emit('update:vipDeliveryCode', this.selectedItem.vipDeliveryCode);
        this.$emit('confirm', this.selectedItem);
      },
      createFilter() {
        this.filter.status = 'AUDITED';
        this.filter.storeId = this.vipDispatch.storeId;
        this.filter.vipWarehouseCode = this.vipDispatch.vipWarehouseCode;
        this.search();
      }
    }
  };
</script>
