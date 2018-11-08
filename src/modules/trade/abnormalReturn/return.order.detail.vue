<template>
  <el-dialog title="异常件详情" :visible.sync="visible" :before-close="dialogCloseConfirm" fullscreen>
    <el-container>
      <!--上面两个卡片-->
      <el-header height="300px">
        <el-row :gutter="20">

          <el-col :span="12">
            <el-row>
              <el-card :body-style="{ padding: '0px'}">
                <div slot="header" class="clearfix">
                  <span class="title">快递签收信息</span>
                  <span class="status" style="color: green" v-if="expressSign.expressNo">已签收</span>
                  <span class="status" style="color: red" v-else>未签收</span>
                </div>
                <ul>
                  <li>快递单号：{{expressSign.expressNo}}</li>
                  <li>快递公司：{{expressSign.expressName}}</li>
                  <li>签&nbsp;收&nbsp;人&nbsp;：{{expressSign.creator}}</li>
                  <li>签收时间：{{expressSign.createdTime}}</li>
                </ul>
              </el-card>
            </el-row>

            <el-row style="margin-top: 10px">
              <el-card :body-style="{ padding: '0px'}">
                <div slot="header" class="clearfix">
                  <span class="title">拆包扫描信息</span>
                  <span class="status" style="color: red" v-if="domain.abnormal">异常件</span>
                  <span class="status" style="color: green" v-else>正常件</span>
                </div>
                <ul>
                  <li>物流标签：&nbsp;{{domain.returnType}}</li>
                  <li>物流备注：&nbsp;{{domain.remark}}</li>
                  <li>签&nbsp;收&nbsp;人&nbsp;：&nbsp;{{domain.unpacker}}</li>
                  <li>拆包时间：&nbsp;{{domain.unpackedTime}}</li>
                </ul>
              </el-card>
            </el-row>
          </el-col>

          <el-col :span="12">
            <el-row>
              <el-card :body-style="{ padding: '0px',height: '232px'}">
                <div slot="header" class="clearfix">
                  <span class="title">原单基本信息</span>
                  <sales-order-selector :outFilter="SalesFilter" v-show="!domain.salesOrderId"
                                        class="status" style="display: inline"
                                        :dialog=true
                                        :content="'关联'"
                                        :isDisabled="domain.status ==='INVALID'"
                                        @confirm="saleConfirm">
                  </sales-order-selector>
                </div>
                <ul>
                  <li style="line-height:30px">收&nbsp;货&nbsp;人&nbsp;：{{domain.contact}}</li>
                  <li style="line-height:30px">手机号码：{{domain.mobile}}</li>
                  <li style="line-height:30px">收货地址：{{salesOrder.address}}</li>
                  <li style="line-height:30px">会员昵称：{{domain.memberName}}</li>
                  <li style="line-height:30px">店铺名称：{{domain.storeName}}</li>
                </ul>
              </el-card>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <!--下面表格-->
      <el-main v-resize="mainHeight">
        <el-table ref="indetals" :data="domain.details" @row-click="selectionRow">
          <el-table-column width="100" align="center" label="图片">
            <template slot-scope="scope">
              <div style="height: 100px;">
                <img :src="imageUrl(scope.row)" height="100px"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column align="center" prop="skuName" label="规格名称"></el-table-column>
          <el-table-column align="center" prop="productCode" label="商品编码"></el-table-column>
          <el-table-column align="center" prop="productName" label="商品名称"></el-table-column>
          <el-table-column align="center" prop="color" label="颜色"></el-table-column>
          <el-table-column align="center" prop="quantity" label="退回数量"></el-table-column>
          <el-table-column align="center" label="交易号">
            <template slot-scope="scope">
              <span v-show="scope.row.salesOrderId">{{scope.row.tradeId}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <go-tooltip-button v-if="!scope.row.salesOrderId && domain.salesOrderId && domain.status!=='INVALID'"
                                 @click="compelRelate()" tooltip="强制关联"></go-tooltip-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <div style="text-align: right;margin-top: 10px">
        <el-button :disabled="showSub()" @click="updateAbnormal()">提交</el-button>
      </div>

      <el-dialog title="请选择要强制关联的原单明细" :visible.sync="visibleCompel" close-on-click-modal
                 width="900px" height="500px" append-to-body>
        <el-table height="400px" :data="salesOrder.details" @row-dblclick="confirm">
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <go-enum-column prop="status" enum-name="SalesOrderDetailStatus"
                          label="状态"></go-enum-column>
          <el-table-column prop="actualAmount" label="金额"></el-table-column>
        </el-table>
      </el-dialog>
    </el-container>
  </el-dialog>
</template>
<script>

  import {SalesOrderSelector,} from '@/modules/selector';
  import {Edit, List, PageList, TableResize} from '@/libs/mixins';
  import {ReturnOrderApi} from './api.js';
  import {ReturnSignApi} from '../api';
  import {SalesOrderApi} from '../sales/api';
  import {SkuApi} from '../../product/api';

  export default {

    mixins: [List, PageList, TableResize, Edit],
    components: {
      SalesOrderSelector
    },
    data() {
      return {
        api: ReturnOrderApi,
        pk: 'returnOrderId',
        visibleCompel: false,
        SalesFilter: {
          deliveryStatuses: 'PART,ALL',
        },
        expressSign: {}, //快递签收的信息
        skuAndProduct: [], //暂时储存 商品图片 和 sku 颜色
        salesOrder: {}, //要强行关联的商品明细
        submitFlag: false,
      };
    },
    methods: {
      show(param) {
        let entity = Object.assign({}, param);
        entity.details = param.details.map(x => Object.assign({}, x));
        const _this = this;
        //查签收信息
        if (entity.expressNo) {
          ReturnSignApi.getReturnSignByExpressNo(entity.expressNo).then(response => {
            if (response.length != 0) {
              _this.expressSign = response[0];
            }
          });
        }
        //补充列表 图片 和 商品颜色
        let codes = '';
        entity.details.forEach(x => {
          codes += x.skuCode + ',';
        });
        if (codes !== '') {
          SkuApi.listFullByCode(codes).then(response => {
            _this.skuAndProduct = response;
            entity.details.forEach(x => {
              response.forEach(y => {
                if (y.skuCode === x.skuCode) {
                  x.image = y.product.imageUrl;
                  x.color = y.color;
                }
              });
            });
            _this.domain = entity;
            if (!entity.salesOrderId) {
              _this.visible = true;
            }
          });
        }
        //如果主单已经关联原单 ,  但是明细还有无头件 , 查询原单主单 和 明细用于强制关联
        if (entity.salesOrderId) {
          SalesOrderApi.getDetailInfo(entity.salesOrderId).then(response => {
            _this.salesOrder = response;
            _this.visible = true;
          });
        }
      },
      //显示图片
      imageUrl(row) {
        if (row.image) {
          return row.image;
        }
        return require('@/assets/images/bg.png');
      },
      //将 原单关联上 退入的商品--> 全部关联
      saleConfirm(order) {
        const _this = this;
        let param = {};
        let returnOrder = _this.domain;
        returnOrder.tradeId = order.tradeId;
        returnOrder.salesOrderId = order.salesOrderId;
        returnOrder.salesOrderCode = order.salesOrderCode;
        returnOrder.memberId = order.sub.memberId;
        returnOrder.storeId = order.storeId;
        returnOrder.storeName = order.storeName;
        param.version = _this.domain.version;
        param.domain = returnOrder;
        ReturnOrderApi.relateSourceOrder(param).then(response => {
          //为了显示 拼上 图片 和 颜色
          response.returnOrder.details.forEach(x => {
            _this.skuAndProduct.forEach(y => {
              if (y.skuCode === x.skuCode) {
                x.image = y.product.imageUrl;
                x.color = y.color;
              }
            });
          });
          _this.domain = response.returnOrder;
          //还要处理没有关联上的
          _this.salesOrder = response.salesOrder;
          _this.submitFlag = true;
        });
      },
      //强制关联 显示
      compelRelate() {
        this.visibleCompel = true;
      },
      //当前无头件 的行
      selectionRow(row) {
        this.selectedItems = row;
      },
      //进行强制关联  ------> 单个强制关联
      confirm(sourceDetail) {
        this.domain.abnormal = false;
        this.domain.status = 'AUDITED';
        this.domain.details.forEach(detail => {
          //找到点击强制关联的那一行,进行关联操作
          if (this.selectedItems.returnOrderDetailId === detail.returnOrderDetailId) {
            //明细的关联
            this.$set(detail, 'salesOrderId', this.salesOrder.salesOrderId);
            this.domain.refundableAmount -= detail.refundableAmount;
            detail.salesOrderCode = this.salesOrder.salesOrderCode;
            detail.tradeId = this.salesOrder.tradeId;
            detail.salesOrderDetailId = sourceDetail.salesOrderDetailId;
            detail.refundableAmount = sourceDetail.actualAmount;
            //设置主单
            this.domain.refundableAmount += sourceDetail.actualAmount;
            this.submitFlag = true;
          }
          if (!detail.salesOrderId) {
            this.domain.abnormal = true;
            this.domain.status = 'CREATED';
          }
        });
        this.visibleCompel = false;
      },
      //保存关联的
      updateAbnormal() {
        //未自动关联 , 主单都没关联上
        if (!this.domain.salesOrderId) {
          this.$message.warning('异常单未关联,请勿提交!');
          return;
        }
        //判断明细 , 至少有一个关联的
        let flag = false;
        this.domain.details.forEach(x => {
          if (x.salesOrderId) {
            flag = true;
          }
        });
        if (!flag) {
          this.$message.warning('异常单未关联,请勿提交!');
          return;
        }
        let param = {};
        param.version = this.domain.version;
        param.domain = this.domain;
        ReturnOrderApi.updateAbnormal(this.domain.returnOrderId, param).then(r => {
          this.$message.success('异常退换货单关联保存成功');
          this.visible = false;
          this.clearData();
          this.$emit('change');
        });
      },
      //关闭对话框时的清除
      dialogCloseConfirm(done) {
        this.$confirm('确认关闭？').then(() => {
          this.submitFlag = false;
          this.clearData();
          this.onClosed && this.onClosed();
          done();
        });
      },
      clearData() {
        this.domain = {};
        this.salesOrder = {};
      },
      showSub() {
        let temp = true;
        if (this.domain.status === 'INVALID' || !this.submitFlag) {
          return true;
        }
        if (this.domain.details) {
          this.domain.details.forEach(x => {
            if (x.tradeId) {
              temp = false;
            }
          });
        }
        return temp;
      }
    }
  };
</script>
<style>
  ul li {
    list-style-type: none;
  }

  .status {
    margin-left: 70%;
  }

  .title {
    padding-left: 20px;
  }
</style>