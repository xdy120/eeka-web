<template>
  <div>
    <el-popover ref="occupancy" v-model="visible" title="库存占用" width="600" trigger="click"
                placement="left-end">
      <el-table :data="list" :height="total>paging.pageSize?height-30:height" style="margin: 0">
        <el-table-column prop="quantity" width="100" label="数量"></el-table-column>
        <go-date-time-column prop="createdTime" label="创建时间" type="datetime"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间" type="datetime"></go-date-time-column>
      </el-table>
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-popover>
    <go-batch-button v-popover:occupancy v-show="false"></go-batch-button>
  </div>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {OccupancyApi} from './api.js';

  export default {
    name: 'OccupancyPopover',
    mixins: [List, PageList, TableResize],
    props: {
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
        api: OccupancyApi,
        pk: 'stockOccupancyId',
        visible: false,
        domain: {}
      };
    },
    methods: {
      showDialog(entity) {
        this.visible = true;
        this.filter = {};
        this.search();
      },
    },
  };
</script>