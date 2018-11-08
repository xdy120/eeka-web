<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="快递编码">
              <el-input v-model="filter.expressCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快递名称">
              <el-input v-model="filter.expressName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="付款类型">
              <enum-selector v-model="filter.codType" enum-name="CodType"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快递用途">
              <enum-selector v-model="filter.expressUse" enum-name="ExpressUse"></enum-selector>
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
        <el-button @click="showCreator()" >新增</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="expressName" label="快递名称"></el-table-column>
        <el-table-column prop="expressCode" label="快递编码"></el-table-column>
        <el-table-column prop="globalExpressName" label="标准快递" width="100px"></el-table-column>
        <go-enum-column prop="expressUse" label="快递用途" width="120px"
                        enum-name="ExpressUse"></go-enum-column>
        <go-enum-column prop="codType" label="到付类型" width="120px"
                        enum-name="CodType"></go-enum-column>
        <go-enum-column prop="waybillType" label="面单类型" width="120px"
                        enum-name="WaybillType"></go-enum-column>
        <go-quantity-column prop="orderId" label="排序号" width="70px"></go-quantity-column>
        <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
        <go-boolean-column prop="checkRegion" label="校验范围" width="70px"></go-boolean-column>
        <go-enable-column></go-enable-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <el-button type="text" @click="region(scope.row)">范围</el-button>
            <go-toggle :value="scope.row.enable" @change="toggleEnable(scope.row)"></go-toggle>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <express-creator ref="creator" :title="'编辑'" @ok="search"></express-creator>
    <region ref="region"></region>
  </el-container>
</template>


<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {ExpressApi} from './api';
  import ExpressCreator from './create.vue';
  import Region from './region.vue';

  export default {
    name: 'warehouse',
    mixins: [TableResize, List, PageList],
    components: {Region, ExpressCreator},
    data() {
      return {
        api: ExpressApi,
        pk: 'expressId',
      };
    },
    created() {
      this.search();
    },
    methods: {
      region(id) {
        if (this.$refs.region) {
          this.$refs.region.show(id);
        }
      }
    }
  };
</script>