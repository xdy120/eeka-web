<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="手机">
              <el-input v-model="filter.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="昵称">
              <el-input v-model="filter.memberName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人">
              <el-input v-model="filter.contacts" placeholder="支持多个，用空格隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeIds"></store-selector>
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
      <el-button @click="showEditor()">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
        <go-boolean-column label="默认加急" prop="urgent" width="80px"></go-boolean-column>
        <go-enum-column label="状态" prop="status" enum-name="MemberStatus"
                        width="80px"></go-enum-column>
        <el-table-column label="店铺" prop="storeName" width="150px"></el-table-column>
        <el-table-column label="昵称" prop="memberName" width="150px"></el-table-column>
        <go-enum-column label="性别" prop="sex" enum-name="SexType"></go-enum-column>
        <el-table-column label="区域">
          <template slot-scope="scope">
            {{scope.row.countryName}}/{{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.districtName}}
          </template>
        </el-table-column>
        <go-date-time-column label="修改时间" prop="modifiedTime" sortable/>
        <go-date-time-column label="创建时间" prop="createdTime" sortable/>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom">
              <go-modify-button type="text" @click="showEditor(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <member-editor ref="editor" @ok="search"/>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import MemberEditor from './editor.vue';
  import {MemberSelector, StoreSelector} from '@/modules/selector';
  import {MemberApi} from './api';

  export default {
    mixins: [TableResize, List, PageList],
    components: {MemberEditor, MemberSelector, StoreSelector},
    data() {
      return {
        pk: 'memberId',
        api: MemberApi,
      };
    }
  };
</script>