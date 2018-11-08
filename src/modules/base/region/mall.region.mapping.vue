<template>
  <el-container>
    <el-header height="35px">
      <el-form ref="filterForm" :model="filter" @submit.native.prevent="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="区域名称">
              <el-input v-model="filter.mallRegionAlias" placeholder="支持右侧模糊匹配"/>
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
      <el-button-group>
        <el-button @click="showEditor()">新增</el-button>
      </el-button-group>
    </el-header>
    <el-main>
      <el-table ref="dataTable" :data="list" style="text-align: center">
        <el-table-column prop="mallRegionAlias" label="商城区域名称" width="500"></el-table-column>
        <el-table-column prop="provinceName" label="省"></el-table-column>
        <el-table-column prop="cityName" label="市"></el-table-column>
        <el-table-column prop="districtName" label="区"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row.mallRegionMappingId)"></go-modify-button>
            <go-delete-button @click="remove(scope.row)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height>
      <el-pagination :total="total" :page-size="paging.pageSize"
                     :current-page.sync="paging.page" @current-change="search"
                     @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <mall-region-mapping-editor ref="editor" @ok="search"/>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {MallRegionMappingApi} from './api';
  import MallRegionMappingEditor from './mall.region.mapping.edit';

  export default {
    mixins: [List, TableResize, PageList],
    components: {MallRegionMappingEditor},
    data() {
      return {
        pk: 'mallRegionMappingId',
        api: MallRegionMappingApi
      };
    },
    created() {
      this.search();
    },
    methods: {
      showEditor(id) {
        this.$refs.editor.show(id);
      }
    }
  };
</script>