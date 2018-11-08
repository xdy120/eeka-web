<template>
  <div>
    <div style="margin-bottom: 5px" v-if="canEdit">
      <el-button @click="addGift">新增</el-button>
      <el-button @click="showImportGift">导入</el-button>
    </div>
    <el-table ref="dataTable" :data="list" :height="canEdit?tabsMinTableHeight:tabsTableHeight">
      <el-table-column prop="luckyCode" label="福袋编码" width="100"
                       v-if="rule.ruleType==='LUCK_BAG'"></el-table-column>
      <el-table-column prop="productCode" label="商品编码" width="150"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="skuCode" label="规格编码" width="180"></el-table-column>
      <el-table-column prop="skuName" label="规格名称"></el-table-column>
      <go-boolean-column prop="combination" label="套装" width="60"></go-boolean-column>
      <go-quantity-column prop="planQuantity" label="赠品总数量" width="100"></go-quantity-column>
      <go-quantity-column prop="quantity" label="每次赠送数量" width="100"></go-quantity-column>
      <go-quantity-column prop="sentQuantity" label="已送数量" width="100"></go-quantity-column>
      <go-quantity-column prop="alertQuantity" label="预警数量" width="100"
                          v-if="rule.ruleType!=='LUCK_BAG'"></go-quantity-column>
      <el-table-column label="操作" width="80" v-if="canEdit">
        <template slot-scope="scope">
          <go-modify-button @click="modifyGift(scope.row)"></go-modify-button>
          <go-delete-button @click="removeGift(scope.row)"></go-delete-button>
        </template>
      </el-table-column>
    </el-table>
    <sku-selector ref="skuSelector" :columns="columns" :display="false"></sku-selector>
    <sku-importer ref="skuImporter" :must-columns="mustColumns"
                  templateUrl="/file/template/strategy_set_gift.xlsx/营销策略赠品导入模板"></sku-importer>
    <gift-edit ref="giftEditor"></gift-edit>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {Util} from '@/libs/util';
  import {GiftSkuColumns, GiftStrategyApi, MustGiftColumns} from '../api';
  import {StrategyGift} from '../util';
  import {Gift} from '@/modules/marketing/gift/mixin';
  import {SkuImporter, SkuSelector} from '@/modules/product';
  import {GiftEdit} from '../dialog';

  export default {
    mixins: [TableResize, List, Tabs, Gift],
    components: {SkuImporter, SkuSelector, GiftEdit},
    data() {
      return {
        tab: 'gift',
        pk: 'giftStrategyGiftId',
        api: GiftStrategyApi,
        domain: {},
        rule: {},
        columns: GiftSkuColumns,
        mustColumns: MustGiftColumns,
        relation: GiftSkuColumns,
      };
    },
    watch: {
      rule(val) {
        let luckyBag = {
          label: '福袋编码',
          prop: 'luckyCode',
          type: 'string',
        };
        let index = -1;
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].prop === luckyBag.prop) {
            index = i;
          }
        }
        if (val && val.ruleType === 'LUCK_BAG') {
          if (index < 0) {
            this.columns.unshift(luckyBag);
          }
        } else {
          if (index > -1) {
            this.columns.splice(index, 1);
          }
        }
      }
    },
    methods: {
      search() {
        if (this.parentData && this.parentData.rule) {
          this.domain = this.parentData;
          this.rule = this.parentData.rule;
          this.doSearch(GiftStrategyApi.listGifts(this.parentData.giftStrategyId,
            this.rule.giftStrategyRuleId));
        }
      },
      addGift() {
        this.$refs.skuSelector.showDialog({
          onSelected: skus => {
            GiftStrategyApi.addGift(this.domain.giftStrategyId, this.rule.giftStrategyRuleId,
              skus).then(this.search);
          }
        });
      },
      modifyGift(gift) {
        this.$refs.giftEditor.show(this.domain, this.rule, gift);
      },
      removeGift(gift) {
        this.api.removeGift(this.domain.giftStrategyId, this.rule.giftStrategyRuleId,
          gift.giftStrategyGiftId).then(this.search);
      },
      showImportGift() {
        this.$refs.skuImporter.show(skus => {
          let gifts = [];
          for (let sku of skus) {
            let gift = new StrategyGift(sku);
            gift.planQuantity = Util.getNumberProp(sku, '计划数量');
            gift.alertQuantity = Util.getNumberProp(sku, '预警数量');
            gift.quantity = Util.getNumberProp(sku, '赠送数量');
            gift.luckyCode = Util.getStringProp(sku, '福袋编码');
            gifts.push(gift);
          }
          return GiftStrategyApi.addGift(this.domain.giftStrategyId, this.rule.giftStrategyRuleId,
            gifts).then(this.search);
        });
      },
    }
  };
</script>