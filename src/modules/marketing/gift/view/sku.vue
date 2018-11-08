<template>
  <div>
    <div style="margin-bottom: 5px"
         v-if="canEdit && isNotExclude">
      <el-button @click="addSku">新增</el-button>
      <el-button @click="showImportSku">导入</el-button>
    </div>
    <el-table ref="dataTable" :data="list" :height="canEdit?tabsMinTableHeight:tabsTableHeight">
      <el-table-column prop="productCode" label="商品编码" width="150"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="skuCode" label="规格编码" width="150"></el-table-column>
      <el-table-column prop="skuName" label="规格名称"></el-table-column>
      <go-boolean-column prop="combination" label="套装" width="60"></go-boolean-column>
      <go-quantity-column prop="quantity" label="购买数量" width="100"
                          v-if="isNotExclude"></go-quantity-column>
      <el-table-column label="操作" width="80" v-if="canEdit">
        <template slot-scope="scope">
          <go-modify-button @click="modifySku(scope.row)"></go-modify-button>
          <go-delete-button @click="removeSku(scope.row)"></go-delete-button>
        </template>
      </el-table-column>
    </el-table>
    <sku-selector ref="skuSelector" :columns="columns"
                  :display="false"></sku-selector>
    <sku-importer ref="skuImporter" :must-columns="mustColumns"
                  templateUrl="/file/template/strategy_set_product.xlsx/营销策略活动商品导入模板"></sku-importer>
    <sku-edit ref="skuEditor"></sku-edit>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {Util} from '@/libs/util';
  import {GiftStrategyApi, MustProductColumns, ProductSkuColumns, SkuColumns} from '../api';
  import {StrategyProduct} from '../util';
  import {Gift} from '@/modules/marketing/gift/mixin';
  import {SkuImporter, SkuSelector} from '@/modules/product';
  import {SkuEdit} from '../dialog';

  export default {
    mixins: [TableResize, List, Tabs, Gift],
    components: {SkuImporter, SkuSelector, SkuEdit},
    data() {
      return {
        tab: 'sku',
        pk: 'giftStrategyProductId',
        api: GiftStrategyApi,
        domain: {},
        rule: {},
        columns: ProductSkuColumns,
        relation: SkuColumns,
        mustColumns: MustProductColumns
      };
    },
    computed: {
      isNotExclude() {
        return this.rule && this.rule.setting && this.rule.setting.productRange !== 'EXCLUDE';
      }
    },
    methods: {
      search() {
        if (this.parentData && this.parentData.rule) {
          this.domain = this.parentData;
          this.rule = this.parentData.rule;
          this.doSearch(GiftStrategyApi.listProducts(this.parentData.giftStrategyId,
            this.rule.giftStrategyRuleId));
        }
      },
      addSku() {
        this.$refs.skuSelector.showDialog({
          onSelected: skus => {
            let products = skus.map(x => new StrategyProduct(x));
            GiftStrategyApi.addProduct(this.domain.giftStrategyId, this.rule.giftStrategyRuleId,
              products).then(this.search);
          }
        });
      },
      modifySku(sku) {
        this.$refs.skuEditor.show(this.domain, this.rule, sku);
      },
      removeSku(sku) {
        this.api.removeProduct(this.domain.giftStrategyId, this.rule.giftStrategyRuleId,
          sku.giftStrategyProductId).then(this.search);
      },
      showImportSku() {
        this.$refs.skuImporter.show(skus => {
          let products = [];
          for (let sku of skus) {
            let product = new StrategyProduct(sku);
            product.quantity = Util.getNumberProp(sku, '购买数量');
            products.push(product);
          }
          return GiftStrategyApi.addProduct(this.domain.giftStrategyId,
            this.rule.giftStrategyRuleId, products).then(this.search);
        });
      }
    }
  };
</script>