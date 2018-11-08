<template>
  <el-container>
    <el-header class="oms-search" height="30px">
      <el-form ref="filter" :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="调整单号">
              <el-input v-model="filter.vipAdjustCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="档期编号">
              <el-input v-model="filter.vipScheduleCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
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
        <!--<el-button @click="downloadTemplate">下载模板</el-button>-->
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="调整单号" prop="vipAdjustCode"
                        width="140"></go-link-column>
        <go-enum-column label="状态" prop="status" enum-name="VipAdjustStatus"></go-enum-column>
        <go-boolean-column label="需上传" width="100" prop="upload"></go-boolean-column>
        <el-table-column label="档期编号" prop="vipScheduleCode" width="150"></el-table-column>
        <go-enum-column label="调整类型" prop="adjustType" enum-name="VipAdjustType"
                        width="120"></go-enum-column>
        <el-table-column label="调整原因" prop="adjustReason" width="120"></el-table-column>
        <go-date-time-column label="更新时间" prop="modifiedTime" width="120"></go-date-time-column>
        <el-table-column label="制单人" prop="creator" width="120"></el-table-column>
        <go-date-time-column label="制单时间" prop="createdTime" width="120"></go-date-time-column>
        <el-table-column label="审核人" prop="auditor" width="120"></el-table-column>
        <go-date-time-column label="审核时间" prop="auditedTime" width="120"></go-date-time-column>
        <el-table-column label="备注" prop="remark" width="120"></el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status === 'CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status === 'CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <go-tooltip-button v-if="scope.row.status === 'AUDITED'" tooltip="上传"
                               icon="upload"
                               @click="upload(scope.row)"></go-tooltip-button>
            <go-tooltip-button v-if="scope.row.status === 'UPLOADED'" tooltip="结束"
                               icon="end"
                               @click="end(scope.row)"></go-tooltip-button>
            <log-popover module-name="VIP_ADJUST" :bizId="scope.row.vipScheduleId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <adjust-creator ref="creator" @ok="search"></adjust-creator>
    <adjust-editor ref="editor" @ok="search"></adjust-editor>
    <detail-editor ref="detailEditor" @ok="search"></detail-editor>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins/index';
  import {LogPopover} from '@/component/log/index';
  import {Placeholders} from '@/libs/util';
  import DetailEditor from './detail.edit.vue';
  import AdjustEditor from './edit.vue';
  import AdjustCreator from './create.vue';
  import {VipAdjustApi} from './api';

  export default {
    name: 'Adjust',
    mixins: [TableResize, List, PageList],
    components: {
      AdjustCreator, DetailEditor, AdjustEditor, LogPopover
    },
    data() {
      return {
        api: VipAdjustApi,
        pk: 'vipAdjustId',
        Placeholders
      };
    },
    methods: {
      upload(selected) {
        VipAdjustApi.upload(selected.vipScheduleId).then(this.search);
      },
    },
    created() {
    }
  };
</script>