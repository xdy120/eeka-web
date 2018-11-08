<template>
  <el-container>
    <el-header class="oms-search no-print" height="80">
      <el-form ref="filter" :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="通知单号">
              <el-input v-model="filter.returnNoticeOrderCodes"
                        :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退入仓库">
              <warehouse-selector v-model="filter.warehouseId"></warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="ReturnNoticeOrderStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库状态">
              <enum-selector v-model="filter.inStatuses" multiple
                             enum-name="InStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制单人" label-width="100px">
              <el-input v-model="filter.creator" :placeholder="Placeholders.LIKE"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退换货单编号" label-width="100px">
              <el-input v-model="filter.returnOrderCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action no-print">
      <el-row>
        <el-col :span="10">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>

          <el-button-group>
            <el-button @click="batchNoticeWms">批量重推</el-button>
            <el-button @click="batchCancel">批量取消</el-button>
            <el-button @click="batchRetryPosting">批量过账</el-button>
            <el-button @click="exportReturnNoticeData">导出</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-resize="mainHeight" class="no-print">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange"
                @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <go-link-column @click="showDetailEditor" label="通知单号" prop="returnNoticeOrderCode"
                        width="140"></go-link-column>
        <go-enum-column label="状态" prop="status"
                        enum-name="ReturnNoticeOrderStatus"></go-enum-column>
        <go-enum-column label="入库状态" prop="inStatus" width="150px"
                        enum-name="InStatus"></go-enum-column>
        <go-enum-column prop="postStatus" label="过账状态" enum-name="PostStatus"
                        width="80px"></go-enum-column>
        <el-table-column prop="warehouseName" label="退入仓库"></el-table-column>
        <el-table-column prop="inQuantity" label="入库数量"></el-table-column>
        <el-table-column prop="boxNo" label="包裹号"></el-table-column>
        <go-date-time-column prop="lastInTime" label="最后入库时间"></go-date-time-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="creator" label="制单人"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <go-print-button @click="print(scope.row)"></go-print-button>
            <go-wms-button v-if="scope.row.status==='CREATED'||scope.row.status==='NOTICE_FAILED'"
                           @click="noticeWms(scope.row)"></go-wms-button>
            <go-cancel-button v-if="scope.row.status!=='CANCELED'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <el-button type="text" v-if="scope.row.status==='NOTICED'"
                       @click="reposting(scope.row)">过账
            </el-button>
            <log-popover module-name="RETURN_NOTICE"
                         :bizId="scope.row.returnNoticeOrderId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="35px" class="no-print">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <!--通知单明细查看界面-->
    <notice-detail class="no-print" ref="detailEditor" @ok="search"></notice-detail>
    <batch-processor class="no-print" ref="batchProcessor" @finish="search"></batch-processor>
    <print ref="printWin">
      <template slot-scope="scope">
        <div style="float: left;height: 100px;width: 700px;">
                    <span
                        style="font-size: 28px;position:relative;top: 30px;left: 60px; width: 300px">
                        B2C销售退货通知单
                    </span>
          <span style="font-size: 30px;position:absolute;left: 350px;">
                        <barcode ref="barcode" :content="scope.data.returnNoticeOrderCode"
                                 :text="scope.data.returnNoticeOrderCode"/>
                    </span>
        </div>
        <div style="float: left; height: 50px;width: 677px;">
          <el-table :data="printRow">
            <el-table-column prop="createdTime" width="135px" style="height: 30px"
                             label="退货时间"></el-table-column>
            <el-table-column prop="warehouseName" width="125px" label="退入仓库"></el-table-column>
            <el-table-column prop="returnNoticeOrderCode" width="135px"
                             label="退货单号"></el-table-column>
            <el-table-column prop="inQuantity" width="55px" label="数量"></el-table-column>
            <el-table-column prop="creator" width="75px" label="收货人"></el-table-column>
            <el-table-column prop="remark" width="150px" label="备注"/>
          </el-table>
        </div>
        <div style="width: 600px;position: absolute;top:300px;left:100px;">
          <div>
            <div class="creator">
              <td>签收人:</td>
            </div>
            <div class="creator">
              <td>复核人:</td>
            </div>
            <div class="creator">
              <td>经手人:</td>
            </div>
          </div>
        </div>
      </template>
    </print>
  </el-container>
</template>
<style>
  .creator {
    width: 200px;
    float: right;
  }
</style>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {UserSelector, WarehouseSelector} from '@/modules/base/index';
  import {Barcode, BatchProcessor, Print} from '@/component';
  import {ReturnNoticeOrderApi} from './api';
  import NoticeDetail from './detail.vue';
  import {LogPopover} from '@/component/log';
  import {Placeholders } from '@/libs/util';
  export default {
    name: 'ReturnNotice',
    mixins: [List, PageList, TableResize],
    components: {
      UserSelector,
      WarehouseSelector,
      NoticeDetail,
      LogPopover,
      BatchProcessor,
      Print,
      Barcode
    },
    data() {
      return {
        api: ReturnNoticeOrderApi,
        pk: 'returnNoticeOrderId',
        codeProp:'returnNoticeOrderCode',
        Placeholders,
        printRow: [],
      };
    },
    methods: {
      print(row) {
        this.printRow = [];
        this.printRow.push(row);
        this.$refs.printWin.show(row);
      },
      noticeWms(row) {
        let entity = {};
        entity.returnNoticeOrderId = row.returnNoticeOrderId;
        entity.version = row.version;
        ReturnNoticeOrderApi.noticeWms(row.returnNoticeOrderId,entity).then(this.search);
      },
      batchNoticeWms() {
        this.doBatch('批量通知WMS', item => {
          return ReturnNoticeOrderApi.noticeWms(item.returnNoticeOrderId,item);
        }, item => item.status === 'CREATED' || item.status === 'NOTICE_FAILED');
      },
      cancel(row) {
        let entity = {};
        entity.returnNoticeOrderId = row.returnNoticeOrderId;
        entity.version = row.version;
        ReturnNoticeOrderApi.cancel(row.returnNoticeOrderId,entity).then(this.search);
      },
      batchCancel() {
        this.doBatch('批量取消通知', item => {
          return ReturnNoticeOrderApi.cancel(item.returnNoticeOrderId,item);
        }, item => item.status !== 'CANCELED' && item.inStatus === 'NO_IN');
      },
      exportReturnNoticeData(){
        this.exportData(value=>this.api.exportData(value, this.filter));
      },
      reposting(row) {
        ReturnNoticeOrderApi.reposting(row).then(this.showSuccess);
      },
      batchRetryPosting() {
        this.doBatch('退换货通知单批量过账', item => {
          return ReturnNoticeOrderApi.reposting(item);
        }, x => x.status === 'NOTICED');
      }
    },
  };
</script>
