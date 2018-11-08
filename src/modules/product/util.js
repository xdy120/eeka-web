class Product {
  constructor() {
    this.productType = 'PHYSICAL';
    this.productSyncStatus = 'NONE';
    this.singleDelivery = false;
    this.gift = false;
    this.attributesJson = '';
    this.skus = [];
  }
}

class ProductSku {
  constructor(product, attribute, info) {
    this.skuCode = product
      ? `${product.productCode}-${attribute.dataDictItemCode}` : null;
    this.skuName = attribute ? `${attribute.dataDictItemName}` : null;
    this.combination = false;
    this.giftBox = false;
    this.lockStock = false;
    this.vipPrice = info ? info.vipPrice : 0;
    this.markedPrice = info ? info.markedPrice : 0;
    this.sellingPrice = info ? info.sellingPrice : 0;
    this.costPrice = info ? info.costPrice : 0;
    this.purchasePrice = info ? info.purchasePrice : 0;
    this.distributionPrice = info ? info.distributionPrice : 0;
    this.logisticsInsurance = info ? info.logisticsInsurance : 0;
    this.quantityOfBox = info ? info.quantityOfBox : 0;
    this.weight = info ? info.weight : 0;
    this.volume = info ? info.volume : 0;
  }
}

class ProductSkuInfo {
  constructor() {
    this.markedPrice = 0;
    this.sellingPrice = 0;
    this.costPrice = 0;
    this.purchasePrice = 0;
    this.distributionPrice = 0;
    this.logisticsInsurance = 0;
    this.quantityOfBox = 0;
    this.weight = 0;
    this.volume = 0;
    this.prepackage = false;
  }
}

export {Product, ProductSku, ProductSkuInfo};