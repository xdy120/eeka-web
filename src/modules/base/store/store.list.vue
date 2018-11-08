<template>
  <el-container>
    <el-header height="35px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="编码">
              <el-input v-model="filter.storeCodes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="filter.storeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <enum-selector v-model="filter.mallType" enum-name="MallType"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="showEditor()">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <store-edit ref="editor" @ok="search"></store-edit>
      <el-table ref="dataTable" :data="list" :height="mainHeight">
        <el-table-column prop="storeCode" label="编码" sortable></el-table-column>
        <el-table-column prop="storeName" label="名称"></el-table-column>
        <el-table-column prop="nickname" label="卖家昵称"></el-table-column>
        <go-enum-column prop="mallType" label="平台类型" enum-name="MallType" width="100px"
                        sortable></go-enum-column>
        <el-table-column label="授权码">
          <template slot-scope="scope">
            <go-tooltip-button tooltip="刷新授权" icon="reset"
                               v-if="scope.row.refreshToken"></go-tooltip-button>
            <span>{{ scope.row.accessToken }}</span>
          </template>
        </el-table-column>
        <go-date-time-column prop="accessTokenExpirationTime" label="授权码期限"
                             sortable></go-date-time-column>
        <el-table-column label="令牌码">
          <template slot-scope="scope">
            <go-tooltip-button @click="accessToken(scope.row)" tooltip="授权"
                               icon="reset"></go-tooltip-button>
            <span>{{ scope.row.refreshToken }}</span>
          </template>
        </el-table-column>
        <go-date-time-column prop="refreshTokenExpirationTime" label="令牌码期限"
                             sortable></go-date-time-column>
        <go-enable-column></go-enable-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <go-toggle :value="scope.row.enable" @change="toggleEnable(scope.row)"></go-toggle>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <store-auth ref="storeAuth" @ok="search"></store-auth>
  </el-container>
</template>
<script>
  import {List, TableResize} from '@/libs/mixins';
  import StoreEdit from './store.edit.vue';
  import {StoreApi} from './api';
  import StoreAuth from './auth';

  export default {
    mixins: [List, TableResize],
    components: {StoreEdit, StoreAuth},
    data() {
      return {
        pk: 'storeId',
        api: StoreApi
      };
    },
    created() {
      this.search();
    },
    methods: {
      accessToken(store) {
        this.$refs.storeAuth.show(store);
      }
    }
  };
</script>
