class SkuDetail {
  constructor(sku) {
    this.productId = sku.productId;
    this.productCode = sku.productCode;
    this.productName = sku.productName;
    this.skuId = sku.skuId;
    this.skuCode = sku.skuCode;
    this.skuName = sku.skuName;
    this.combination = sku.combination;
  }
}

export {SkuDetail};