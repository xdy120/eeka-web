<template>
  <div>
    <div style="margin-bottom: 5px" v-if="canEdit">
      <el-button @click="addRule">新增</el-button>
    </div>
    <el-table ref="dataTable" :data="list" :height="canEdit?tabsMinTableHeight:tabsTableHeight">
      <el-table-column prop="giftStrategyRuleName" label="规则名称"></el-table-column>
      <go-enum-column prop="ruleType" enum-name="GiftStrategyRuleType"
                      label="规则类型"></go-enum-column>
      <go-quantity-column prop="priorityNo" label="优先级" width="80"></go-quantity-column>
      <go-enum-column label="活动范围" prop="setting.productRange" enum-name="ProductRange">
      </go-enum-column>
      <el-table-column label="活动商品" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailProductEditor(scope.row)"
                     v-if="showButton(scope.row)">{{canEdit?'设置活动商品':'查看活动商品'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="赠品" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailGiftEditor(scope.row)">
            {{canEdit?'设置赠品':'查看赠品'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="canEdit">
        <template slot-scope="scope">
          <go-modify-button @click="modifyRule(scope.row)"></go-modify-button>
          <go-delete-button @click="removeRule(scope.row)"></go-delete-button>
        </template>
      </el-table-column>
    </el-table>
    <strategy-rule-editor ref="ruleEditor"></strategy-rule-editor>
    <strategy-rule-basic-editor ref="ruleBasicEditor" @ok="search"></strategy-rule-basic-editor>
    <!--设置活动商品编辑界面-->
    <detail-product-edit ref="detailProductEditor"></detail-product-edit>
    <detail-gift-edit ref="detailGiftEditor"></detail-gift-edit>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import DetailProductEdit from './detail.product.edit.vue';
  import DetailGiftEdit from './detail.gift.edit.vue';
  import {GiftStrategyApi} from '../api';
  import {Gift} from '../mixin';
  import {StrategyRuleBasicEditor, StrategyRuleEditor} from '../dialog';

  export default {
    mixins: [TableResize, List, Tabs, Gift],
    components: {StrategyRuleEditor, StrategyRuleBasicEditor, DetailProductEdit, DetailGiftEdit},
    data() {
      return {
        tab: 'rules',
        pk: 'giftStrategyRuleId',
        api: GiftStrategyApi
      };
    },
    computed: {
      canEdit() {
        return this.parentData && !this.parentData.enable;
      }
    },
    created() {
      this.search();
    },
    methods: {
      search() {
        if (this.parentData) {
          this.doSearch(GiftStrategyApi.listRules(this.parentData.giftStrategyId));
        }
      },
      addRule() {
        this.$refs.ruleEditor.show(null, rule => {
          GiftStrategyApi.addRule(this.parentData.giftStrategyId, rule).then(this.search);
        });
      },
      modifyRule(rule) {
        this.$refs.ruleBasicEditor.show(rule);
      },
      showDetailProductEditor(entity) {
        if (this.$refs.detailProductEditor) {
          this.$refs.detailProductEditor.show(entity, this.parentData.enable);
        }
      },
      showDetailGiftEditor(entity) {
        if (this.$refs.detailGiftEditor) {
          this.$refs.detailGiftEditor.show(entity, this.parentData.enable);
        }
      },
      removeRule(rule) {
        this.api.removeRule(this.parentData.giftStrategyId, rule.giftStrategyRuleId).then(
          this.search);
      },
      showButton(entity) {
        return entity.setting.productRange !== 'ALL';
      }
    }
  };
</script>