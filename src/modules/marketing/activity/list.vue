<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="filter.activityCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="活动名称">
              <el-input v-model=" filter.activityName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="ActivityStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="活动类型">
              <data-dict-item-selector v-model="filter.activityType"
                                       :dataDictId="10401"></data-dict-item-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="占用仓库">
              <virtual-warehouse-selector
                  v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <!--<el-col :span="6">-->
          <!--<el-form-item label="锁定数上传">-->
          <!--<three-checkbox v-model="filter.useLockQuantity"></three-checkbox>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="6">-->
          <!--<go-tooltip-button icon="advance-search" tooltip="高级搜索"-->
          <!--v-popover:advanceQuery></go-tooltip-button>-->
          <!--</el-col>-->
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
        <go-link-column @click="showDetailEditor" label="活动编号" prop="activityCode"
                        width="140"></go-link-column>
        <go-enum-column prop="status" min-width="80" enum-name="ActivityStatus"
                        label="状态"></go-enum-column>
        <el-table-column prop="activityType" label="活动类型" min-width="120"></el-table-column>
        <el-table-column prop="activityName" label="活动名称" min-width="120"></el-table-column>
        <el-table-column prop="storeName" label="店铺名称" min-width="120"></el-table-column>
        <el-table-column prop="virtualWarehouseName" label="占用仓库" min-width="120"></el-table-column>
        <go-date-time-column prop="beginTime" label="开始时间" sortable></go-date-time-column>
        <go-date-time-column prop="endTime" label="结束时间" sortable></go-date-time-column>
        <go-money-column prop="goodsValue" label="总金额"></go-money-column>
        <el-table-column prop="creator" label="制单人" min-width="120"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间" sortable></go-date-time-column>
        <el-table-column prop="auditor" label="审核人" min-width="120"></el-table-column>
        <go-date-time-column prop="auditedTime" label="审核时间" sortable></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间" sortable></go-date-time-column>
        <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="200">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-invalid-button v-if="canInvalid(scope.row)"
                               @click="invalid(scope.row)"></go-invalid-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row,'此操作将审核该活动报名')"></go-audit-button>
            <el-button type="text" v-if="scope.row.status==='AUDITED'" @click="begin(scope.row)">
              开始
            </el-button>
            <el-button type="text" v-if="scope.row.status==='BEGIN'" @click="end(scope.row)">结束
            </el-button>
            <el-button type="text" v-if="scope.row.status==='AUDITED'"
                       @click="occupancy(scope.row)">补充占用
            </el-button>
            <log-popover module-name="MARKETING_ACTIVITY"
                         :bizId="scope.row.activityId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <activity-creator ref="creator" @ok="search"></activity-creator>
    <activity-editor ref="editor" @ok="search"></activity-editor>
    <!--活动报名明细编辑界面-->
    <detail-edit ref="detailEditor" v-on:search="search"></detail-edit>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {
    DataDictItemSelector,
    StoreSelector,
    VirtualWarehouseSelector
  } from '@/modules/base/index';
  import ActivityCreator from './create.vue';
  import ActivityEditor from './edit.vue';
  import DetailEdit from './detail.edit.vue';
  import {ActivityApi} from './api';
  import {LogPopover} from '@/component/log';
  import AdvanceQuery from './advance.query.vue';

  export default {
    name: 'Activity',
    mixins: [List, PageList, TableResize],
    components: {
      AdvanceQuery,
      DataDictItemSelector,
      StoreSelector,
      ActivityCreator,
      ActivityEditor,
      DetailEdit,
      LogPopover,
      VirtualWarehouseSelector
    },
    data() {
      return {
        placeholder: '请选择',
        api: ActivityApi,
        pk: 'activityId',
      };
    },
    methods: {
      begin(row) {
        this.$confirm('开始活动后会同步库存到电商平台，同时关闭铺货关系的自动上传，活动结束前不在自动同步库存，是否继续？').then(() => {
          this.convertForm(row);
          ActivityApi.begin(row.activityId, row).then(() => {
            this.$message.success('开始活动成功');
            this.search();
          });
        });
      },
      end(row) {
        this.$confirm('结束活动后会打开铺货关系的自动上传，随后会同步一次可销库存到电商平台，是否继续？').then(() => {
          this.convertForm(row);
          ActivityApi.end(this.form.activityId, this.form).then(() => {
            this.$message.success('结束活动成功');
            this.search();
          });
        });
      },
      convertForm(row) {
        this.form = {};
        this.form.activityId = row.activityId;
        this.form.version = row.version;
      },
      occupancy(row) {
        this.$confirm('补充占用会将未满足计划数量的商品重新占用至计划数量，是否继续？').then(() => {
          this.convertForm(row);
          ActivityApi.occupancy(this.form.activityId, this.form).then(() => {
            this.$message.success('补充库存占用成功');
            this.search();
          });
        });
      },
      canInvalid(row) {
        return row.status === 'CREATED' || row.status === 'AUDITED';
      }
    }
  };
</script>