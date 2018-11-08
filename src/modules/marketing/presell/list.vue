<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="预售编号">
              <el-input v-model="filter.presellCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预售名称">
              <el-input v-model="filter.presellName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预售店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="PresellStatus"></enum-selector>
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
        <go-link-column prop="presellCode" label="预售编号" @click="showDetail"></go-link-column>
        <go-enum-column prop="status" label="状态" enum-name="PresellStatus"
                        width="70px"></go-enum-column>
        <go-boolean-column prop="dynamic" label="动态预售" width="70px"></go-boolean-column>
        <el-table-column prop="presellName" label="预售名称" width="120"></el-table-column>
        <go-date-time-column prop="beginTime" label="开始时间"></go-date-time-column>
        <go-date-time-column prop="endTime" label="结束时间"></go-date-time-column>
        <go-date-time-column prop="deliveryDate" label="发货时间"></go-date-time-column>
        <el-table-column prop="creator" label="制单人" width="120"></el-table-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <el-table-column prop="auditor" label="审核人" width="120"></el-table-column>
        <go-date-time-column prop="auditedTime" label="审核时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
        <el-table-column prop="remark" label="备注" width="120"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200px">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <go-begin-button v-if="scope.row.status==='AUDITED'"
                             @click="begin(scope.row)" :disabled="loading"></go-begin-button>
            <go-end-button v-if="scope.row.status==='BEGIN'"
                           @click="end(scope.row)" :disabled="loading"></go-end-button>
            <go-invalid-button v-if="canInvalid(scope.row)"
                               @click="invalid(scope.row)"></go-invalid-button>
            <el-button type="text" @click="adjustQuantity(scope.row)"
                       v-if="scope.row.status==='BEGIN'">调整数量</el-button>
            <log-popover module-name="MARKETING_PRESELL" :bizId="scope.row.presellId"></log-popover>
            <el-button type="text" @click="exportPresell(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="35px">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <presell-creator ref="creator" @ok="search"></presell-creator>
    <presell-editor ref="editor" @ok="search"></presell-editor>
    <detail-edit ref="detailEditor" @ok="search"></detail-edit>
    <store-edit ref="store"></store-edit>
    <store-detail ref="storeDetail"></store-detail>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/base/index';
  import {PresellApi} from './api';
  import PresellEditor from './edit.vue';
  import PresellCreator from './create.vue';
  import DetailEdit from './detail.edit.vue';
  import StoreEdit from './store.edit.vue';
  import {LogPopover} from '@/component/log';
  import StoreDetail from './store.detail.vue';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'Presell',
    mixins: [List, PageList, TableResize],
    components: {
      StoreDetail, StoreSelector, PresellCreator, PresellEditor, DetailEdit, StoreEdit, LogPopover
    },
    data() {
      return {
        api: PresellApi,
        pk: 'presellId',
        exportfilter: {},
        ValidateRules: ValidateRules,
        dialogFormVisible: false,
        exportRules: {
          presellCode: ValidateRules.required,
          fileName: ValidateRules.requiredFileName
        },
        loading: false
      };
    },
    methods: {
      begin(row) {
        this.$confirm('开始预售会重新同步店铺库存，确定要开始预售吗？').then(() => {
          this.loading = true;
          PresellApi.begin(this.buildBO(row)).then(r => {
            this.$message.success('预售活动操作成功');
            this.loading = false;
            this.search();
          }).catch(() => {
            this.loading = false;
          });
        });
      },
      end(row) {
        this.$confirm('确定要结束预售吗？').then(() => {
          this.loading = true;
          PresellApi.end(this.buildBO(row)).then(r => {
            this.$message.success('预售活动操作成功');
            this.loading = false;
            this.search();
          }).catch(() => {
            this.loading = false;
          });
        });
      },
      buildBO(row) {
        return {presellId: row.presellId, version: row.version};
      },
      showDetail(row) {
        if (row.status === 'CREATED' || row.status === 'AUDITED') {
          this.showDetailEditor(row);
        } else {
          this.$refs.storeDetail.show(row);
        }
      },
      adjustQuantity(row){
        this.showDetailEditor(row);
      },
      canInvalid(row) {
        return row.status === 'CREATED' || row.status === 'AUDITED';
      },
      exportPresell(row) {
        let param = {};
        param.presellId = row.presellId;
        this.exportData(value => this.api.exportPresell(value, param));
      }
    }
  };
</script>
