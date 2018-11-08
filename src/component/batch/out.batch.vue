<template>
  <div style="display: inline;overflow: hidden">
    <el-popover ref="logs" v-model="showLog" title="出库批次" width="600" trigger="click"
                placement="left-end">
      <el-table :data="list" :height="total>paging.pageSize?height-30:height" style="margin: 0">
        <el-table-column prop="stockOutBatchId" width="100" label="批次号"></el-table-column>
        <el-table-column prop="outQuantity" width="100" label="数量"></el-table-column>
        <go-date-time-column prop="outTime" label="出库时间" type="datetime"></go-date-time-column>
        <go-date-time-column prop="createdTime" label="创建时间" type="datetime"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间" type="datetime"></go-date-time-column>
      </el-table>
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-popover>
    <go-batch-button @click="showDialog()" v-popover:logs></go-batch-button>
  </div>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {OutBatchApi} from './api.js';

  export default {
    name: 'OutBatchPopover',
    mixins: [List, PageList, TableResize],
    props: {
      value: {
        type: Object,
        required: false
      },
      orderId: {
        type: String,
        required: true
      },
      detailId: {
        type: String,
        required: true
      },
      height: {
        type: Number,
        default: 200
      },
      autoRefresh: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        api: OutBatchApi,
        pk: 'stockOutBatchId',
        showLog: false,
        domain: this.value
      };
    },
    methods: {
      showDialog() {
        this.showLog = true;
        this.filter = {
          'noticeOrderId': this.domain[this.orderId],
          'noticeOrderDetailId': this.domain[this.detailId]
        };
        this.search();
      },
    },
  };
</script>