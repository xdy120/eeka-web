<template>
  <el-dialog title="唯品退货扫描" :fullscreen="true" :visible.sync="visible"
             :before-close="dialogCloseConfirm">
    <el-container heigth="100%">
      <el-header class="oms-search" height="70px">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form inline label-width="80px">
              <el-form-item :model="domain" :rules="rules" ref="editForm" label-width="100px">
                <span style="font-size: 15px;margin-left: 10px;">退回仓库：<span style="color: #FF0000">{{domain.virtualWarehouseName}}</span></span>
              </el-form-item>
              <el-form-item label="唯品会箱码" label-width="85px">
                <el-input v-model.trim="filter.boxNumber" tabindex="1"
                          @keyup.enter.native="scan()"
                          :autofocus="focus.focus1"></el-input>
              </el-form-item>
              <el-form-item label="商品扫描">
                <el-input ref="txtSku" v-model.trim="entity.skuCode" tabindex="2"
                          :autofocus="focus.focus5" autofocus placeholder="规格编码/条码"
                          @keyup.enter.native="scanSku()"></el-input>
              </el-form-item>
            </el-form>
            <el-form inline label-width="80px">
              <el-form-item label-width="100px">
                <span style="font-size: 15px;margin-left: 10px;">已通知总数：<span style="color: #FF0000">{{this.noticeTotal}}</span></span>
                <span style="font-size: 15px;margin-left: 10px;">退货总数：<span
                    style="color: #FF0000">{{this.returnTotal}}</span></span>
                <span style="font-size: 15px;margin-left: 10px;">已扫总数：<span
                    style="color: #FF0000">{{this.scanTotal}}</span></span>
                <span style="font-size: 15px;margin-left: 10px;">本次扫描总数：<span
                    style="color: #FF0000">{{this.total}}</span></span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" style="text-align: right">
            <el-button @click="submit()">保存</el-button>
            <el-button @click="cleanDetails()">清空</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>

        <el-table :data="details" height="480px" @current-change="currentRowChange">
          <el-table-column label="商品名称" prop="productName"></el-table-column>
          <el-table-column label="规格编码" prop="skuCode" width="170"></el-table-column>
          <el-table-column label="规格名称" prop="skuName" width="170"></el-table-column>
          <el-table-column label="退货数量" prop="returnQuantity" width="170"></el-table-column>
          <el-table-column label="已扫数量" prop="scanQuantity" width="170"></el-table-column>
          <el-table-column label="扫描数量" prop="scanningQuantity" width="170"></el-table-column>
          <el-table-column label="通知数量" prop="noticeQuantity" width="170"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-dialog>
</template>
<script>
  import {Edit, List, PageList} from '@/libs/mixins';
  import {VipReturnApi, VipReturnDetailApi} from './api';
  import {DataDictItemSelector, VirtualWarehouseSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'Scan',
    mixins: [Edit, List, PageList],
    components: {VirtualWarehouseSelector, DataDictItemSelector},
    data() {
      return {
        api: VipReturnApi,
        pk: 'vipReturnId',
        ValidateRules: ValidateRules,
        focus: {
          focus1: true,
          focus2: false,
        },
        entity: {},
        details: [],
        boxNumbers: [],
        skuCodes: [],
        returnDetails: [],
        vipReturnDetailIds: [],
        rules: {
          boxNumber: ValidateRules.required,
          skuCode: ValidateRules.required,
        },
        noticeTotal: 0,
        returnTotal: 0,
        scanTotal: 0,
      };
    },
    methods: {
      submit() {
        if (this.details.length > 0) {
          this.domain.details = this.details;
          VipReturnApi.scan(this.domain[this.pk], this.domain).then(this.confirm);
          this.cleanDetails();
          this.$message.success('保存成功').then(this.details = []);
        } else {
          this.$message.warning('扫描明细为空');
        }
      },
      /**
       * 扫描箱码
       */
      scan() {
        this.filter.vipReturnId = this.domain.vipReturnId;
        for (var i = 0; i < this.boxNumbers.length; i++) {
          if (this.boxNumbers[i] == this.filter.boxNumber) {
            this.$message.warning('当前箱码已扫描');
            return;
          }
        }
        VipReturnDetailApi.listDetail(this.filter.vipReturnId, this.filter).then(r => {
          if (r.length > 0) {
            for (var i = 0; i < r.length; i++) {
              r[i].scanningQuantity = 0;
              this.returnDetails.push(r[i]);
              this.returnTotal += r[i].returnQuantity;
              this.noticeTotal += r[i].noticeQuantity;
              this.scanTotal += r[i].scanQuantity;
            }
            this.$refs.txtSku.focus();
            this.boxNumbers.push(this.filter.boxNumber);
          } else {
            this.$message.warning('未发现该箱码');
          }
        });
      },
      /**
       * 扫描SKU
       */
      scanSku() {
        this.returnDetails.find((value) => {
          let isHave = true;
          for (var i = 0; i < this.returnDetails.length; i++) {
            if (this.entity.skuCode == this.returnDetails[i].skuCode) {
              isHave = false;
              let isPush = true;
              for (var j = 0; j < this.vipReturnDetailIds.length; j++) {
                if (this.returnDetails[i].vipReturnDetailId == this.vipReturnDetailIds[j]) {
                  isPush = false;
                  break;
                }
              }
              if (isPush) {
                if (this.returnDetails[i].returnQuantity <= this.returnDetails[i].scanQuantity) {
                  this.$message.warning('扫描数量超过退货数量');
                } else {
                  this.details.unshift(this.returnDetails[i]);
                  this.vipReturnDetailIds.push(this.returnDetails[i].vipReturnDetailId);
                }
              }
            }
          }
          if (isHave) {
            this.$message.warning('箱码下未找到该规格');
          }
          return value.skuCode === this.entity.skuCode;
        });
        if (this.details) {
          for (var i = 0; i < this.details.length; i++) {
            if (this.details[i]) {
              if (this.details[i].skuCode == this.entity.skuCode) {
                if (this.details[i].returnQuantity <= this.details[i].scanQuantity) {
                  this.$message.warning('扫描数量超过退货数量');
                } else {
                  if (this.details[i].skuCode == this.entity.skuCode) {
                    this.details[i].scanningQuantity += 1;
                    this.total += 1;
                    this.details[i].scanQuantity += 1;
                    this.scanTotal += 1;
                  }
                }
              }
            }
          }
        }
      },
      onClosed() {
        this.cleanDetails();
      },
      cleanDetails() {
        this.total = 0;
        this.returnTotal = 0;
        this.noticeTotal = 0;
        this.scanTotal = 0;
        this.filter = {};
        this.entity = {};
        this.details = [];
        this.boxNumbers = [];
        this.returnDetails = [];
        this.vipReturnDetailIds = [];
      }
    },
  };
</script>