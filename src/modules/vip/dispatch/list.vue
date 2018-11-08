<template>
  <el-container>
    <el-header class="oms-search" style="height: 70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="拣货单号">
              <el-input v-model="filter.vipDispatchCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="唯品拣货单号">
              <el-input v-model="filter.pickingCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出仓单号">
              <el-input v-model="filter.vipDeliveryCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId" mall-type="VIP"></store-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="出库状态">
              <enum-selector v-model="filter.outStatuses" multiple
                             enum-name="OutStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库">
              <virtual-warehouse-selector
                  v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="VipDispatchStatus"></enum-selector>
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
        <el-button @click="exportVipDispatch">导出</el-button>
        <el-button @click="manualDownload">下载</el-button>
        <el-button @click="batchRetryPosting">批量过账</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange"
                @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="拣货单号" prop="vipDispatchCode"
                        width="150"></go-link-column>
        <go-abnormal-column label="异常" prop="abnormal" width="50"></go-abnormal-column>
        <go-abnormal-column label="价格异常" prop="vipPriceAbnormal" width="70"></go-abnormal-column>
        <go-enum-column label="状态" prop="status" enum-name="VipDispatchStatus"
                        width="70"></go-enum-column>
        <go-enum-column label="出库状态" prop="outStatus" enum-name="OutStatus"
                        width="70"></go-enum-column>
        <go-enum-column prop="postStatus" label="过账状态" enum-name="PostStatus"
                        width="80px"></go-enum-column>
        <el-table-column label="唯品拣货单号" prop="pickingCode" width="150"></el-table-column>
        <el-table-column label="唯品仓库" prop="vipWarehouseName" width="120"></el-table-column>
        <el-table-column label="出仓单号" prop="vipDeliveryCode" width="150"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName"></el-table-column>
        <el-table-column label="仓库名称" prop="virtualWarehouseName" width="100"></el-table-column>
        <go-quantity-column label="通知数量" prop="noticeQuantity"></go-quantity-column>
        <go-quantity-column label="出库数量" prop="outQuantity"></go-quantity-column>
        <go-quantity-column label="差异数" prop="diverQuantity">
          <template slot-scope="scope">
            <span>{{scope.row.noticeQuantity-scope.row.outQuantity}}</span>
          </template>
        </go-quantity-column>
        <go-money-column label="出库金额" prop="vipAmount"></go-money-column>
        <el-table-column label="制单人" prop="creator" width="80"></el-table-column>
        <go-date-time-column label="制单时间" prop="createdTime"></go-date-time-column>
        <el-table-column label="备注" prop="remark" width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.outStatus!=='NO_OUT'"
                       @click="reposting(scope.row)">过账
            </el-button>
            <el-button type="text" v-if="scope.row.status ==='FINISH'"
                       @click="replenishment(scope.row)">补货
            </el-button>
            <go-tooltip-button type="text" v-if="scope.row.vipPriceAbnormal" :disabled="isDisable"
                               tooltip="匹配价格"
                               @click="recalculateAmount(scope.row)"></go-tooltip-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <!--<el-button type="text" v-if="scope.row.status==='ABNORMAL'" @click="matchVipProduct(scope.row)">匹配异常</el-button>-->
            <go-bind-button tooltip="绑定出仓单"
                            v-if="scope.row.status==='AUDITED'&&scope.row.abnormal===false"
                            @click="selectDelivery(scope.row)"></go-bind-button>
            <go-wms-button v-if="scope.row.status==='NOTICE_FAILED'||scope.row.status==='BIND'"
                           @click="noticeWms(scope.row)"></go-wms-button>
            <go-finish-button type="text"
                              v-if="scope.row.outStatus==='PART_OUT'&&scope.row.status!=='FINISH'"
                              @click="finish(scope.row,'此操作将完结拣货单并清除该单据所剩余的库存占用')">完结
            </go-finish-button>
            <go-cancel-button v-if="scope.row.outStatus==='NO_OUT' && scope.row.status!=='CANCELED'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <log-popover module-name="VIP_DISPATCH" :bizId="scope.row.vipDispatchId"></log-popover>
            <go-tooltip-button v-if="scope.row.abnormal" tooltip="匹配异常"
                               @click="matching(scope.row)"></go-tooltip-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <creator ref="creator" @ok="search"></creator>
    <detail-editor ref="detailEditor" @ok="search"></detail-editor>
    <dispatch-editor ref="editor" @ok="search"></dispatch-editor>
    <select-delivery ref="bing" @ok="search"></select-delivery>
    <cancel ref="cancel" @ok="search"></cancel>
    <download ref="download"></download>
    <batch-processor ref="batchProcessor" @finish="search"></batch-processor>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {LogPopover} from '@/component/log';
  import {Placeholders} from '@/libs/util';
  import {StoreSelector, VirtualWarehouseSelector} from '@/modules/selector';
  import DetailEditor from './detail.edit.vue';
  import DispatchEditor from './edit.vue';
  import Creator from './create.vue';
  import {BatchProcessor} from '@/component/ui';
  import {VipDispatchApi} from './api';
  import SelectDelivery from './select.delivery';
  import Cancel from './cancel';
  import Download from './download';

  export default {
    name: 'VipDispatch',
    mixins: [TableResize, List, PageList],
    components: {
      Creator, DetailEditor, LogPopover, SelectDelivery,
      DispatchEditor, VirtualWarehouseSelector, StoreSelector, Cancel, Download,BatchProcessor
    },
    data() {
      return {
        api: VipDispatchApi,
        pk: 'vipDispatchId',
        codeProp: 'vipDispatchCode',
        Placeholders,
        isDisable: false
      };
    },
    methods: {
      cancel(row) {
        this.$refs.cancel.show(row);
      },
      selectDelivery(row) {
        this.$refs.bing.show(row);
      },
      noticeWms(row) {
        VipDispatchApi.noticeWms(row).then(() => {
          this.$message.success('推送成功！');
          this.search();
        });
      },
      exportVipDispatch() {
        this.exportData(value => this.api.exportDispatch(value, this.filter));
      },
      matching(row) {
        this.$confirm('自动匹配异常商品？').then(() => {
          this.api.match(row[this.pk], row).then(() => {
            this.$message.success('后台匹配中...');
            this.clickSearch();
          });
        });
      },
      manualDownload() {
        this.$refs.download.show();
      },
      recalculateAmount(row) {
        this.isDisable = true;
        this.api.recalculateAmount(row[this.pk], row).then(() => {
          this.$message.success('后台匹配中...');
          this.isDisable = false;
          this.search();
        }).catch(() => {
          this.isDisable = false;
        });
      },
      reposting(row) {
        this.api.reposting(row).then(this.showSuccess);
      },
      batchRetryPosting() {
        this.doBatch('VIP拣货单批量过账', item => {
          return VipDispatchApi.reposting(item);
        }, x => x.outStatus !=='NO_OUT');
      },
      replenishment(row) {
        VipDispatchApi.replenishment(row.vipDispatchId).then(result => {
          this.$refs.creator.replenishment(result);
        });
      }
    },
  };
</script>