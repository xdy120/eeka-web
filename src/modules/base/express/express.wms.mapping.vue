<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="快递名称">
              <el-input v-model="filter.expressName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物流接口">
              <wms-app-selector v-model="filter.wmsAppId"></wms-app-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外部编码">
              <el-input v-model="filter.outerCode"></el-input>
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
      <el-button-group>
        <el-button @click="showCreator()">新增</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="expressName" label="快递名称"></el-table-column>
        <el-table-column prop="wmsAppName" label="物流接口"></el-table-column>
        <el-table-column prop="outerCode" label="外部编码"></el-table-column>
        <go-date-time-column prop="modifiedTime" label="更新时间" sortable></go-date-time-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <ExpressMapping-creator ref="creator" @ok="search"></ExpressMapping-creator>
  </el-container>
</template>


<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {ExpressWmsMappingApi} from './api';
  import {LogPopover} from '@/component/log';
  import ExpressMappingCreator from './express.mapping.create.vue';
  import {WmsAppSelector} from '@/modules/selector';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      ExpressMappingCreator,
      LogPopover,
      WmsAppSelector
    },
    data() {
      return {
        api: ExpressWmsMappingApi,
        pk: 'expressWmsMappingId',
      };
    },
    methods: {}
  };
</script>