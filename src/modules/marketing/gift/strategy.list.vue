<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="策略编号">
              <el-input v-model="filter.giftStrategyCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="策略名称">
              <el-input v-model="filter.giftStrategyName"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="策略类型">
              <enum-selector v-model="filter.giftStrategyType" enum-name="GiftStrategyType"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="活动规格编码">
              <el-input v-model="filter.giftStrategySkuCode"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="赠品规格编码">
              <el-input v-model="filter.giftSkuCode"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="showCreator('NORMAL')">新增策略</el-button>
        <el-button @click="showCreator('GROUP')">新增分组</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange">
        <el-table-column prop="giftStrategyCode" width="150" label="策略编号"/>
        <el-table-column prop="giftStrategyName" label="策略名称"/>
        <go-enum-column prop="giftStrategyType" enum-name="GiftStrategyType" label="策略类型"
                        width="100"/>
        <go-enum-column prop="timeType" enum-name="TimeType" label="时间类型"/>
        <go-date-time-column prop="beginTime" label="开始时间"/>
        <go-date-time-column prop="endTime" label="结束时间"/>
        <go-quantity-column prop="priorityNo" label="优先级"/>
        <go-enable-column prop="enable" label="状态"/>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <go-toggle :value="scope.row.enable" @change="toggleEnable(scope.row)"/>
            <go-modify-button v-if="!scope.row.enable" type="text" @click="showEditor(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <tabs-footer ref="tabsFooter" @updated="scrollToRow">
      <el-tabs type="border-card" v-model="currentTab">
        <el-tab-pane name="store" label="关联店铺">
          <store-list :parent-data="selectedItem" :current-tab="currentTab"></store-list>
        </el-tab-pane>
        <template v-if="selectedItem">
          <el-tab-pane v-if="selectedItem.giftStrategyType==='NORMAL'" name="rule" label="规则">
            <rule :parent-data="selectedItem" :current-tab="currentTab"></rule>
          </el-tab-pane>
          <el-tab-pane v-if="selectedItem.giftStrategyType==='NORMAL'" name="sku" label="活动商品">
            <sku-list :parent-data="selectedItem" :current-tab="currentTab"></sku-list>
          </el-tab-pane>
          <el-tab-pane v-if="selectedItem.giftStrategyType==='NORMAL'" name="gift" label="赠品">
            <gift-list :parent-data="selectedItem" :current-tab="currentTab"></gift-list>
          </el-tab-pane>
          <el-tab-pane name="rules" label="组内策略" v-if="selectedItem.giftStrategyType==='GROUP'">
            <rule-list :parent-data="selectedItem" :current-tab="currentTab"></rule-list>
          </el-tab-pane>
        </template>
        <el-tab-pane name="log" label="日志">
          <log-tab module-name="GIFT_STRATEGY" :parent-data="selectedItem" prop="giftStrategyId"
                   :current-tab="currentTab"/>
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-count="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <strategy-creator ref="creator" @ok="search"></strategy-creator>
    <strategy-editor ref="editor" @ok="search"></strategy-editor>
  </el-container>
</template>


<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {LogTab} from '@/component/log';
  import {GiftStrategyApi} from './api';
  import {GiftList, Rule, RuleList, SkuList, StoreList} from './view';
  import {StrategyCreator, StrategyEditor, StrategyRuleEditor} from './dialog';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      LogTab,
      StoreList,
      RuleList,
      Rule,
      GiftList,
      SkuList,
      StrategyCreator,
      StrategyEditor,
      StrategyRuleEditor
    },
    data() {
      return {
        pk: 'giftStrategyId',
        api: GiftStrategyApi,
        currentTab: 'store',
      };
    },
    watch: {
      selectedItem(val) {
        if (val) {
          if (val.giftStrategyType === 'NORMAL') {
            if (!val.rule) {
              GiftStrategyApi.listRules(val.giftStrategyId).then(data => {
                if (data.length > 0) {
                  val.rule = data[0];
                  val.rule.setting = JSON.parse(val.rule.ruleSetting);
                }
              });
            }
            if (this.currentTab !== 'store' && this.currentTab !== 'log') {
              this.currentTab = 'rule';
            }
          } else {
            if (this.currentTab !== 'store' && this.currentTab !== 'log') {
              this.currentTab = 'rules';
            }
          }
        } else {
          this.currentTab = 'store';
        }
      }
    },
    methods: {
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
      },
      showCreator(strategyType) {
        this.$refs.creator.show(strategyType);
      }
    }
  };
</script>