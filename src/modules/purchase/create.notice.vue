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
            <el-form-item label="采购订单" prop="purchaseOrderCode">
              <el-input v-model="domain.purchaseOrderCode" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库仓库" prop="warehouseName">
              <el-input v-model="domain.warehouseName" :readonly="true"></el-input>
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
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item>
              <el-radio v-model="createNoticeType" label="ALL_CREATE">全部生成</el-radio>
              <el-radio v-model="createNoticeType" label="PART_CREATE">部分生成</el-radio>
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
            <el-table-column label="商品编码" sortable>
              <template slot-scope="scope">{{scope.row.productCode}}</template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column label="规格编码" sortable>
              <template slot-scope="scope">{{scope.row.skuCode}}</template>
            </el-table-column>
            <el-table-column prop="skuName" label="规格名称"></el-table-column>
            <el-table-column prop="alreadyNoticeQuantity" label="已通知数"></el-table-column>
            <el-table-column prop="canNoticeQuantity" label="可通知数"></el-table-column>
            <el-table-column prop="noticeQuantity" label="通知数"
                             v-if="this.createNoticeType==='partCreate'">
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
  import {PurchaseNoticeOrderApi, PurchaseOrderApi, PurchaseOrderDetailApi} from './api';
  import {PurchaseSelector} from './index';
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
        pk: 'purchaseOrderId',
        api: PurchaseOrderApi,
        stepTitle: '基本信息',
        details: [],
        warehouseId: '',
        createNoticeType: 'ALL_CREATE',
        purchaseOrderFilter: {
          status: 'AUDITED'
        },
        rules: {
          purchaseOrderId: ValidateRules.required,
          warehouseId: ValidateRules.required,
          remark: ValidateRules.remark
        }
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
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
                    detail.purchaseOrderId = row.purchaseOrderId;
                    detail.purchaseOrderCode = row.purchaseOrderCode;
                  }
                  if (detail.canNoticeQuantity > 0 || this.createNoticeType === 'ALL_CREATE') {
                    this.details.push(detail);
                  }
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
      doSave() {
        this.domain.details = [];
        this.details.forEach(item => {
          if (item.noticeQuantity > 0 || this.createNoticeType === 'ALL_CREATE') {
            if (item.canNoticeQuantity > 0) {
              if (this.createNoticeType === 'ALL_CREATE') {
                item.noticeQuantity = item.canNoticeQuantity;
              }
              item.purchaseOrderId = this.domain.purchaseOrderId;
              item.purchaseOrderCode = this.domain.purchaseOrderCode;
              this.domain.details.push(item);
            }
          }
        });
        if (this.domain.details.length > 0 || this.createNoticeType === 'ALL_CREATE') {
          let isSave = true;
          this.domain.details.forEach(item => {
            if (item.noticeQuantity > item.canNoticeQuantity) {
              this.$message.warning('通知数量不能大于可通知数量');
              isSave = false;
            }
          });
          if (isSave) {
            PurchaseNoticeOrderApi.add(this.domain).then(r => {
              this.$message.success('采购通知单新增成功');
              this.close();
              this.$emit('ok', this.domain);
            });
          }
        } else {
          this.$message.error('采购通知单明细不能为空');
        }
      },
      resetFields() {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      }
    }
  };
</script>