<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="日志级别">
              <el-select v-model="filter.level" placeholder="请选择">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日志名称">
              <el-input v-model="filter.logger"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="记录时间">
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
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="内容">
              <el-input v-model="filter.message"></el-input>
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
        <el-table-column type="index" width="50px" label="序号"></el-table-column>
        <el-table-column prop="_source.level" label="日志级别" width="100px"></el-table-column>
        <el-table-column prop="_source.host" label="机器名" width="150px"></el-table-column>
        <el-table-column prop="_source.thread" label="线程" width="150px"></el-table-column>
        <el-table-column prop="_source.logger" label="日志名称" width="200px"></el-table-column>
        <go-date-time-column prop="_source.@timestamp" label="操作时间"
                             type="datetime"></go-date-time-column>
        <el-table-column label="详情" width="50px">
          <template slot-scope="scope">
            <el-button type="text" @click="showMessage(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="_source.message" label="消息" :formatter="formatMessage"/>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :total="pager.total" :page-size="pager.pageSize"
                     :current-page.sync="pager.page" @size-change="handleSizeChange"
                     @current-change="search">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {Log, TableResize} from '@/libs/mixins';
  import {LogApi} from '@/component/log/api';

  export default {
    mixins: [TableResize, Log],
    data() {
      return {
        logApi: LogApi,
        logIndex: 'logs-*'
      };
    },
    methods: {
      buildFilter(query) {
        if (this.filter.logger) {
          query.push({match: {'logger': this.filter.logger}});
        }
        if (this.filter.level) {
          query.push({match: {'level': this.filter.level}});
        }
      }
    }
  };
</script>