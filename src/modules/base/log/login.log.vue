<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="登录名">
              <el-input v-model="filter.oper"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="登录时间" label-width="100px">
              <el-date-picker v-model="filter.beginTime" type="datetime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至" label-width="100px">
              <el-date-picker v-model="filter.endTime" type="datetime"></el-date-picker>
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
        <el-table-column label="序号" type="index" width="50px"></el-table-column>
        <el-table-column prop="_source.oper" label="帐号" width="100px"></el-table-column>
        <go-date-time-column label="操作日期" prop="_source.@timestamp"
                             type="datetime"></go-date-time-column>
        <el-table-column prop="_source.host" label="机器名" width="150px"></el-table-column>
        <el-table-column prop="_source.act" label="操作项" width="100px"></el-table-column>
        <el-table-column prop="_source.message" label="内容"></el-table-column>
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
        logIndex: 'biz-*'
      };
    }, methods: {
      buildFilter(query) {
        if (this.filter.oper) {
          query.push({match: {'oper': this.filter.oper}});
        }
        query.push({match: {'logger': 'oms.biz.logging.user.login'}});
      }
    }
  };
</script>