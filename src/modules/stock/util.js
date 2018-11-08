import {SkuDetail} from '@/libs/type';

class StrategyProduct extends SkuDetail {
  constructor(sku) {
    super(sku);
    this.skuCode = sku.skuCode;
    this.quantity = sku.quantity;
  }
}

export {StrategyProduct};