<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" label-width="100px" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="filter.orderCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据类型">
              <enum-selector enum-name="OrderType" @change="orderTypeChange"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="虚拟仓">
              <virtual-warehouse-selector
                  v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="操作时间">
              <el-date-picker v-model="filter.beginTime" type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至">
              <el-date-picker v-model="filter.endTime" type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>

    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="logs" :height="mainHeight">
        <el-table-column label="序号" type="index" width="50px"/>
        <el-table-column label="单据编号" prop="_source.orderCode" width="150px"/>
        <el-table-column label="单据类型" prop="_source.orderType" width="150px"/>
        <el-table-column label="虚拟仓库名称" prop="_source.virtualWarehouseName" width="150px"/>
        <el-table-column label="规格编码" prop="_source.skuCode"/>
        <go-quantity-column label="数量" prop="_source.quantity"/>
        <go-date-time-column label="调用时间" prop="_source.@timestamp"
                             type="datetime"></go-date-time-column>
        <el-table-column label="内容" prop="_source.message"></el-table-column>
      </el-table>
    </el-main>

    <el-footer>
      <el-pagination :current-page.sync="pager.page" :page-size="pager.pageSize"
                     :total="pager.total" @current-change="search" @size-change="handleSizeChange"/>
    </el-footer>
  </el-container>
</template>
<script>
  import {Log, TableResize} from '@/libs/mixins/index';
  import {VirtualWarehouseSelector} from '@/modules/selector';
  import {LogApi} from '@/component/log/api';

  export default {
    mixins: [TableResize, Log],
    components: {VirtualWarehouseSelector},
    data() {
      return {
        logApi: LogApi,
        logIndex: 'stock-track-*'
      };
    },
    methods: {
      orderTypeChange(val) {
        this.$set(this.filter, 'orderType', val ? val.caption : null);
      },
      buildFilter(query) {
        if (this.filter.orderCode) {
          query.push({match: {'orderCode': this.filter.orderCode}});
        }
        if (this.filter.virtualWarehouseId) {
          query.push({match: {'virtualWarehouseId': this.filter.virtualWarehouseId}});
        }
        if (this.filter.orderType) {
          query.push({match: {'orderType': this.filter.orderType}});
        }
        if (this.filter.skuCode) {
          query.push({match: {'skuCode': this.filter.skuCode}});
        }
      }
    }
  };
</script>