<template>
  <el-container>
    <el-header class="oms-search" height="120">
      <el-form :model="filter" @keyup.enter.native="search" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: right;padding-right: 40px">
            <go-toggle v-model="advanceQueryVisible" on-text="高级查询" off-text="简单查询"
                       :show-text="true"
                       :show-icon="false"></go-toggle>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="编码">
              <el-input v-model="filter.smartKeys" placeholder="退换货单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌编码">
              <data-dict-item-selector :default-first="false"
                                       v-model="filter.brandName"
                                       :code.sync="filter.brandCodes"
                                       data-dict-id="10101">
              </data-dict-item-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拆包人">
              <el-input v-model="filter.unpacker"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拆包时间">
              <go-date-time-picker v-model="filter.unpackedTimeBegin"></go-date-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="快递单号">
              <el-input v-model="filter.expressNos" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退入规格编码">
              <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="ReturnOrderStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至">
              <go-date-time-picker v-model="filter.unpackedTimeEnd"></go-date-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="advanceQueryVisible">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="退入商品编码">
                <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="箱码">
                <el-input v-model="filter.boxNos" :placeholder="Placeholders.IN"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="search">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="exportReturnData()">导出</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight"
                @row-dblclick="toggleTabFooter" @current-change="currentRowChange">
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column prop="returnOrderCode" label="退货单编号" width="130" fixed></el-table-column>
        <go-enum-column label="状态" prop="status" enum-name="ReturnOrderStatus"></go-enum-column>
        <el-table-column prop="boxNo" label="异常箱码" width="100"></el-table-column>
        <el-table-column prop="returnType" label="退换类型" width="80"></el-table-column>
        <el-table-column prop="expressNo" label="快递号" width="130"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <go-quantity-column prop="quantity" label="退货数量" width="70"></go-quantity-column>
        <el-table-column prop="inVirtualWarehouseName" label="退入仓库" width="100"></el-table-column>
        <el-table-column prop="unpacker" label="拆包人" width="100"></el-table-column>
        <go-date-time-column prop="unpackedTime" label="拆包时间"></go-date-time-column>
        <el-table-column prop="creator" label="制单人" width="100"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <go-tooltip-button tooltip="详情" @click="detail(scope.row)"></go-tooltip-button>
            <el-button type="text" @click="split(scope.row)" v-show="showSplit(scope.row)">拆分</el-button>
            <go-invalid-button v-show="showInvalid(scope.row)" @click="invalid(scope.row)"></go-invalid-button>
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
                               :currentTab="currentTab"></return-order-detail>
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
    <return-order-abnormal ref="returnDetail" @change="search"></return-order-abnormal>
  </el-container>
</template>
<script>
  import {
    DataDictItemSelector,
    ExpressSelector,
    StoreSelector,
    VirtualWarehouseSelector
  } from '@/modules/selector';
  import ReturnOrderDetail from './in.detail.vue';
  import returnOrderAbnormal from './return.order.detail.vue';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {ReturnOrderApi} from './api.js';
  import {LogTab} from '@/component/log';
  import ReturnOrderBasic from '../return/basic.vue';
  import {Placeholders} from '@/libs/util';

  export default {
    name: 'ReturnOrder',
    mixins: [List, PageList, TableResize],
    components: {
      returnOrderAbnormal,
      DataDictItemSelector,
      ReturnOrderDetail,
      VirtualWarehouseSelector,
      ExpressSelector,
      ReturnOrderBasic,
      StoreSelector,
      LogTab
    },
    data() {
      return {
        api: ReturnOrderApi,
        pk: 'returnOrderId',
        currentTab: 'basic',
        Placeholders,
        currentEditOrder: null,
        noticeVisible: false,
        visible: false,
        inDetails: [],
        selectInDetails: [],
        domain: {},
        filter: {
          abnormal: true
        }
      };
    },
    methods: {
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
      },
      //显示拆分按钮
      showSplit(row) {
        if (row.details && row.details.length > 0) {
          if (row.status === 'INVALID') {
            return false;
          }
          let temp = [];
          for (let item of row.details){
            if (!item.salesOrderId){
              temp.push(item);
            }
          }
          if (row.details.length > 1 && temp.length > 0){
            return true;
          }
          if (temp && temp.length > 0){
            let quantity = temp.map(x=>x.quantity).reduce((a,b)=>a+b);
            return quantity > 1;
          } else {
            return false;
          }
        }
      },
      split(row) {
        this.visible = true;
        this.domain = row;
        //只将异常的 无头件显示在拆分列表
        let detail = [];
        row.details.forEach(x => {
          if (!x.salesOrderId) {
            x.splitQuantity = x.quantity;
            detail.push(x);
          }
        });
        this.inDetails = detail;
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
      //详情
      detail(row) {
        this.$refs.returnDetail.show(row);
      },
      showInvalid(row){
        if (row.status !=='INVALID') {
          return true;
        }
      },
      reset() {
        this.filter = {
          abnormal: true
        };
      },
      exportReturnData(){
        this.exportData(value=>this.api.exportData(value, this.filter));
      }
    }
  };
</script>