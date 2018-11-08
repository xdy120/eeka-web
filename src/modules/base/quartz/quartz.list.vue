<template>
  <el-container>
    <el-header height="35px">
      <el-button type="success" @click="search">刷新</el-button>
      <el-button type="primary" @click="showCreator">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight">
        <el-table-column prop="jobName" label="任务名" width="150"></el-table-column>
        <el-table-column prop="jobGroup" label="任务组" width="150"></el-table-column>
        <el-table-column prop="triggerName" label="触发器名" width="200"></el-table-column>
        <el-table-column prop="triggerGroup" label="触发器组" width="180"></el-table-column>
        <el-table-column prop="triggerType" label="触发器类型"></el-table-column>
        <el-table-column prop="cron" label="cron表达式" width="100"></el-table-column>
        <go-quantity-column prop="interval" label="执行间隔"></go-quantity-column>
        <el-table-column prop="className" label="执行类" width="400"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <go-toggle :value="scope.row.status != 'PAUSED'"
                       @change="toggleEnable(scope.row)"></go-toggle>
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <go-delete-button
                @click="doDelete(scope.row.jobGroup, scope.row.jobName)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <quartz-creator ref="creator" @ok="search"></quartz-creator>
  </el-container>
</template>
<script>
  import {List, TableResize} from '@/libs/mixins';
  import {QuartzApi} from './api';
  import quartzCreator from './quartz.create';

  export default {
    mixins: [List, TableResize],
    components: {quartzCreator},
    data() {
      return {
        api: QuartzApi
      };
    },
    created() {
      this.search();
    },
    methods: {
      doDelete(jobGroup, jobName) {
        this.$confirm('删除后不可恢复，是否删除？').then(() => {
          if (jobGroup && jobName) {
            this.api.delete(jobGroup, jobName).then(() => {
              this.search();
            });
          }
        });
      },
      toggleEnable(entity) {
        if (entity.status == 'PAUSED') {
          this.api.continue(entity.jobGroup, entity.jobName).then(() => {
            this.search();
          });
        } else {
          this.api.pause(entity.jobGroup, entity.jobName).then(() => {
            this.search();
          });
        }
      }
    }
  };
</script>
