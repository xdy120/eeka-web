<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="模块">
              <enum-selector v-model="filter.module" enum-name="OmsModule"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人">
              <el-input v-model="filter.oper" placeholder="多个请用“,”隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作时间" label-width="100px">
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
        <el-table-column label="操作人" prop="_source.oper" width="150px"></el-table-column>
        <go-date-time-column label="操作时间" prop="_source.@timestamp"
                             type="datetime"></go-date-time-column>
        <el-table-column label="机器名" prop="_source.host" width="150px"></el-table-column>
        <el-table-column label="操作项" prop="_source.act" width="150px"></el-table-column>
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
  import {Log, TableResize} from '@/libs/mixins';
  import {LogApi} from '@/component/log';

  export default {
    mixins: [TableResize, Log],
    data() {
      return {
        logApi: LogApi,
        logIndex: 'biz-logs*'
      };
    }, methods: {
      buildFilter(query) {
        if (this.filter.module) {
          query.push({
            match: {
              'logger': `oms.biz.logging.${this.filter.module.toLowerCase().replace('_', '.')}`
            }
          });
        }
        if (this.filter.oper) {
          query.push({match: {'oper': this.filter.oper}});
        }
      }
    },
    created() {
      this.loadEnum(['OmsModule']);
    }
  };
</script>