<template>
  <el-container>
    <el-header class="oms-search" height="120">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: right;padding-right: 20px">
            <go-toggle v-model="advanceQueryVisible" on-text="高级查询" off-text="简单查询"
                       :show-text="true"
                       :show-icon="false"></go-toggle>
            <three-checkbox v-model="filter.exchange" style="margin-left: 5px">换货单</three-checkbox>
            <three-checkbox v-model="filter.quantityAbnormal" style="margin-left: 5px">数量异常
            </three-checkbox>
            <three-checkbox v-model="filter.skuAbnormal" style="margin-left: 5px">款异常
            </three-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="编码">
              <el-input v-model="filter.smartKeys" placeholder="退换货单编号/交易号/订单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快递单号">
              <el-input v-model="filter.expressNos" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="ReturnOrderStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="通知单状态">
              <enum-selector v-model="filter.noticeStatus"
                             enum-name="WmsNoticeStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员呢称">
              <el-input v-model="filter.memberName" :placeholder="Placeholders.LIKE"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input v-model="filter.mobiles" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="退入规格编码">
              <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <template v-if="advanceQueryVisible">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="拆包时间">
                <go-date-time-picker v-model="filter.unpackedTimeBegin"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="至">
                <go-date-time-picker v-model="filter.unpackedTimeEnd"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="拆包人">
                <el-input v-model="filter.unpacker"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="退入商品编码">
                <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="审核时间">
                <go-date-time-picker v-model="filter.auditedTimeBegin"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="至">
                <go-date-time-picker v-model="filter.auditedTimeEnd"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审核人">
                <el-input v-model="filter.auditor"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="换出规格编码">
                <el-input v-model="filter.outSkuCodes" :placeholder="Placeholders.IN"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="复核时间">
                <go-date-time-picker v-model="filter.reviewTimeBegin"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="至">
                <go-date-time-picker v-model="filter.reviewTimeEnd"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="复核人">
                <el-input v-model="filter.reviewer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="换出商品编码">
                <el-input v-model="filter.outProductCodes"
                          :placeholder="Placeholders.IN"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="箱码">
                <el-input v-model="filter.boxNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="退换类型">
                <data-dict-item-selector v-model="filter.returnType"
                                         :dataDictId="10301"></data-dict-item-selector>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-row>
        <el-col :span="10">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button-group>
            <el-button @click="showCreator()">新增</el-button>
            <el-button @click="showNotice()">生成通知单</el-button>
            <el-button @click="exportReturnData()">导出</el-button>
            <!--<el-button @click="batchRetryPosting">批量过账</el-button>-->
          </el-button-group>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange" @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column label="标记" width="100px" fixed>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.exchange">换</el-tag>
            <el-tag v-if="scope.row.skuAbnormal">款异</el-tag>
            <el-tag v-if="quantityAbnormal(scope.row)">数异</el-tag>
          </template>
        </el-table-column>
        <go-enum-column label="生成通知单状态" prop="noticeStatus" width="100" enum-name="WmsNoticeStatus"
                        fixed></go-enum-column>
        <el-table-column prop="tradeId" label="交易号" width="150px" fixed></el-table-column>
        <el-table-column prop="returnOrderCode" label="退货单编号" width="150" fixed></el-table-column>
        <go-enum-column label="状态" prop="status" enum-name="ReturnOrderStatus"
                        fixed></go-enum-column>
        <!--<go-enum-column prop="postStatus" label="过账状态" enum-name="PostStatus" width="80px"-->
                        <!--fixed></go-enum-column>-->
        <el-table-column prop="salesOrderCode" label="订单号" width="150"></el-table-column>
        <el-table-column prop="returnReasonType" label="退货原因" width="100"></el-table-column>
        <el-table-column prop="boxNo" label="箱码" width="60"></el-table-column>
        <el-table-column prop="remark" label="备注" width="100"></el-table-column>
        <go-quantity-column prop="applyQuantity" label="申请数量" width="100"></go-quantity-column>
        <go-quantity-column prop="quantity" label="退货数量" width="100"></go-quantity-column>
        <go-money-column prop="refundableAmount" label="应退金额" width="100"></go-money-column>
        <el-table-column prop="storeName" label="店铺名称" width="100"></el-table-column>
        <el-table-column prop="inVirtualWarehouseName" label="退入仓库" width="100"></el-table-column>
        <el-table-column prop="outVirtualWarehouseName" label="换出仓库" width="100"></el-table-column>
        <go-enum-column prop="refundType" enum-name="RefundType" label="退款类型"></go-enum-column>
        <el-table-column prop="returnType" label="退换类型" width="100"></el-table-column>
        <el-table-column prop="distributionTradeId" label="分销单号" width="100"></el-table-column>
        <el-table-column prop="expressName" label="退回快递" width="100"></el-table-column>
        <el-table-column prop="expressNo" label="快递单号" width="100"></el-table-column>
        <el-table-column prop="unpacker" label="拆包人" width="100"></el-table-column>
        <go-date-time-column prop="unpackedTime" label="拆包时间"></go-date-time-column>
        <el-table-column prop="creator" label="制单人" width="100"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <el-table-column prop="auditor" label="审核人" width="100"></el-table-column>
        <go-date-time-column prop="auditedTime" label="审核时间"></go-date-time-column>
        <el-table-column prop="reviewer" label="复核人" width="100"></el-table-column>
        <go-date-time-column prop="reviewTime" label="复核时间"></go-date-time-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <!--<el-button type="text" v-if="scope.row.status==='REVIEWED'"-->
                        <!--@click="reposting(scope.row)">过账-->
            <!--</el-button>-->
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <go-invalid-button v-if="showInvalid(scope.row)"
                               @click="invalid(scope.row)"></go-invalid-button>
            <go-review-button v-if="scope.row.status==='AUDITED'"
                              @click="checkReview(scope.row)"></go-review-button>
            <el-button type="text" v-if="showSplit(scope.row)" @click="split(scope.row)">拆分
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <tabs-footer ref="tabsFooter" @updated="scrollToRow">
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <return-order-basic :parentData="selectedItem"></return-order-basic>
        </el-tab-pane>
        <el-tab-pane label="退入商品" name="detail">
          <return-order-detail :parentData="selectedItem"
                               :currentTab="currentTab" @change="search"></return-order-detail>
        </el-tab-pane>
        <el-tab-pane label="换出商品" name="outDetail">
          <return-order-out-detail :parentData="selectedItem"
                                   :currentTab="currentTab"></return-order-out-detail>
        </el-tab-pane>
        <el-tab-pane label="日志" name="log">
          <log-tab module-name="RETURN_ORDER" :parent-data="selectedItem" :prop="this.pk"
                   :current-tab="currentTab"></log-tab>
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <!--退换货单新增界面-->
    <return-creator ref="creator" @ok="search"></return-creator>
    <!--退换货单修改界面-->
    <return-editor ref="editor" @ok="search"></return-editor>
    <!--通知单生成界面-->
    <notice-creator ref="notice" @ok="search"></notice-creator>
    <batch-processor ref="batchProcessor" @finish="search"></batch-processor>
    <el-dialog title="请选择要拆分退入的明细" :visible.sync="visible" close-on-click-modal width="900px">
      <el-table ref="splitTable" :data="inDetails" height="400px"
                @selection-change="handleSelectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
        <el-table-column prop="productCode" label="商品编码" width="100" sortable></el-table-column>
        <el-table-column prop="productName" label="商品名称" width="100" sortable></el-table-column>
        <el-table-column prop="skuCode" label="规格编码" width="100"></el-table-column>
        <el-table-column prop="skuName" label="规格名称"></el-table-column>
        <go-quantity-column prop="quantity" label="退货数量" width="70"></go-quantity-column>
        <go-quantity-column label="拆出数量" width="70">
          <template slot-scope="scope">
            <el-input-number :min="1" :max="scope.row.quantity" v-model="scope.row.splitQuantity"></el-input-number>
          </template>
        </go-quantity-column>
        <go-quantity-column prop="inQuantity" label="入库数量" width="70"></go-quantity-column>
        <go-money-column prop="refundableAmount" label="应退金额" width="100"></go-money-column>
        <el-table-column prop="returnReasonType" width="100" label="退货原因"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
  import {
    DataDictItemSelector,
    ExpressSelector,
    StoreSelector,
    VirtualWarehouseSelector
  } from '@/modules/selector';
  import ReturnCreator from './create.vue';
  import ReturnEditor from './edit.vue';
  import ReturnOrderBasic from './basic.vue';
  import ReturnOrderDetail from './in.detail.vue';
  import ReturnOrderOutDetail from './out.detail.vue';
  import AdvanceQuery from './advance.query.vue';
  import NoticeCreator from './notice.create.vue';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {ReturnOrderApi} from './api.js';
  import {ReturnSignApi} from '../api';
  import {BatchProcessor} from '@/component/ui';
  import {LogTab} from '@/component/log';
  import {Placeholders} from '@/libs/util';

  export default {
    name: 'ReturnOrder',
    mixins: [List, PageList, TableResize],
    components: {
      ReturnEditor,
      ReturnCreator,
      NoticeCreator,
      DataDictItemSelector,
      AdvanceQuery,
      ReturnOrderOutDetail,
      ReturnOrderDetail,
      ReturnOrderBasic,
      VirtualWarehouseSelector,
      ExpressSelector,
      StoreSelector,
      LogTab,
      BatchProcessor
    },
    data() {
      return {
        api: ReturnOrderApi,
        pk: 'returnOrderId',
        codeProp: 'returnOrderCode',
        currentTab: 'basic',
        Placeholders,
        currentEditOrder: null,
        noticeVisible: false,
        visible: false,
        inDetails: [],
        selectInDetails: [],
        domain: {},
        filter: {
          abnormal: false,
        }
      };
    },
    methods: {
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
      },
      showNotice() {
        if (this.$refs.notice) {
          this.$refs.notice.show();
        }
      },
      searchExpressSign() {
        //查换快递签收信息
        let filter = {
          expressNo: this.domain.expressNo,
          status: 'CREATED',
          page: 1,
          pageSize: 2
        };
        ReturnSignApi.list(filter).then(response => {
          if (response.data.length === 1) {
            this.$set(this.domain, 'expressName', response.data[0].expressName);
            this.$set(this.domain, 'expressNo', response.data[0].expressNo);
            this.$set(this.domain, 'unpackedTime', response.data[0].createdTime);
            this.$set(this.domain, 'unpacker', response.data[0].creator);
          } else {
            this.$message.warning('未找到快递签收信息');
          }
        });
      },
      showSplit(row) {
        if (row.status !== 'REVIEWED' || row.status !== 'INVALID') {
          if (row.details && row.details.length > 0 && row.noticeStatus ==='NONE') {
            let quantity = row.details.map(x=>x.quantity).reduce((a,b)=>a+b);
            return quantity > 1;
          }else {
            return false;
          }
        }
      },
      split(row) {
        this.visible = true;
        this.domain = row;
        //只将异常的 无头件显示在拆分列表
        row.details.forEach(x => {
          x.splitQuantity = x.quantity;
        });
        this.inDetails = row.details;
      },
      handleSelectionChange(val) {
        this.selectInDetails = val;
      },
      confirm() {
        if (this.selectInDetails.length === 0){
          this.$message.warning('请选择要拆分的明细!');
          return;
        }
        let quantity =  this.domain.details.map(x=>x.quantity).reduce((a,b)=>a+b);
        let splitQuantity = this.selectInDetails.map(x=>x.splitQuantity).reduce((a,b)=>a+b);
        if (quantity <= splitQuantity) {
          this.$message.warning('请勿全部拆分!');
          return;
        }
        this.visible = false;
        this.domain.details = this.selectInDetails;
        this.domain.details.forEach(x=>x.quantity=x.splitQuantity);
        ReturnOrderApi.splitUnknownReturnOrder(this.domain).then(response => {
          this.$message.success('拆分成功!');
          this.$refs.splitTable.clearSelection();
        });
      },
      quantityAbnormal(row) {
        if (row.applyQuantity) {
          return row.quantity !== row.applyQuantity;
        } else {
          return row.quantity !== 0;
        }
      },
      showInvalid(row) {
        if ((row.status === 'CREATED' || row.status === 'AUDITED') && row.noticeStatus === 'NONE') {
          return true;
        }
      },
      checkReview(row){
        ReturnOrderApi.checkReview(row).then(res=>{
          if (res.length>0){
            this.$confirm('该退换货单存在重扫情况,请确认!!!').then(()=>{
              this.review(row,'如果是换货单系统会自动生成换货订单');
            });
          } else {
            this.review(row,'如果是换货单系统会自动生成换货订单');
          }
        });
      },
      reset() {
        this.filter = {
          abnormal: false
        };
      },
      reposting(row) {
        ReturnOrderApi.reposting(row).then(this.showSuccess);
      },
      exportReturnData(){
        this.exportData(value=>this.api.exportData(value, this.filter));
      },
      batchRetryPosting() {
        this.doBatch('退换货单批量过账', item => {
          return ReturnOrderApi.reposting(item);
        }, x => x.status === 'REVIEWED');
      }
    }
  };
</script>