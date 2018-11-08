<template>
  <div>
    <el-table :data="logs" :height="pager.total>pager.pageSize?height-30:height" style="margin: 0">
      <el-table-column prop="_source.oper" width="100" label="操作人"></el-table-column>
      <go-date-time-column prop="_source.@timestamp" label="操作时间"
                           type="datetime"></go-date-time-column>
      <el-table-column prop="_source.act" width="100" label="操作"></el-table-column>
      <el-table-column prop="_source.message" label="内容"></el-table-column>
    </el-table>
    <el-pagination v-if="pager.total>pager.pageSize" :current-page.sync="pager.page" :page-size="pager.pageSize"
                   :total="pager.total" @current-change="search"
                   @size-change="handleSizeChange"/>
  </div>
</template>
<script>
  import {Log} from '@/libs/mixins';
  import {LogApi} from './api.js';

  export default {
    name: 'LogPage',
    mixins: [Log],
    props: {
      moduleName: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: false
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
        logIndex: 'biz-logs*',
        logApi: LogApi,
      };
    },
    watch: {
      value() {
        if (!this.value) {
          this.logs = [];
        } else if (this.autoRefresh) {
          this.search();
        }
      }
    },
    methods: {
      buildFilter(query) {
        query.push({match: {'logger': this.convertLoggerName(this.moduleName)}});
        query.push({match: {'bizid': this.value}});
      },
      convertLoggerName(moduleName) {
        return `oms.biz.logging.${moduleName.toLowerCase().replace(/_/g, '.')}`;
      }
    }
  };
</script>