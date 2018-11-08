<template>
  <el-container>
    <el-header class="oms-search" style="height: 70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="filter.vipScheduleCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据名称">
              <el-input v-model="filter.vipScheduleName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库仓库">
              <virtual-warehouse-selector
                  v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="VipScheduleStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格名称">
              <el-input v-model="filter.skuName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
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
        <el-button @click="showCreator">新增</el-button>
        <el-button @click="derive">导出</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange">
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <go-link-column @click="showDetailEditor" label="档期编号" prop="vipScheduleCode"
                        width="140"></go-link-column>
        <go-enum-column label="状态" prop="status" enum-name="VipScheduleStatus"></go-enum-column>
        <go-boolean-column label="需上传" width="100" prop="upload"></go-boolean-column>
        <el-table-column label="店铺名称" width="150" prop="storeName"></el-table-column>
        <el-table-column label="单据名称" width="150" prop="vipScheduleName"></el-table-column>
        <el-table-column label="仓库名称" width="150" prop="virtualWarehouseName"></el-table-column>
        <go-date-time-column label="开始时间" prop="beginTime"></go-date-time-column>
        <go-date-time-column label="结束时间" prop="endTime"></go-date-time-column>
        <el-table-column label="货值" prop="goodsValue"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column prop="creator" label="制单人" width="100"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <el-table-column prop="auditor" label="审核人" width="100"></el-table-column>
        <go-date-time-column prop="auditedTime" label="审核时间"></go-date-time-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status === 'CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <go-tooltip-button v-if="scope.row.status === 'AUDITED'" tooltip="上传" icon="upload"
                               @click="upload(scope.row)"></go-tooltip-button>
            <go-tooltip-button v-if="scope.row.status === 'UPLOADED'" tooltip="结束" icon="end"
                               @click="end(scope.row)"></go-tooltip-button>
            <log-popover module-name="VIP_SCHEDULE" :bizId="scope.row.vipScheduleId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <creator ref="creator" @ok="search"></creator>
    <schedule-editor ref="editor" @ok="search"></schedule-editor>
    <detail-editor ref="detailEditor" @ok="search"></detail-editor>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {LogPopover} from '@/component/log';
  import {Placeholders} from '@/libs/util';
  import {VirtualWarehouseSelector} from '@/modules/base';
  import DetailEditor from './detail.edit.vue';
  import ScheduleEditor from './edit.vue';
  import Creator from './create.vue';
  import {VipScheduleApi} from './api';

  export default {
    name: 'Schedule',
    mixins: [TableResize, List, PageList],
    components: {
      Creator, VirtualWarehouseSelector, DetailEditor, LogPopover, ScheduleEditor
    },
    data() {
      return {
        api: VipScheduleApi,
        pk: 'vipScheduleId',
        Placeholders
      };
    },
    methods: {
      derive() {
      },
      upload(selected) {
        this.api.upload(selected.vipScheduleId, selected).then(this.search);
      },
      end(selected) {
        this.api.end(selected.vipScheduleId, selected).then(this.search);
      },
    },
    created() {
    }
  };
</script>