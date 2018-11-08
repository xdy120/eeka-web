<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="通知明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px"
               label-position="left">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购订单" prop="purchaseOrderId">
              <purchase-selector v-model="domain.purchaseOrderId"
                                 :purchaseOrderCode="domain.purchaseOrderCode"
                                 :outFilter="purchaseOrderFilter"
                                 v-on:confirm="purchaseConfirm"></purchase-selector>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库仓库" prop="warehouseId">
              <warehouse-selector v-model="domain.warehouseId"
                                  :warehouseName.sync="domain.warehouseName"></warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次号" prop="batchNo">
              <el-input v-model="domain.batchNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="domain.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-show="stepTitle==='通知明细'">
      <el-container>
        <el-main>
          <el-table :data="details" :height="350" style="margin-top: 5px" show-summary>
            <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
            <go-selection-column></go-selection-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column prop="productCode" label="商品编码"></el-table-column>
            <el-table-column prop="skuName" label="规格名称"></el-table-column>
            <el-table-column prop="skuCode" label="规格编码"></el-table-column>
            <el-table-column prop="alreadyNoticeQuantity" label="已通知数"></el-table-column>
            <el-table-column prop="canNoticeQuantity" label="可通知数"></el-table-column>
            <el-table-column prop="noticeQuantity" label="通知数">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.noticeQuantity"
                          v-on:mouseout="change(scope.row)"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer :height="32" style="padding: 0">
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </div>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {PurchaseNoticeOrderApi, PurchaseOrderDetailApi,} from '../api';
  import {PurchaseSelector} from '../index';
  import {SkuSelector} from '@/modules/product/index';
  import {WarehouseSelector} from '@/modules/base/index';
  import {ValidateRules} from '@/libs/util';
  import {Edit, List, PageList, Steps, TableResize} from '@/libs/mixins';

  export default {
    name: 'NoticeCreator',
    mixins: [Steps, Edit, List, PageList, TableResize],
    components: {WarehouseSelector, PurchaseSelector, SkuSelector},
    props: {},
    data() {
      return {
        pk: 'purchaseNoticeOrderId',
        api: PurchaseNoticeOrderApi,
        stepTitle: '基本信息',
        details: [],
        warehouseId: '',
        purchaseOrderFilter: {
          status: 'AUDITED'
        },
        rules: {
          purchaseOrderId: ValidateRules.required,
          warehouseId: ValidateRules.required,
          batchNo: [
            {min: 0, max: 20, message: '长度在 0 到 20 个字符'}
          ],
          remark: [
            {min: 0, max: 50, message: '长度在 0 到 20 个字符'}
          ],
        }
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
              //加载采购订单明细
              let filter = {purchaseOrderId: this.domain.purchaseOrderId};
              let paging = {page: 1, pageSize: 20};
              PurchaseOrderDetailApi.listDetailPage(this.domain.purchaseOrderId, filter,
                paging).then(response => {
                this.details = [];
                this.total = response.total;
                response.data.forEach(row => {
                  let detail = {};
                  for (let key in row) {
                    detail[key] = row[key];
                    detail.alreadyNoticeQuantity = row.noticeQuantity;
                    detail.canNoticeQuantity = row.quantity - row.noticeQuantity;
                    detail.noticeQuantity = 0;
                    detail.purchaseOrderId = row.purchaseOrderId
                    detail.purchaseOrderCode = row.purchaseOrderCode;
                  }
                  this.details.push(detail);
                });
                this.next();
              });
            });
            return;
          case '通知明细':
            if (!this.details) {
              this.$message.warning('请选择明细');
              return;
            } else {
              this.next();
            }
            break;
          default:
            this.next();
            break;
        }
      },
      purchaseConfirm(data) {
        this.domain = {};
        this.details = [];
        this.domain.purchaseOrderCode = data.purchaseOrderCode;
        this.domain.purchaseOrderId = data.purchaseOrderId;
        this.domain.warehouseId = data.warehouseId;
        this.domain.warehouseName = data.warehouseName;
        //默认查找实体仓库
        //默认选中实体仓下面的默认共享仓
        //let virtualFilter = {
        //VirtualWarehouseType: 'SHARE',
        //warehouseId: data.warehouseId,
        //}
        //VirtualWarehouseApi.list(virtualFilter).then(response => {
        //this.$set(this.domain, 'warehouseId', response[0].virtualWarehouseId);
        //this.$set(this.domain, 'warehouseName', response[0].virtualWarehouseName);
        //});
      },
      doSave() {
        this.domain.details = [];
        this.details.forEach(item => {
          if (item.noticeQuantity > 0) {
            item.purchaseOrderId = this.domain.purchaseOrderId;
            item.purchaseOrderCode = this.domain.purchaseOrderCode;
            this.domain.details.push(item);
          }
        });
        if (this.domain.details.length > 0) {
          PurchaseNoticeOrderApi.add(this.domain).then(r => {
            this.$message.success('采购通知单新增成功');
            this.close();
            this.$emit('ok', this.domain);
          });
        } else {
          this.$message.error('采购通单明细不能为空');
        }
      },
      resetFields() {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      }
    },
  }
  ;
</script>