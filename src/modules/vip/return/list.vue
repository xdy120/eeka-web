<template>
  <el-container>
    <el-header class="oms-search" style="height: 70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="退货单号">
              <el-input v-model="filter.vipReturnCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退供单号">
              <el-input v-model="filter.outerCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId" mall-type="VIP"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库">
              <virtual-warehouse-selector
                  v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="VipReturnStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="签收状态">
              <enum-selector v-model="filter.vipSignStatuses" multiple
                             enum-name="VipSignStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退货类型">
              <data-dict-item-selector v-model="filter.vipReturnType"
                                       dataDictId="10802"></data-dict-item-selector>
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
        <el-button @click="exportVipReturn">导出</el-button>
        <el-button @click="manualDownload">下载</el-button>
      </el-button-group>

    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="退货单号" prop="vipReturnCode"
                        width="150"></go-link-column>
        <el-table-column label="退供单号" prop="outerCode" width="100"></el-table-column>
        <go-abnormal-column label="异常" prop="abnormal" width="100"></go-abnormal-column>
        <go-abnormal-column label="唯品价异常" prop="vipPriceAbnormal" width="100"></go-abnormal-column>
        <go-enum-column label="状态" prop="status" enum-name="VipReturnStatus"></go-enum-column>
        <go-enum-column label="签收状态" prop="vipSignStatus" enum-name="VipSignStatus"
                        width="100"></go-enum-column>
        <el-table-column label="退货类型" prop="vipReturnType" width="100"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="100"></el-table-column>
        <el-table-column label="唯品仓库" prop="vipWarehouseName" width="100"></el-table-column>
        <el-table-column label="退入仓库" prop="virtualWarehouseName" width="100"></el-table-column>
        <go-quantity-column label="箱数" prop="boxQuantity"></go-quantity-column>
        <go-quantity-column label="退货数量" prop="quantity"></go-quantity-column>
        <go-quantity-column label="扫描数量" prop="scanQuantity"></go-quantity-column>
        <go-quantity-column label="规格数量" prop="skuQuantity"></go-quantity-column>
        <go-money-column label="退货金额" prop="vipAmount"></go-money-column>
        <go-date-time-column label="退货时间" prop="returnTime"></go-date-time-column>
        <el-table-column prop="signer" label="签收人" width="100"></el-table-column>
        <go-date-time-column label="签收时间" prop="signTime"></go-date-time-column>
        <el-table-column label="制单人" prop="creator" width="100"></el-table-column>
        <go-date-time-column label="制单时间" prop="createdTime"></go-date-time-column>
        <go-date-time-column label="更新时间" prop="modifiedTime"></go-date-time-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" fixed="right" width="260">
          <template slot-scope="scope">
            <go-audit-button :disabled="scope.row.status!=='CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <el-button type="text"
                       :disabled="scope.row.status!=='AUDITED'||scope.row.vipSignStatus!=='NO_SIGN'"
                       @click="sign(scope.row)">签收
            </el-button>
            <el-button type="text"
                       :disabled="scope.row.vipSignStatus==='NO_SIGN'||scope.row.scanQuantity===scope.row.quantity"
                       @click="scan(scope.row)">
              扫描
            </el-button>
            <el-button type="text" :disabled="scope.row.vipSignStatus==='NO_SIGN'"
                       @click="notice(scope.row)">生成通知单
            </el-button>
            <go-tooltip-button v-if="scope.row.abnormal" tooltip="匹配异常"
                               @click="matching(scope.row)"></go-tooltip-button>
            <go-tooltip-button v-if="scope.row.vipPriceAbnormal" tooltip="匹配价格"
                               :disabled="isDisable"
                               @click="recalculateAmount(scope.row)"></go-tooltip-button>
            <log-popover module-name="VIP_RETURN" :bizId="scope.row.vipReturnId"></log-popover>
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
    <sign ref="sign" @ok="search"></sign>
    <scan ref="scan" @ok="search"></scan>
    <download ref="download"></download>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {Placeholders} from '@/libs/util';
  import {LogPopover} from '@/component/log';
  import {
    DataDictItemSelector,
    StoreSelector,
    VirtualWarehouseSelector,
    WarehouseSelector
  } from '@/modules/selector';
  import DetailEditor from './detail.edit.vue';
  import Creator from './create.vue';
  import {VipReturnApi} from './api';
  import Scan from './scan';
  import Sign from './sign';
  import Download from './download';

  export default {
    name: 'VipReturn',
    mixins: [TableResize, List, PageList],
    components: {
      Creator,
      Scan,
      Sign,
      DetailEditor,
      LogPopover,
      WarehouseSelector,
      StoreSelector,
      DataDictItemSelector,
      VirtualWarehouseSelector,
      Download
    },
    data() {
      return {
        api: VipReturnApi,
        pk: 'vipReturnId',
        Placeholders,
        isDisable: false
      };
    },
    methods: {
      sign(row) {
        this.$refs.sign.show(row);
      },
      scan(row) {
        this.$refs.scan.show(row);
      },
      exportVipReturn() {
        this.exportData(value => this.api.exportReturn(value, this.filter));
      },
      matching(row) {
        this.$confirm('自动匹配异常商品？').then(() => {
          this.api.match(row[this.pk], row).then(() => {
            this.$message.success('后台匹配中...');
            this.clickSearch();
          });
        }).catch(() => {
          this.isDisable = false;
        });
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
      manualDownload() {
        this.$refs.download.show();
      },
    },
  };
</script>