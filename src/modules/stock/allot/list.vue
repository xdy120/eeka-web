<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="filter.stockVirtualAllotCodes"
                        :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="调入仓库">
              <virtual-warehouse-selector
                  v-model="filter.inVirtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="调出仓库">
              <virtual-warehouse-selector
                  v-model="filter.outVirtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="StockVirtualAllotStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes"
                        :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes"
                        :placeholder="Placeholders.IN"></el-input>
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
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="调拨单号" prop="stockVirtualAllotCode"
                        width="140"></go-link-column>
        <go-enum-column label="状态" enum-name="StockVirtualAllotStatus"
                        prop="status"></go-enum-column>
        <el-table-column label="出库仓库" prop="outVirtualWarehouseName"></el-table-column>
        <el-table-column label="入库仓库" prop="inVirtualWarehouseName"></el-table-column>
        <go-quantity-column label="计划数量" prop="planQuantity"></go-quantity-column>
        <go-quantity-column label="实调数量" prop="quantity"></go-quantity-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="创建人" prop="creator"></el-table-column>
        <go-date-time-column label="创建时间" prop="createdTime" sortable></go-date-time-column>
        <el-table-column label="审核人" prop="auditor"></el-table-column>
        <go-date-time-column label="审核时间" prop="auditedTime"></go-date-time-column>
        <go-date-time-column label="更新时间" prop="modifiedTime"></go-date-time-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row,'审核后将调拨库存')"></go-audit-button>
            <go-invalid-button v-if="scope.row.status==='CREATED'"
                               @click="invalid(scope.row)"></go-invalid-button>
            <go-export-button @click="exportDetail(scope.row)"></go-export-button>
            <log-popover module-name="STOCK_VIRTUAL_ALLOT"
                         :bizId="scope.row.stockVirtualAllotId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <allot-creator ref="creator" @ok="search"></allot-creator>
    <detail-edit ref="detailEditor" @ok="search"></detail-edit>
    <allot-editor ref="editor" @ok="search"></allot-editor>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {Placeholders} from '@/libs/util';
  import {VirtualWarehouseSelector} from '@/modules/selector';
  import {AllotApi} from './api';
  import AllotCreator from './create.vue';
  import DetailEdit from './detail.edit.vue';
  import AllotEditor from './edit.vue';
  import {LogPopover} from '@/component/log';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      DetailEdit,
      VirtualWarehouseSelector, AllotCreator, AllotEditor, LogPopover
    },
    data() {
      return {
        api: AllotApi,
        pk: 'stockVirtualAllotId',
        Placeholders
      };
    },
    methods: {
      exportDetail(row) {
        this.exportData(value => this.api.exportVirtualAllot(row.stockVirtualAllotId, value));
      },
    }
  };
</script>