<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="供应商编码">
              <el-input v-model="filter.supplierCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称">
              <el-input v-model="filter.supplierName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商简称">
              <el-input v-model="filter.supplierShortName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结算方式">
              <enum-selector v-model="filter.supplierSettlementType"
                             enum-name="SupplierSettlementType"></enum-selector>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="公司名称">
              <el-input v-model="filter.companyName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人">
              <el-input v-model="filter.contact" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机">
              <el-input v-model="filter.mobile" placeholder="精确匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电话号码">
              <el-input v-model="filter.telephone" placeholder="精确匹配"></el-input>
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
      <el-button @click="showEditor(null)">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-enum-column prop="status" enum-name="SupplierStatus" label="状态"></go-enum-column>
        <el-table-column label="供应商编码" prop="supplierCode" width="160"></el-table-column>
        <el-table-column label="供应商名称" prop="supplierName" width="120"></el-table-column>
        <el-table-column label="供应商简称" prop="supplierShortName" width="120"></el-table-column>
        <go-enum-column label="结算方式" prop="supplierSettlementType"
                        enum-name="SupplierSettlementType" width="120">
        </go-enum-column>
        <el-table-column label="公司名称" prop="companyName" width="150"></el-table-column>
        <el-table-column label="电话" prop="telephone" width="120"></el-table-column>
        <el-table-column label="手机" prop="mobile" width="120"></el-table-column>
        <el-table-column label="联系人" prop="contact" width="120"></el-table-column>
        <el-table-column prop="creator" label="创建人" width="120"></el-table-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <el-table-column label="审核人" prop="auditor" width="120"></el-table-column>
        <go-date-time-column label="审核时间" prop="auditedTime"></go-date-time-column>
        <go-date-time-column label="更新时间" prop="modifiedTime"></go-date-time-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row,null)"></go-audit-button>
            <el-button type="text" v-if="scope.row.status === 'AUDITED'"
                       @click="resetAudit(scope.row)">反审核
            </el-button>
            <log-popover module-name="PURCHASE_SUPPLIER"
                         :bizId="scope.row.supplierId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <!--修改新增界面-->
    <supplier-editor ref="editor"></supplier-editor>
  </el-container>
</template>
<script>
  import {SupplierApi} from '../api';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import SupplierEditor from './edit.vue';
  import {LogPopover} from '@/component/log';

  export default {
    name: 'Supplier',
    mixins: [List, PageList, TableResize],
    components: {
      LogPopover,
      SupplierEditor
    },
    data() {
      return {
        api: SupplierApi,
        pk: 'supplierId',
      };
    },
    methods: {
      resetAudit(row) {
        this.$confirm('是否反审核？').then(() => {
          let entity = {};
          entity[this.pk] = row[this.pk];
          this.api.resetAudit(row[this.pk]).then(() => {
            this.$message.success('反审核成功');
            this.search();
          });
        });
      }
    },
  };
</script>