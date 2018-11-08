<template>
  <el-container>
    <el-header class="oms-search" style="height: 70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="出仓单号">
              <el-input v-model="filter.vipDeliveryCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库编号">
              <el-input v-model="filter.storageNos" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快递单号">
              <el-input v-model="filter.waybillNumbers" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="VipDeliveryStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId" mall-type="VIP"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货仓库">
              <data-dict-item-selector v-model="filter.vipWarehouseName"
                                       :code.sync="filter.vipWarehouseCode"
                                       data-dict-id="10804"></data-dict-item-selector>
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
      </el-button-group>
      <el-button @click="exportVipDelivery">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="出仓单号" prop="vipDeliveryCode" width="150"></el-table-column>
        <go-enum-column label="状态" prop="status" enumName="VipDeliveryStatus"></go-enum-column>
        <el-table-column label="店铺名称" prop="storeName" width="150"></el-table-column>
        <el-table-column label="PO编号" prop="poCode" width="150"></el-table-column>
        <el-table-column label="入库编号" prop="storageNo" width="150"></el-table-column>
        <el-table-column label="送货仓库" prop="vipWarehouseName" width="100"></el-table-column>
        <el-table-column label="承运商" prop="carrierName" width="100"></el-table-column>
        <el-table-column label="运单号" prop="waybillNumber" width="150"></el-table-column>
        <el-table-column label="品牌编码" prop="brandCode" width="100"></el-table-column>
        <el-table-column label="品牌名称" prop="brandName" width="100"></el-table-column>
        <el-table-column label="配送模式" prop="deliveryMethodName"></el-table-column>
        <go-enum-column label="JIT类型" prop="jitType" enumName="VipJitType"></go-enum-column>
        <el-table-column label="送货批次" width="150">
          <template slot-scope="scope">
            {{scope.row.deliveryDate +' '+scope.row.deliveryTime}}
          </template>
        </el-table-column>
        <el-table-column label="要求到货时间" width="150">
          <template slot-scope="scope">
            {{scope.row.arrivalDate +' '+scope.row.arrivalTime}}
          </template>
        </el-table-column>
        <el-table-column label="制单人" prop="creator" width="100"></el-table-column>
        <go-date-time-column label="制单时间" prop="createdTime"></go-date-time-column>
        <el-table-column label="备注" prop="remark" width="100"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row,'此操作将审核该单据')"></go-audit-button>
            <go-invalid-button v-if="scope.row.status==='CREATED'"
                               @click="invalid(scope.row)"></go-invalid-button>
            <go-delivery-button v-if="scope.row.status==='AUDITED'"
                                @click="delivery(scope.row)"></go-delivery-button>
            <go-cancel-button v-if="scope.row.status!=='DELIVERED'&&scope.row.status!=='CANCELED'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <el-button type="text" @click="manualDelivery(scope.row)">手工发货</el-button>
            <log-popover module-name="VIP_DELIVERY" :bizId="scope.row.vipDeliveryId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <vip-delivery-creator ref="creator" @ok="search"></vip-delivery-creator>
    <delivery ref="delivery" @ok="search"></delivery>
  </el-container>
</template>

<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {Placeholders} from '@/libs/util';
  import {DataDictItemSelector, StoreSelector, WarehouseSelector} from '@/modules/selector';
  import {LogPopover} from '@/component/log';
  import VipDeliveryCreator from './create.vue';
  import {VipDeliveryApi} from './api';
  import Delivery from './deliery.vue';

  export default {
    name: 'VipDelivery',
    mixins: [TableResize, List, PageList],
    components: {
      StoreSelector,
      VipDeliveryCreator,
      LogPopover,
      DataDictItemSelector,
      WarehouseSelector,
      Delivery
    },
    data() {
      return {
        api: VipDeliveryApi,
        pk: 'vipDeliveryId',
        Placeholders
      };
    },
    methods: {
      delivery(row) {
        this.$refs.delivery.show(row);
      },
      exportVipDelivery() {
        this.exportData(value => this.api.exportDelivery(value, this.filter));
      },
      cancel(row) {
        this.$confirm('取消单据后不能再进行发货操作，是否继续取消？').then(() => {
          let entity = {};
          entity[this.pk] = row[this.pk];
          entity.version = row.version;
          this.api.cancel(entity[this.pk], entity).then(() => {
            this.$message.success('已取消');
          }).then(this.search());
        });
      },
      manualDelivery(row) {
        this.$confirm('操作后OMS系统无法再回传唯品发货信息，请谨慎操作，是否继续？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let bo = {};
          bo.vipDeliveryId = row.vipDeliveryId;
          bo.version = row.version;
          this.api.manualDelivery(row.vipDeliveryId, bo).then(() => {
            this.$message.success('成功');
          });
        });
      }
    },
  };
</script>