<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="快递">
              <express-selector v-model="filter.expressId"
                                :expressName.sync="filter.expressName"
                                :outFilter="expressFilter"></express-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快递单号">
              <el-input v-model="filter.expressNos" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="ReturnSignStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人">
              <user-selector :nickname.sync="filter.creator" :isDefaultValue="false"
                             placeholder="请选择创建人"></user-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="制单时间">
              <div class="block">
                <span class="demonstration"></span>
                <go-date-time-picker v-model="filter.createdTimeBegin"></go-date-time-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至">
              <div class="block">
                <span class="demonstration"></span>
                <go-date-time-picker v-model="filter.createdTimeEnd"></go-date-time-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拆包时间">
              <div class="block">
                <span class="demonstration"></span>
                <go-date-time-picker v-model="filter.auditedTimeBegin"></go-date-time-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至">
              <div class="block">
                <span class="demonstration"></span>
                <go-date-time-picker v-model="filter.auditedTimeEnd"></go-date-time-picker>
              </div>
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
        <el-button @click="exportSignData()">导出</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <go-enum-column label="状态" prop="status" enum-name="ReturnSignStatus"
                        fixed></go-enum-column>
        <el-table-column label="物流公司" prop="expressName"></el-table-column>
        <el-table-column label="快递单号" prop="expressNo"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="创建人" prop="creator"></el-table-column>
        <el-table-column label="制单时间" prop="createdTime"></el-table-column>
        <el-table-column label="审核人" prop="auditor"></el-table-column>
        <!--拆包时间就是审核时间-->
        <go-date-time-column label="拆包时间" prop="auditedTime"></go-date-time-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <go-invalid-button @click="invalid(scope.row)"
                               v-if="scope.row.status==='CREATED'"></go-invalid-button>
            <log-popover module-name="RETURN_SIGN" :bizId="scope.row.returnSignId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <sign-creator ref="creator" @ok="search"></sign-creator>
  </el-container>
</template>
<script>
  import {ReturnSignApi} from '../api';
  import {ExpressSelector, UserSelector} from '@/modules/base/index';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import SignCreator from './sign.create.vue';
  import {LogPopover} from '@/component/log';

  export default {
    name: 'ReturnSign',
    mixins: [List, PageList, TableResize],
    components: {
      UserSelector, ExpressSelector, SignCreator, LogPopover
    },
    props: {},
    data() {
      return {
        api: ReturnSignApi,
        pk: 'returnSignId',
        expressFilter: {
          expressUses: 'AFTER_SALE,ALL'
        }
      };
    },
    methods: {
      exportSignData(){
        this.exportData(value=>this.api.exportData(value, this.filter));
      }
    },
  };
</script>