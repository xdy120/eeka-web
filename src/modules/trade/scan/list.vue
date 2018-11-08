<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form label-width="80px">
        <!--上面两行条件-->
        <el-row :gutter="10">

          <el-col :span="6">
            <el-form-item label="综合搜索">
              <el-input v-model.trim="filter.keyWord"
                        @keyup.enter.native="searchByKeyWork()" placeholder="快递单号/配货单号/手机号"
                        :autofocus="focus.focus2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品扫描">  <!-- v-if="form.inWarehouseName"-->
              <el-input v-model.trim="filter.skuCode"
                        :autofocus="focus.focus3" autofocus placeholder="规格编码/条码"
                        @keyup.enter.native="scanSku()"></el-input>
            </el-form-item>

          </el-col>

          <el-col :span="6">
            <el-form-item label="正常箱码">
              <el-input v-model.trim="form.normalBoxNo"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="备注">
              <el-input v-model.trim="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">

          <el-col :span="6">
            <el-form-item label="退回仓库" prop="form.inVirtualWarehouseId">
              <virtual-warehouse-selector :default-first="false"
                                          v-model="form.inVirtualWarehouseId"
                                          :virtualWarehouseName.sync="form.inVirtualWarehouseName"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退换类型" prop="form.returnType">
              <data-dict-item-selector :default-first="true" v-model="form.returnType"
                                       :dataDictId="10301"></data-dict-item-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="异常箱码">
              <el-input v-model.trim="form.abnormalBoxNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="padding-left: 40px">
            <el-button @click="submit()">保存</el-button>
            <sku-selector @confirm="manualAddSku"
                          :quantity=true
                          :multiple=true
                          text="新增">
            </sku-selector>
            <el-button @click="resetAll">清空</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!--中间的信息-->
    <el-header height="40px" style="padding: 10px;font-size: 18px">
      <span style="font-weight: bold;">
          快递单号：
          <span v-if="applys[0]">{{applys[0].inExpressNo}}</span>
      </span>
      <span style="font-weight: bold;margin-left: 30px">
        店铺名称：<span v-if="store">{{store.storeName}}</span>
        </span>
    </el-header>
    <el-header :height="30" v-for="order in orders" :key="order.salesOrderId">
      <el-row :gutter="10">
        <el-tooltip :content="order.tradeId" placement="top">
          <el-col :span="7" class="order-item">
            <nobr>交易号：{{order.tradeId}}</nobr>
          </el-col>
        </el-tooltip>

        <el-tooltip :content="order.mobile" placement="top">
          <el-col :span="4" class="order-item">
            <nobr >手机号：{{order.mobile}}</nobr>
          </el-col>
        </el-tooltip>

        <el-tooltip :content="order.contact" placement="top">
          <el-col :span="4" class="order-item">
            <nobr>收货人：{{order.contact}}</nobr>
          </el-col>
        </el-tooltip>
        <el-tooltip :content="order.provinceName+order.cityName+order.districtName+order.address" placement="top">
          <el-col :span="8" class="order-item">
            <nobr>
              地址：{{order.provinceName}}{{order.cityName}}{{order.districtName}}{{order.address}}
            </nobr>
          </el-col>
        </el-tooltip>
      </el-row>

    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="details" size="medium">
        <el-table-column prop="imageUrl" align="center" label="图片" width="100" fixed>
          <template slot-scope="scope">
            <div style="height: 100px;">
              <img :src="imageUrl(scope.row)" height="100px"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tradeId" label="交易号" width="150" fixed></el-table-column>
        <el-table-column prop="productCode" label="商品编码" width="150" fixed></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="skuCode" label="规格编码" width="150" fixed></el-table-column>
        <el-table-column prop="skuName" label="规格名称"></el-table-column>
        <el-table-column label="商城状态" align="center" width="120px">
          <template slot-scope="scope">
           <enum-show v-if="scope.row.mallExchangeStatus" enum-name="MallExchangeStatus" v-model="scope.row.mallExchangeStatus"></enum-show>
           <enum-show v-else enum-name="MallRefundStatus" v-model="scope.row.mallRefundStatus"></enum-show>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="商品数" align="center" width="70"></el-table-column>
        <el-table-column prop="applyQuantity" label="申请数量" align="center" width="70"></el-table-column>
        <el-table-column label="扫描数" align="center" width="70">
          <template slot-scope="scope">
            <span v-if="!scope.row.applyQuantity && scope.row.scanQuantity === 0"></span>
            <span v-else-if="scope.row.scanQuantity !== scope.row.applyQuantity"
                  style="color: #ff2d25;font-size: 20px;">{{scope.row.scanQuantity}}</span>
            <span v-show="scope.row.scanQuantity === scope.row.applyQuantity"
                  style="color: green;font-size: 20px;">{{scope.row.scanQuantity}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

  </el-container>
</template>
<style>
  .order-item {
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
<script>
  import {Edit, TableResize} from '@/libs/mixins';
  import ApplyList from './apply.list.vue';
  import SaleList from './sale.list.vue';
  import {Assert} from '@/libs/util';
  import {ReturnOrderApi, SalesOrderApi} from '../api';
  import {SkuApi} from '@/modules/product/api';
  import {
    DataDictItemSelector,
    ExpressSelector,
    VirtualWarehouseSelector,
    WarehouseSelector,
    SkuSelector
  } from '@/modules/selector';

  export default {
    name: 'ReturnScan',
    mixins: [Edit, TableResize],
    components: {
      SaleList,
      WarehouseSelector, ExpressSelector, DataDictItemSelector, ApplyList, VirtualWarehouseSelector,
      SkuSelector
    },
    directives: {
      'focus': function (el, binding) {
        if (binding.value) {
          el.focus();
        }
      }
    },
    data() {
      return {
        filter: {
          page: 1,
          pageSize: 20
        },
        focus: {
          focus1: true,
          focus2: false,
          focus3: false,
          focus4: false,
          focus5: false,
        },
        form: {
          inDetails: [],
          outDetails: [],
        },
        orders: [],//所有订单信息
        details: [],//所有原单商品信息
        applys: [],//售后申请信息
        store: {}, //店铺信息
        base: {}, //全部信息
        expressNo: '',
        clickFlag: true, //控制连续保存
      };
    },
    methods: {
      //保存
      submit() {
        if (!this.clickFlag){
          this.$message.warning('不可连续保存!');
          return;
        }
        this.clickFlag = false;
        if (Assert.isBlank(this.form.inVirtualWarehouseId)) {
          this.$message.warning('退入仓库不能为空!');
          this.clickFlag = true;
          return;
        }
        if (!Assert.isBlank(this.form.abnormalBoxNo) && !Assert.isBlank(this.form.normalBoxNo)) {
          this.$message.warning('箱码填写有误!');
          this.clickFlag = true;
          return;
        }
        if (this.form.normalBoxNo !== '') {
          this.form.boxNo = this.form.normalBoxNo;
        } else {
          this.form.boxNo = this.form.abnormalBoxNo;
        }
        if (this.form.inDetails.length === 0) {
          this.$message.warning('已扫商品为空!');
          this.clickFlag = true;
          return;
        }
        if (Assert.isBlank(this.form.returnType) || Assert.isBlank(
          this.form.inVirtualWarehouseId)) {
          this.$message.warning('退换类型、退回仓库不能为空!');
          this.clickFlag = true;
          return;
        }
        this.form.refundApplyOrders = this.base.refundApplyOrders;
        this.form.exchangeApplyOrders = this.base.exchangeApplyOrders;
        this.form.expressNo = this.expressNo;
        this.form.sourceDetail = this.details;
        if (this.base.store) {
          this.form.storeId = this.base.store.storeId;
        }
        //在这里就要提交了
        ReturnOrderApi.addReturnOrder(this.form).then(() => {
          this.resetAll();
          this.clickFlag = true;
          if (this.form.outDetails > 0) {
            this.$message.success('换货单创建成功');
          } else {
            this.$message.success('退货单创建成功');
          }
        }).catch(()=>{
          this.clickFlag = true;
        });
      },
      //第一个输入框 搜索订单商品
      searchByKeyWork() {
        if (!this.filter.keyWord) {
          this.$message.warning('综合搜索条件不能为空');
          return;
        }
        //通过 配货单号  找到原 订单  和   订单商品的信息
        this.resetData();
        ReturnOrderApi.getSourceOrderByKeyWord(this.filter.keyWord).then(response => {

          if (response.refundApplyOrders || response.exchangeApplyOrders) {
            if (response.refundApplyOrders.length !== 0) {
              this.applys = response.refundApplyOrders;
              this.applys.forEach(a => {
                a.inExpressNo = a.expressNo;
              });
            }
            if (response.exchangeApplyOrders.length !== 0) {
              this.applys.push(...response.exchangeApplyOrders);
            }
          }
          if (response.salesOrders) {
            response.salesOrders.forEach(s => {
              s.details.forEach(d => {
                d.tradeId = s.tradeId;
                d.salesOrderCode = s.salesOrderCode;
                d.scanQuantity = 0;
                //找到订单明细商品 对应的 申请单 的退入数量，无就给空
                if (this.applys.find) {
                  let apply = this.applys.find(a => {
                    //同 sku 还要同 订单
                    return a.inSkuCode === d.skuCode && a.tradeId === d.tradeId;
                  });
                  if (apply) {
                    if (apply.applyQuantity) {
                      d.applyQuantity = apply.applyQuantity;
                      d.mallRefundStatus = apply.mallRefundStatus;
                    } else if (apply.quantity) {
                      d.applyQuantity = apply.quantity;
                      d.mallExchangeStatus = apply.mallExchangeStatus;
                    }
                  }
                }
                let colorAndImage = response.colorAndImages.find(x=>{
                  return x.skuCode === d.skuCode;
                });
                if (colorAndImage) {
                  d.imageUrl = colorAndImage.imageUrl;
                }
                this.details.push(d);
              });
            });
            this.orders = response.salesOrders;
          }

          if (response.store) {
            this.store = response.store;
            this.form.inVirtualWarehouseId = this.store.setting.defaultReturnWarehouse;
            this.form.inVirtualWarehouseName = this.store.setting.defaultReturnWarehouseName;
          }
          this.base = response;
        });
      },
      //扫描SKU事件 , 指定扫描的数量
      scanSku(scanNum) {
        if (!this.filter.skuCode) {
          this.$message.warning('扫描的规格编码不能为空');
          return;
        }
        if (this.filter.skuCode === 'RETURN_SCAN_SAVE') {
          this.submit();
        } else if (this.filter.skuCode === 'RETURN_SCAN_CLEAN') {
          this.resetAll();
        } else {
          //先在原单商品里找，如果找不到再请求skuApi 获取显示到界面
          //在原单商品处标记
          let old = null;
          let olds = [];
          //找到 要扫描sku 对应原单商品
          for (let item of this.details) {
            if (item.skuCode === this.filter.skuCode) {
              olds.push(item);
            }
          }
          // 判断找到的个数 如果只有一个直接去，如果有多个 则表示冲突了，将多个相同的按状态分组 , 按照 已申请的,换货的,未退款的分组顺序找, 按照这个顺序找未扫描满的,一次往后
          if (olds.length > 0) {
            if (olds.length === 1) {
              old = olds[0];
            } else if (olds.length > 1) {
              //按状态分组
              let applyArr = [];
              let needReturnArr = [];
              let noneArr = [];
              let refundArr = []; //已退款
              for (let item of olds) {
                //已申请
                if (item.salesOrderDetailRefundStatus === 'APPLY') {
                  applyArr.push(item);
                }
                //换货的
                if (item.needReturnGoods) {
                  needReturnArr.push(item);
                }
                //未退款的
                if (item.salesOrderDetailRefundStatus === 'NONE') {
                  noneArr.push(item);
                }
                //已退款
                if (item.salesOrderDetailRefundStatus === 'REFUND') {
                  refundArr.push(item);
                }
              }

              //先申请的    以下是看申请数量
              applyArr.forEach(x=>{
                if (x.applyQuantity > x.scanQuantity){
                  old = x;
                }
              });
              //换货的
              if (old === null){
                needReturnArr.forEach(x=>{
                  if (x.applyQuantity > x.scanQuantity){
                    old = x;
                  }
                });
              }
              //未退款的
              if (old === null){
                noneArr.forEach(x=>{
                  if (x.applyQuantity > x.scanQuantity){
                    old = x;
                  }
                });
              }
              //已退款的
              if (old === null){
                refundArr.forEach(x=>{
                  if (x.applyQuantity > x.scanQuantity){
                    old = x;
                  }
                });
              }

              //没申请的      以下是看原单的数量
              if (old === null) {
                //先申请的
                applyArr.forEach(x=>{
                  if (x.quantity > x.scanQuantity){
                    old = x;
                  }
                });
              }
              //换货的
              if (old === null){
                needReturnArr.forEach(x=>{
                  if (x.quantity > x.scanQuantity){
                    old = x;
                  }
                });
              }
              //未退款的
              if (old === null){
                noneArr.forEach(x=>{
                  if (x.quantity > x.scanQuantity){
                    old = x;
                  }
                });
              }
              //已退款的
              if (old === null){
                refundArr.forEach(x=>{
                  if (x.quantity > x.scanQuantity){
                    old = x;
                  }
                });
              }
              //最后再满足  直接从不为空的数组里取 ,顺序同上
              if (old === null) {
                if (applyArr.length !== 0) {
                  old = applyArr[0];
                }else if (needReturnArr.length !== 0){
                  old = needReturnArr[0];
                } else if (noneArr.length !== 0) {
                  old = noneArr[0];
                } else if (refundArr.length !== 0){
                  old = refundArr[0];
                }
              }

            }
          }
          if (old !== null) {
            if (!scanNum){
              scanNum = 1;
            }
            if (old.scanQuantity+scanNum > old.applyQuantity || old.applyQuantity === undefined) {

              this.$confirm('申请数量和扫描数量异常,是否继续?').then(() => {
                if (old.scanQuantity >= 1) {
                  old.scanQuantity += scanNum;
                } else {
                  old.scanQuantity = scanNum;
                }
                old.abnormalSku = false;
                if (!old.tradeId){
                  old.abnormalSku = true;
                }
                this.toInDetails(old);
                //如果找到换货单  通过 salesOrderId  找到
                let exchange = this.getExchangeBySalesOrderId(old.skuCode, old.salesOrderId);
                if (exchange) {
                  this.toOutDetail(exchange);
                }
                this.filter.skuCode = '';
              });
            } else {
              if (old.scanQuantity >= 1) {
                old.scanQuantity += scanNum;
              } else {
                old.scanQuantity = scanNum;
              }
              this.toInDetails(old);
              //如果找到换货单  通过 salesOrderId  找到
              let exchange = this.getExchangeBySalesOrderId(old.skuCode, old.salesOrderId);
              if (exchange) {
                this.toOutDetail(exchange);
              }
              this.filter.skuCode = '';
            }
          } else {
            //请求skuApi enable是启用的
            SkuApi.getEnableSkuByCode(this.filter.skuCode).then(response => {
              this.filter.skuCode = '';
              if (response) {
                this.$confirm('此商品未找到订单为异常商品,是否继续?').then(x => {
                  response.productType = response.product.productType;
                  response.scanQuantity = 1;
                  this.details.push(response);
                  this.toInDetails(response);
                });
              } else {
                this.$message.warning('在商品信息中未找到' + this.filter.skuCode);
              }
            });
          }
        }
      },
      toInDetails(detail) {
        if (detail) {
          let inDetail = this.convertIndetail(detail);
          if (this.form.inDetails.length > 0) {
            //如果在扫描商品里已存在，变更数量
            let old = this.form.inDetails.find((value) => {
              if (value.applyQuantity){
                if (value.applyQuantity> value.quantity){
                  return value.skuId === detail.skuId && value.salesOrderId === value.salesOrderId;
                }
              } else {
                return value.skuId === detail.skuId && value.salesOrderId === value.salesOrderId;
              }
            });
            if (old) {
              old.refundableAmount += old.refundableAmount / old.quantity;//加上应退
              old.quantity = inDetail.quantity;
            } else {
              //没有找到明细直接新加到明细
              if (detail.actualAmount && inDetail.actualAmount) {
                inDetail.refundableAmount = detail.actualAmount / detail.quantity;
                inDetail.actualAmount = detail.actualAmount / detail.quantity; //todo
              } else {
                inDetail.refundableAmount = 0;
                inDetail.actualAmount = 0;
              }
              this.form.inDetails.push(inDetail);
            }
          } else if (detail.actualAmount && inDetail.actualAmount) {//如果是有实际价格 则是原单有的商品
            inDetail.refundableAmount = detail.actualAmount / detail.quantity;
            inDetail.actualAmount = detail.actualAmount / detail.quantity; //todo
            this.form.inDetails.push(inDetail);
          } else {
            inDetail.refundableAmount = 0;
            inDetail.actualAmount = 0;//无原单信息 SKU价格为sku 销售价
            this.form.inDetails.push(inDetail);
          }
        }
      },
      //转换退入商品明细
      convertIndetail(detail) {
        let quantity = 1;
        if (detail.scanQuantity){
          quantity = detail.scanQuantity;
          if (detail.abnormalSku && detail.applyQuantity){
            quantity = detail.scanQuantity - detail.applyQuantity;
          }
        }
        let inDetail = {
          quantity: quantity,
          productId: detail.productId,
          productName: detail.productName,
          productCode: detail.productCode,
          skuId: detail.skuId,
          skuName: detail.skuName,
          skuCode: detail.skuCode,
          refundableAmount: 0.00,
          productType: detail.productType
        };
        if (!detail.abnormalSku){
          inDetail.applyQuantity = detail.applyQuantity;
          inDetail.salesOrderId = detail.salesOrderId;
          inDetail.actualAmount = detail.actualAmount;
        }
        return inDetail;
      },
      //换出商品明细  传 换货申请
      toOutDetail(exchange) {
        if (exchange) {
          //如果在扫描商品里已存在，变更数量
          let old = this.form.outDetails.find((value, index, arr) => {
            return value.skuCode === exchange.outSkuCode && value.sourceOrderId === exchange.salesOrderId;
          });
          let outDetail = this.convertOutdetail(exchange);
          if (old) {
            old.quantity += 1;
          } else {
            //没有找到明细直接新加到明细
            this.form.outDetails.push(outDetail);
          }
        }
      },
      convertOutdetail(exchange) {
        //找到原单 和原单商品
        let outDetail = {
          productId: exchange.outProductId,
          productName: exchange.outProductName,
          productCode: exchange.outProductCode,
          skuId: exchange.outSkuId,
          skuName: exchange.outSkuName,
          skuCode: exchange.outSkuCode,
          quantity: 1,   //数量
          sourceOrderId: exchange.salesOrderId,  // 原单id
          sourceSkuCode: exchange.inSkuCode,   //原单商品 编码
          reason: exchange.reason //换货的原因
        };
        return outDetail;
      },
      getExchangeBySalesOrderId(skuCode,salesOrderId) {
        let apply;
        if (this.applys.length > 0) {
          apply = this.applys.find((value) => {
            return value.inSkuCode === skuCode && value.salesOrderId === salesOrderId;
          });
        }
        //判断是否是 换货单
        if (apply && apply.outSkuCode) {
          return apply;
        }
      },
      //显示图片
      imageUrl(row) {
        if (row.imageUrl) {
          return row.imageUrl;
        }
        return require('@/assets/images/bg.png');
      },
      //手工录入
      manualAddSku(skus){
        skus.forEach(sku=>{
          let oldDetail = this.details.find(x=>{
            return x.skuCode===sku.skuCode;
          });
          sku.productType = sku.product.productType;
          this.$set(sku, 'scanQuantity', sku.quantity);
          delete sku.quantity;
          if (oldDetail){
            this.filter.skuCode = oldDetail.skuCode;
            this.scanSku(sku.scanQuantity);
          } else {
            this.details.push(sku);
            this.toInDetails(sku);
          }
        });
      },
      resetAll() {
        this.orders = [];
        this.details = [];
        this.applys = [];
        this.base = {};
        this.store = {};
        this.filter = {};
        this.expressNo = '';
        this.form = {
          returnType: this.form.returnType,
          inVirtualWarehouseId: this.form.inVirtualWarehouseId,
          inVirtualWarehouseName: this.form.inVirtualWarehouseName,
          abnormalBoxNo: this.form.abnormalBoxNo,
          normalBoxNo: this.form.normalBoxNo,
          inDetails: [],
          outDetails: [],
        };
      },
      resetData() {
        this.orders = [];
        this.details = [];
        this.applys = [];
        this.base = {};
        this.store = {};
        this.form = {
          returnType: this.form.returnType,
          inVirtualWarehouseId: this.form.inVirtualWarehouseId,
          inVirtualWarehouseName: this.form.inVirtualWarehouseName,
          abnormalBoxNo: this.form.abnormalBoxNo,
          normalBoxNo: this.form.normalBoxNo,
          inDetails: [],
          outDetails: [],
        };
      }
    },
    watch: {
      ['filter.keyWord'](val) {
        let isMobile = /^[1][3,4,5,7,8]\d{9}$/.test(val);
        let isDispatch = val.substring(0, 2) === 'DO';
        if (!isMobile && !isDispatch) {
          this.expressNo = val;
        }
      }
    }
  };
</script>
