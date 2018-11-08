<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input v-model="filter.batchId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实体仓库">
              <warehouse-selector v-model="filter.warehouseId"></warehouse-selector>
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
            <el-form-item label="变更时间">
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
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="仓库编码" prop="_source.warehouseCode" width="100px"></el-table-column>
        <el-table-column label="仓库名称" prop="_source.warehouseName" width="150px"></el-table-column>
        <el-table-column label="规格编码" prop="_source.skuCode" width="120px" sortable></el-table-column>
        <go-quantity-column label="数量" prop="_source.quantity"></go-quantity-column>
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
  import {WarehouseSelector} from '@/modules/selector';
  import {LogApi} from '@/component/log/api';

  export default {
    mixins: [TableResize, Log],
    components: {WarehouseSelector},
    data() {
      return {
        logApi: LogApi,
        logIndex: 'stock-sync-*'
      };
    },
    methods: {
      buildFilter(query) {
        if (this.filter.skuCode) {
          query.push({match: {'skuCode': this.filter.skuCode}});
        }
        if (this.filter.warehouseId) {
          query.push({match: {'warehouseId': this.filter.warehouseId}});
        }
        if (this.filter.batchId) {
          query.push({match: {'level': this.filter.batchId}});
        }
      }
    }
  };
</script>