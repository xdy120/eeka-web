import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class GiftStrategyApi extends RestApi {

  static get baseUrl() {
    return '/marketing/gift/strategy';
  }

  static listDetailProductPage(giftStrategyRuleId, filter, paging) {
    return this.doList(`${this.baseUrl}/${giftStrategyRuleId}/product`, filter,
      paging);
  }

  static listDetailGiftPage(giftStrategyRuleId, filter, paging) {
    return this.doList(`${this.baseUrl}/${giftStrategyRuleId}/gift`, filter,
      paging);
  }

  /** stores */
  static listStores(strategyId) {
    return ajax.get(`${this.baseUrl}/${strategyId}/store`);
  }

  static addStore(strategyId, stores) {
    return ajax.post(`${this.baseUrl}/${strategyId}/store`, stores);
  }

  static removeStore(strategyId, sid) {
    return ajax.delete(`${this.baseUrl}/${strategyId}/store/${sid}`);
  }

  /** products */
  static listProducts(strategyId, ruleId, sku) {
    return ajax.get(`${this.baseUrl}/${strategyId}/rule/${ruleId}/product`,
      sku);
  }

  static addProduct(strategyId, ruleId, sku) {
    return ajax.post(`${this.baseUrl}/${strategyId}/rule/${ruleId}/product`,
      sku);
  }

  static modifyProduct(strategyId, ruleId, sku) {
    return ajax.put(
      `${this.baseUrl}/${strategyId}/rule/${ruleId}/product/${sku.giftStrategyProductId}`,
      sku);
  }

  static removeProduct(strategyId, ruleId, giftStrategyProductId) {
    return ajax.delete(
      `${this.baseUrl}/${strategyId}/rule/${ruleId}/product/${giftStrategyProductId}`);
  }

  /** gifts */
  static listGifts(strategyId, ruleId) {
    return ajax.get(`${this.baseUrl}/${strategyId}/rule/${ruleId}/gift`);
  }

  static addGift(strategyId, ruleId, gift) {
    return ajax.post(`${this.baseUrl}/${strategyId}/rule/${ruleId}/gift`, gift);
  }

  static modifyGift(strategyId, ruleId, gift) {
    return ajax.put(
      `${this.baseUrl}/${strategyId}/rule/${ruleId}/gift/${gift.giftStrategyGiftId}`,
      gift);
  }

  static removeGift(strategyId, ruleId, giftStrategyGiftId) {
    return ajax.delete(
      `${this.baseUrl}/${strategyId}/rule/${ruleId}/gift/${giftStrategyGiftId}`);
  }

  /** rule **/
  static listRules(strategyId) {
    return ajax.get(`${this.baseUrl}/${strategyId}/rule`);
  }

  static getRule(strategyId, ruleId) {
    return ajax.get(`${this.baseUrl}/${strategyId}/rule/${ruleId}`);
  }

  static addRule(strategyId, rule) {
    return ajax.post(`${this.baseUrl}/${strategyId}/rule`, rule);
  }

  static modifyRule(strategyId, rule) {
    return ajax.put(
      `${this.baseUrl}/${strategyId}/rule/${rule.giftStrategyRuleId}`, rule);
  }

  static removeRule(strategyId, giftStrategyRuleId) {
    return ajax.delete(
      `${this.baseUrl}/${strategyId}/rule/${giftStrategyRuleId}`);
  }
}

export {GiftStrategyApi};

export const MustGiftColumns = ['规格编码', '每次赠送数量', '赠品总数量', '预警数量'];

export const MustProductColumns = ['规格编码', '购买数量'];

export const MustStrategyBlessingColumns = ['规格编码', '福袋编码', '赠送数量', '计划数量'];

export const MustStrategyProductColumns = ['规格编码', '预警数量', '赠送数量', '计划数量'];

export const SkuColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number',
  defaultValue: 1
}, {
  label: '价格',
  prop: 'price',
  type: 'number',
}];

export const GiftSkuColumns = [{
  label: '每次赠送数量',
  prop: 'quantity',
  type: 'number'
}, {
  label: '赠品总数量',
  prop: 'planQuantity',
  type: 'number'
}, {
  label: '预警数量',
  prop: 'alertQuantity',
  type: 'number'
}];

export const ProductSkuColumns = [{
  label: '购买数量',
  prop: 'quantity',
  type: 'number'
}];

export const DialogColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number'
}, {
  label: '赠送数量',
  prop: 'quantity',
  type: 'number'
}, {
  label: '预警数量',
  prop: 'alertQuantity',
  type: 'number'
}];


