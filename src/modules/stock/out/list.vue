<template>
  <el-container>
    <el-header class="oms-search" height="100px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row>
          <el-col :span="6">
            <el-form-item label="出库单号">
              <el-input v-model="filter.stockOutOrderCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库仓库">
              <virtual-warehouse-selector v-model="filter.virtualWarehouseId"
                                          :warehouseName.sync="filter.virtualWarehouseName"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="StockOutOrderStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库状态">
              <enum-selector v-model="filter.outStatus" multiple
                             enum-name="OutStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="出库类型">
              <data-dict-item-selector v-model="filter.stockOutOrderType"
                                       :dataDictId="10701"></data-dict-item-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源单号">
              <el-input v-model="filter.fromCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外部单号">
              <el-input v-model="filter.outerCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
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
        <el-button @click="exportStockOutData">导出</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="出库单号" prop="stockOutOrderCode"
                        width="140"></go-link-column>
        <el-table-column label="出库类型" prop="stockOutOrderType" width="100px"></el-table-column>
        <go-enum-column label="状态" enum-name="StockOutOrderStatus" prop="status"></go-enum-column>
        <go-enum-column label="出库状态" enum-name="OutStatus" prop="outStatus"
                        width="120px"></go-enum-column>
        <el-table-column label="出库仓库" prop="virtualWarehouseName" width="120px"></el-table-column>
        <el-table-column label="来源单号" prop="fromCode" width="120px"></el-table-column>
        <el-table-column label="外部单号" prop="outerCode" width="120px"></el-table-column>
        <el-table-column label="联系人" prop="contact" width="120px"></el-table-column>
        <el-table-column label="手机" prop="mobile"></el-table-column>
        <el-table-column label="区域" width="120px">
          <template slot-scope="scope">
            {{joinAddress(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="制单人" prop="creator" width="120px"></el-table-column>
        <go-date-time-column label="制单时间" prop="createdTime"></go-date-time-column>
        <el-table-column label="审核人" prop="auditor" width="120px"></el-table-column>
        <go-date-time-column label="审核时间" prop="auditedTime"></go-date-time-column>
        <go-date-time-column label="更新时间" prop="modifiedTime"></go-date-time-column>
        <go-date-time-column label="最后出库时间" prop="lastOutTime"></go-date-time-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <go-wms-button v-if="scope.row.status==='AUDITED'||scope.row.status==='NOTICE_FAILED'"
                           @click="noticeWms(scope.row)"></go-wms-button>
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row,'审核后不可修改')"></go-audit-button>
            <go-cancel-button v-if="scope.row.status!=='CANCEL'&&scope.row.outStatus==='NO_OUT'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <go-finish-button v-if="scope.row.status!=='FINISH'&&scope.row.outStatus==='PART_OUT'"
                              @click="finish(scope.row,'此操作将完结出库单并清除该单据库存占用')"></go-finish-button>
            <log-popover module-name="STOCK_OUT"
                         :bizId="scope.row.stockOutOrderId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <out-creator ref="creator" @ok="search"></out-creator>
    <out-editor ref="editor" @ok="search"></out-editor>
    <detail-edit ref="detailEditor" @ok="search"></detail-edit>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {DataDictItemSelector, VirtualWarehouseSelector} from '@/modules/selector';
  import {Assert, Placeholders} from '@/libs/util';
  import {StockOutApi} from './api';
  import {LogPopover} from '@/component/log';
  import OutCreator from './create.vue';
  import OutEditor from './edit.vue';
  import DetailEdit from './detail.edit.vue';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      OutEditor,
      OutCreator,
      DetailEdit,
      VirtualWarehouseSelector,
      LogPopover,
      DataDictItemSelector,
      Assert
    },
    props: {},
    data() {
      return {
        api: StockOutApi,
        pk: 'stockOutOrderId',
        Placeholders
      };
    },
    methods: {
      noticeWms(row) {
        this.api.noticeWms(row).then(this.search);
      },
      joinAddress(row) {
        let names = [];
        if (!Assert.isBlank(row.countryName)) {
          names.push(row.countryName);
        }
        if (!Assert.isBlank(row.provinceName)) {
          names.push(row.provinceName);
        }
        if (!Assert.isBlank(row.cityName)) {
          names.push(row.cityName);
        }
        if (!Assert.isBlank(row.districtName)) {
          names.push(row.districtName);
        }
        return names.join('/');
      },
      exportStockOutData() {
        this.exportData(value => this.api.exportData(value, this.filter));
      }
    }
  };
</script>