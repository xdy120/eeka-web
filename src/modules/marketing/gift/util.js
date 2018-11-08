import {SkuDetail} from '@/libs/type';

class Strategy {
  constructor(strategyType) {
    this.giftStrategyType = strategyType;
    this.timeType = 'PAID_TIME';
  }
}

class StrategyRule {
  constructor() {
    this.ruleType = 'MONEY';
    this.matchSize = false;
    this.priorityNo = 1;
    this.skus = [];
    this.gifts = [];
  }
}

class StrategyRuleContent {
  constructor() {
    this.productRange = 'ALL';
    this.giftType = 'GOODS';
    this.giveQuantity = 1;
    this.minAmount = 1;
    this.minProductQuantity = 1;
    this.minQuantity = 1;
    this.doubly = false;
    this.doublyType = 'PRODUCT';
    this.doublyNumber = 1;
    this.maxDoubly = 1;
  }
}

class StrategyRuleLuckBagContent {
  constructor() {
    this.luckBagGiveProductQuantity = 1;
  }
}

class StrategyProduct extends SkuDetail {
  constructor(sku) {
    super(sku);
    this.quantity = sku.quantity;
  }
}

class StrategyGift extends SkuDetail {
  constructor(sku) {
    super(sku);
    this.size = sku.size;
    this.planQuantity = sku.quantity;
    this.quantity = sku.quantity;
    this.alertQuantity = sku.quantity;
  }
}

export {
  Strategy,
  StrategyRule,
  StrategyProduct,
  StrategyGift,
  StrategyRuleContent,
  StrategyRuleLuckBagContent
};