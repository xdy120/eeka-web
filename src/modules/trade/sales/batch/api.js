import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';
import {FieldType} from '@/component/query/index';

class SalesOrderBatchApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales/batch';
  }

  static list(filter, paging) {
    filter.set('page', paging.page);
    filter.set('pageSize', paging.pageSize);
    return ajax.get(this.baseUrl, {params: filter});
  }
}

class SalesOrderBatchBookmarkApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales/batch/bookmark';
  }

  static listAll() {
    return ajax.get(this.baseUrl);
  }
}

const Relation = {
  ORDER: 'order',
  SUB: 'sub',
  ORDER_DETAIL: 'detail'
};

const CustomFields = [
  {
    field: 'audited_time',
    label: '审核时间',
    type: FieldType.datetime,
  },
  {
    field: 'hold_date',
    label: '留单时间',
    type: FieldType.datetime,
  },
  {
    field: 'created_time',
    label: '制单时间',
    type: FieldType.datetime,
  },
  {
    field: 'modified_time',
    label: '更新时间',
    type: FieldType.datetime,
  },
  {
    field: 'actual_amount',
    label: '支付金额',
    type: FieldType.float,
  },
  {
    field: 'settlement_amount',
    label: '结算金额',
    type: FieldType.float,
  },
  {
    field: 'distribution_amount',
    label: '分销金额',
    type: FieldType.float,
  },
  {
    field: 'actual_amount',
    label: '实际金额',
    type: FieldType.float,
  },
  {
    field: 'discount_amount',
    label: '优惠金额',
    type: FieldType.float,
  },
  {
    field: 'cod_amount',
    label: '到付金额',
    type: FieldType.float,
  },
  {
    field: 'selling_amount',
    label: '销售金额',
    type: FieldType.float,
  },
  {
    field: 'quantity',
    label: '总数量',
    type: FieldType.long,
  },
  {
    field: 'sales_order_code',
    label: '销售单编号',
    type: FieldType.text
  },
  {
    field: 'trade_id',
    label: '交易号',
    type: FieldType.text
  },
  {
    field: 'distribution_trade_id',
    label: '分销订单号',
    type: FieldType.text
  },
  {
    field: 'country_name',
    label: '国',
    type: FieldType.text
  },
  {
    field: 'province_name',
    label: '省',
    type: FieldType.text
  },
  {
    field: 'city_name',
    label: '市',
    type: FieldType.text
  },
  {
    field: 'district_name',
    label: '区',
    type: FieldType.text
  },
  {
    field: 'address',
    label: '地址',
    type: FieldType.text
  },
  {
    field: 'contact',
    label: '收货人',
    type: FieldType.text
  },
  {
    field: 'mobile',
    label: '手机',
    type: FieldType.text
  },
  {
    field: 'telephone',
    label: '电话',
    type: FieldType.text
  },
  {
    field: 'creator',
    label: '制单人',
    type: FieldType.text
  },
  {
    field: 'auditor',
    label: '审核人',
    type: FieldType.text
  },
  {
    field: 'manual_user',
    label: '手工标记人',
    type: FieldType.text
  },
  {
    field: 'remark',
    label: '备注',
    type: FieldType.text
  },
  {
    field: 'suggest_warehouse_name',
    label: '建议实体仓名称',
    type: FieldType.text
  },
  {
    field: 'suggest_virtual_warehouse_name',
    label: '建议发货仓库名称',
    type: FieldType.text
  },
  {
    field: 'suggest_express_no',
    label: '建议快递单号',
    type: FieldType.text
  },
  {
    field: 'suggest_express_name',
    label: '建议快递名称',
    type: FieldType.text
  },
  {
    field: 'last_express_name',
    label: '最后一次快递名称',
    type: FieldType.text
  },
  {
    field: 'last_express_no',
    label: '最后一次快递单号',
    type: FieldType.text
  },
  {
    field: 'store_name',
    label: '店铺名称',
    type: FieldType.text
  },
  {
    field: 'reissue_reason',
    label: '补发原因',
    type: FieldType.text
  },
  {
    field: 'status',
    label: '状态',
    type: FieldType.enum,
    enumName: 'SalesOrderStatus'
  },
  {
    field: 'dispatch_status',
    label: '配货状态',
    type: FieldType.enum,
    enumName: 'DispatchStatus'
  },
  {
    field: 'refund_status',
    label: '退货状态',
    type: FieldType.enum,
    enumName: 'RefundStatus'
  },
  {
    field: 'pay_status',
    label: '支付状态',
    type: FieldType.enum,
    enumName: 'SalesOrderPayStatus'
  },
  {
    field: 'delivery_status',
    label: '发货状态',
    type: FieldType.enum,
    enumName: 'DeliveryStatus'
  },
  {
    field: 'mall_sales_order_status',
    label: '商城状态',
    type: FieldType.enum,
    enumName: 'MallSalesOrderStatus'
  },
  {
    field: 'store_id',
    label: '店铺',
    type: FieldType.store,
  },
  {
    field: 'is_urgent',
    label: '加急',
    type: FieldType.boolean
  },
  {
    field: 'is_oos',
    label: '缺货',
    type: FieldType.boolean
  },
  {
    field: 'is_manual',
    label: '手工处理',
    type: FieldType.boolean
  },
  {
    field: 'is_product_abnormal',
    label: '商品异常',
    type: FieldType.boolean
  },
  {
    field: 'is_hold',
    label: '留单',
    type: FieldType.boolean
  },
  {
    field: 'is_force_split',
    label: '强制拆单',
    type: FieldType.boolean
  },
  {
    field: 'is_prerefund',
    label: '预退款',
    type: FieldType.boolean
  },
  {
    field: 'express_fee',
    label: '快递费',
    type: FieldType.float,
    relation: Relation.SUB
  },
  {
    field: 'mall_paid_time',
    label: '平台支付时间',
    type: FieldType.datetime,
    relation: Relation.SUB
  },
  {
    field: 'mall_created_time',
    label: '平台下单时间',
    type: FieldType.datetime,
    relation: Relation.SUB
  },
  {
    field: 'mall_modified_time',
    label: '平台修改时间',
    type: FieldType.datetime,
    relation: Relation.SUB
  },
  {
    field: 'mall_prepay_time',
    label: '平台预付日期',
    type: FieldType.datetime,
    relation: Relation.SUB
  },
  {
    field: 'mall_finished_time',
    label: '平台完成时间',
    type: FieldType.datetime,
    relation: Relation.SUB
  },
  {
    field: 'presell_delivery_date',
    label: '预售发货日期',
    type: FieldType.datetime,
    relation: Relation.SUB
  },
  {
    field: 'create_type',
    label: '创建类型',
    type: FieldType.enum,
    enumName: 'SalesOrderCreateType',
    relation: Relation.SUB
  },
  {
    field: 'sales_order_type',
    label: '订单类型',
    type: FieldType.enum,
    enumName: 'SalesOrderType',
    relation: Relation.SUB
  },
  {
    field: 'presell_type',
    label: '预售类型',
    type: FieldType.enum,
    enumName: 'PresellType',
    relation: Relation.SUB
  },
  {
    field: 'source_type',
    label: '来源类型',
    type: FieldType.enum,
    enumName: 'SourceType',
    relation: Relation.SUB
  },
  {
    field: 'buyer_memo',
    label: '买家备注',
    type: FieldType.text,
    relation: Relation.SUB
  },
  {
    field: 'seller_memo',
    label: '卖家备注',
    type: FieldType.text,
    relation: Relation.SUB
  },
  {
    field: 'member_name',
    label: '会员名称',
    type: FieldType.text,
    relation: Relation.SUB
  },
  {
    field: 'buyer_email',
    label: '买家邮箱',
    type: FieldType.text,
    relation: Relation.SUB
  },
  {
    field: 'is_cod',
    label: '到付',
    type: FieldType.boolean,
    relation: Relation.SUB
  },
  {
    field: 'is_prepay',
    label: '预付',
    type: FieldType.boolean,
    relation: Relation.SUB
  },
  {
    field: 'is_has_invoice',
    label: '发票',
    type: FieldType.boolean,
    relation: Relation.SUB
  },
  {
    field: 'is_blacklist',
    label: '黑名单',
    type: FieldType.boolean,
    relation: Relation.SUB
  },
  {
    field: 'is_new_member',
    label: '新会员',
    type: FieldType.boolean,
    relation: Relation.SUB
  },
  {
    field: 'is_third_delivery',
    label: '第三方发货',
    type: FieldType.boolean,
    relation: Relation.SUB
  },
  {
    field: 'is_drop_shipping',
    label: '明细代发',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_presell_priority',
    label: '明细预售有货先发',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_manual_add',
    label: '明细手工添加',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_combination',
    label: '明细组合商品',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_combination_detail',
    label: '明细套装明细',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_oos',
    label: '明细缺货',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_gift',
    label: '明细赠品',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_need_return_goods',
    label: '明细需要退货',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_prepackage',
    label: '明细预包装',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'is_product_abnormal',
    label: '明细商品异常',
    type: FieldType.boolean,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'sku_code',
    label: '明细规格编码',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'product_code',
    label: '明细商品编码',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'product_name',
    label: '明细商品名称',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'gift_strategy_name',
    label: '明细策略名称',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'mall_presell_delivery_requiring',
    label: '明细平台预售发货要求',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'mall_product_name',
    label: '明细商城商品名称',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'mall_product_out_code',
    label: '明细商城商品外部编码',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'mall_sku_name',
    label: '明细商城规格名称',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'mall_sku_out_code',
    label: '明细商城规格外部编码',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'suggest_virtual_warehouse_name',
    label: '明细建议发货仓库名称',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'suggest_warehouse_name',
    label: '明细建议实体仓名称',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'express_no',
    label: '明细快递单号',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'express_name',
    label: '明细快递名称',
    type: FieldType.text,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'sales_order_detail_refund_status',
    label: '明细退款状态',
    type: FieldType.enum,
    relation: Relation.ORDER_DETAIL,
    enumName: 'SalesOrderDetailRefundStatus'
  },
  {
    field: 'product_type',
    label: '明细商品类型',
    type: FieldType.enum,
    relation: Relation.ORDER_DETAIL,
    enumName: 'ProductType'
  },
  {
    field: 'mall_sales_order_detail_status',
    label: '明细商城明细状态',
    type: FieldType.enum,
    relation: Relation.ORDER_DETAIL,
    enumName: 'MallSalesOrderDetailStatus'
  },
  {
    field: 'status',
    label: '明细状态',
    type: FieldType.enum,
    relation: Relation.ORDER_DETAIL,
    enumName: 'SalesOrderDetailStatus'
  },
  {
    field: 'presell_delivery_date',
    label: '明细预售发货日期',
    type: FieldType.datetime,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'cost_price',
    label: '明细成本价',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'distribution_price',
    label: '明细分销价',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'selling_price',
    label: '明细销售价',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'actual_selling_price',
    label: '明细实际销售价',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'settlement_price',
    label: '明细结算价',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'selling_amount',
    label: '明细销售金额',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'settlement_amount',
    label: '明细结算金额',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'actual_amount',
    label: '明细实际金额',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'distribution_amount',
    label: '明细分销金额',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'discount_amount',
    label: '明细优惠金额',
    type: FieldType.float,
    relation: Relation.ORDER_DETAIL
  },
  {
    field: 'quantity',
    label: '明细数量',
    type: FieldType.long,
    relation: Relation.ORDER_DETAIL
  },
];

export {
  Relation,
  CustomFields,
  SalesOrderBatchApi,
  SalesOrderBatchBookmarkApi
};