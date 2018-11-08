<template>
  <el-dialog title="编辑" :visible.sync="visible" width="400px">
    <div style="margin-bottom: 5px" v-if="!domain.enable">
      <el-button @click="addGift">新增</el-button>
      <el-button @click="showImportGift">导入</el-button>
    </div>
    <el-table ref="dataTable" :data="list" :height="canEdit?tabsMinTableHeight:tabsTableHeight">
      <el-table-column prop="luckyCode" label="福袋编码" width="100"
                       v-if="rule.ruleType==='LUCK_BAG'"></el-table-column>
      <el-table-column prop="productCode" label="商品编码" width="100"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="skuCode" label="规格编码" width="100"></el-table-column>
      <el-table-column prop="skuName" label="规格名称" width="100"></el-table-column>
      <go-boolean-column prop="combination" label="套装" width="60"></go-boolean-column>
      <go-quantity-column prop="quantity" label="赠送数量" width="100"></go-quantity-column>
      <go-quantity-column prop="planQuantity" label="计划数量" width="100"></go-quantity-column>
      <go-quantity-column prop="sentQuantity" label="已送数量" width="100"></go-quantity-column>
      <go-quantity-column prop="alertQuantity" label="预警数量" width="100"
                          v-if="rule.ruleType!=='LUCK_BAG'"></go-quantity-column>
      <el-table-column label="操作" width="80" v-if="!domain.enable">
        <template slot-scope="scope">
          <go-modify-button @click="modifyGift(scope.row)"></go-modify-button>
          <go-delete-button @click="remove(scope.row)"></go-delete-button>
        </template>
      </el-table-column>
    </el-table>
    <sku-selector ref="skuSelector" :columns="columns" :display="false"></sku-selector>
    <sku-importer ref="skuImporter"></sku-importer>
    <gift-edit ref="giftEditor"></gift-edit>
  </el-dialog>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {Util} from '@/libs/util';
  import {DialogColumns, GiftStrategyApi} from '../api';
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
        domain: {},
        rule: {},
        columns: DialogColumns,
      };
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
            let gifts = skus.map(x => new StrategyGift(x));
            GiftStrategyApi.addGift(this.domain.giftStrategyId, this.rule.giftStrategyRuleId,
              gifts).then(this.search);
          }
        });
      },
      modifyGift(gift) {
        this.$refs.giftEditor.show(this.domain, this.rule, gift);
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
      }
    }
  };
</script>