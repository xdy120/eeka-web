<template>
  <el-container>
    <el-header class="oms-search" height="120">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="退货通知单号">
              <el-input v-model="filter.vipReturnNoticeCodes"
                        :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId" mall-type="VIP"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库">
              <warehouse-selector v-model="filter.warehouseId"></warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="VipReturnNoticeStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="入库状态">
              <enum-selector v-model="filter.inStatuses" multiple
                             enum-name="InStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退货单编码">
              <el-input v-model="filter.vipReturnCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <go-toggle v-model="advanceQueryVisible" on-text="高级查询" off-text="简单查询"
                       :show-text="true"
                       :show-icon="false"></go-toggle>
          </el-col>
        </el-row>
        <template v-if="advanceQueryVisible">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="制单时间">
                <div class="block">
                  <span class="demonstration"></span>
                  <go-date-time-picker v-model="filter.createdTimeBegin"></go-date-time-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="至">
                <div class="block">
                  <span class="demonstration"></span>
                  <go-date-time-picker v-model="filter.createdTimeEnd"></go-date-time-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="制单人">
                <el-input v-model="filter.creator" :placeholder="Placeholders.LIKE"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="最后入库时间">
                <div class="block">
                  <span class="demonstration"></span>
                  <go-date-time-picker v-model="filter.lastInTimeBegin"></go-date-time-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="至">
                <div class="block">
                  <span class="demonstration"></span>
                  <go-date-time-picker v-model="filter.lastInTimeEnd"></go-date-time-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="exportVipReturnNoticeData">导出</el-button>
        <el-button @click="batchRetryPosting">批量过账</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange"
                @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="退货通知单号" prop="vipReturnNoticeCode"
                        width="140"></go-link-column>
        <go-abnormal-column label="唯品价异常" prop="vipPriceAbnormal" width="100"></go-abnormal-column>
        <go-enum-column label="状态" prop="status" enum-name="VipReturnNoticeStatus"></go-enum-column>
        <go-enum-column label="入库状态" prop="inStatus" enum-name="InStatus"
                        width="120px"></go-enum-column>
        <go-enum-column prop="postStatus" label="过账状态" enum-name="PostStatus"
                        width="80px"></go-enum-column>
        <el-table-column label="店铺名称" prop="storeName"></el-table-column>
        <el-table-column label="仓库名称" prop="warehouseName"></el-table-column>
        <go-quantity-column label="通知数量" prop="noticeQuantity"></go-quantity-column>
        <go-quantity-column label="入库数量" prop="inQuantity"></go-quantity-column>
        <go-money-column label="入库金额" prop="vipAmount"></go-money-column>
        <go-date-time-column label="最后入库时间" prop="lastInTime"></go-date-time-column>
        <el-table-column label="制单人" prop="creator" width="100"></el-table-column>
        <go-date-time-column label="制单时间" prop="createdTime"></go-date-time-column>
        <go-date-time-column label="更新时间" prop="modifiedTime"></go-date-time-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.inStatus!=='NO_IN'"
                       @click="reposting(scope.row)">过账
            </el-button>
            <go-tooltip-button v-if="scope.row.vipPriceAbnormal" tooltip="匹配价格"
                               :disabled="isDisable"
                               @click="recalculateAmount(scope.row)"></go-tooltip-button>
            <go-wms-button v-if="scope.row.status==='CREATED'||scope.row.status==='NOTICE_FAILED'"
                           @click="noticeWms(scope.row)"></go-wms-button>
            <go-cancel-button v-if="scope.row.status!=='CANCELED' && scope.row.status!=='FINISH'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <go-finish-button v-if="scope.row.inStatus==='PART_IN' && scope.row.status!=='FINISH'"
                              @click="finish(scope.row)"></go-finish-button>
            <log-popover module-name="VIP_RETURN_NOTICE"
                         :bizId="scope.row.vipReturnNoticeId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <detail-editor ref="detailEditor" @ok="search"></detail-editor>
    <cancel ref="cancel" @ok="doSuccess"></cancel>
    <batch-processor ref="batchProcessor" @finish="search"></batch-processor>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {LogPopover} from '@/component/log';
  import {Placeholders} from '@/libs/util';
  import {StoreSelector, WarehouseSelector} from '@/modules/selector';
  import DetailEditor from './detail.edit.vue';
  import {BatchProcessor} from '@/component/ui';
  import {VipReturnNoticeApi} from './api';
  import Cancel from './cancel';

  export default {
    name: 'VipReturnNotice',
    mixins: [TableResize, List, PageList],
    components: {DetailEditor, LogPopover, WarehouseSelector, StoreSelector, Cancel,BatchProcessor},
    data() {
      return {
        api: VipReturnNoticeApi,
        pk: 'vipReturnNoticeId',
        codeProp: 'vipReturnNoticeCode',
        Placeholders,
        isDisable: false
      };
    },
    methods: {
      noticeWms(row) {
        VipReturnNoticeApi.noticeWms(row).then(this.doSuccess).then(this.clickSearch);
      },
      cancel(row) {
        this.$refs.cancel.show(row);
      },
      recalculateAmount(row) {
        this.isDisable = true;
        this.api.recalculateAmount(row[this.pk], row).then(() => {
          this.$message.success('后台匹配中...');
          this.isDisable = false;
          this.search();
        }).catch(()=>{
          this.isDisable = false;
        });
      },
      reposting(row) {
        this.api.reposting(row).then(this.showSuccess);
      },
      exportVipReturnNoticeData(){
        this.exportData(value=>this.api.exportData(value, this.filter));
      },
      batchRetryPosting() {
        this.doBatch('VIP退货通知单批量过账', item => {
          return VipReturnNoticeApi.reposting(item);
        }, x => x.inStatus !== 'NO_IN');
      }
    }
  };
</script>