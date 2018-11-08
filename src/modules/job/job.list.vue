<template>
  <el-container>
    <el-main>
      <el-table :data="list" height="300">
        <el-table-column prop="jobName" label="名称" width="150"></el-table-column>
        <go-enum-column prop="jobType" label="类型" enum-name="JobType"></go-enum-column>
        <go-enum-column prop="status" label="状态" enum-name="JobStatus"></go-enum-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <go-cancel-button v-if="scope.row.status==='WAITING'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <go-delete-button v-if="scope.row.status==='FINISHED' || scope.row.status==='CANCELED'"
                              @click="remove(scope.row)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {List, PageList} from '@/libs/mixins';
  import {JobApi} from './api';

  export default {
    mixins: [List, PageList],
    data() {
      return {
        api: JobApi,
        pk: 'jobId'
      };
    },
    methods: {
      cancel(row) {
        JobApi.cancel(row.jobId).then(this.search);
      }
    }
  };
</script>