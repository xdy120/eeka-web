<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="套装编码">
              <el-input v-model="filter.skuCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="套装名称">
              <el-input v-model="filter.skuName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <three-checkbox v-model="filter.giftBox">礼盒</three-checkbox>
            <three-checkbox v-model="filter.prepackage">预包装</three-checkbox>
            <three-checkbox v-model="filter.lockStock">锁定库存</three-checkbox>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="showEditor()">新增</el-button>
      <el-button-group>
        <el-button @click="showImport">导入</el-button>
        <el-button @click="showExport">导出</el-button>
      </el-button-group>
      <el-dropdown>
        <el-button>
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <go-drop-down-item>
            <el-button type="text" @click="batchEnable">启用</el-button>
          </go-drop-down-item>
          <go-drop-down-item>
            <el-button type="text" @click="batchDisable">禁用</el-button>
          </go-drop-down-item>
          <go-drop-down-item divided>
            <el-button type="text" @click="batchSetPrepackage">预包装</el-button>
          </go-drop-down-item>
          <go-drop-down-item>
            <el-button type="text" @click="batchUnsetPrepackage">非预包装</el-button>
          </go-drop-down-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-main v-resize="mainHeight">
      <combination-editor ref="editor" @ok="search"></combination-editor>
      <batch-processor ref="batchProcessor" @finish="search"></batch-processor>
      <el-table ref="dataTable" :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange" @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column prop="skuCode" label="套装编码"></el-table-column>
        <el-table-column prop="skuName" label="套装名称"></el-table-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <go-money-column prop="sellingPrice" label="销售价"></go-money-column>
        <go-boolean-column prop="giftBox" label="礼盒"></go-boolean-column>
        <go-boolean-column prop="prepackage" label="预包装"></go-boolean-column>
        <!--<go-boolean-column prop="lockStock" label="锁库存" :width="60"></go-boolean-column>-->
        <go-enable-column prop="enable" label="状态"></go-enable-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"/>
            <go-toggle :value="scope.row.enable" @change="toggleCombination(scope.row)"/>
            <go-toggle :onText="'预包装'" :offText="'非预包装'" :value="scope.row.prepackage"
                       @change="togglePrepackage(scope.row)"/>
            <!--<go-lock-button tooltip="锁库存"></go-lock-button>-->
            <!--<go-unlock-button tooltip="释放库存"></go-unlock-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <tabs-footer ref="tabsFooter" @updated="scrollToRow">
      <el-tabs type="border-card" v-model="currentTab">
        <el-tab-pane name="detail" label="明细商品">
          <combination-detail :currentTab="currentTab"
                              :parentData="selectedItem"></combination-detail>
        </el-tab-pane>
        <el-tab-pane name="log" label="日志">
          <log-tab module-name="PRODUCT_SKU" :currentTab="currentTab" prop="skuId"
                   :parentData="selectedItem"></log-tab>
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-count="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <excel-importer ref="excelImport" :must-columns="mustColumns" :batch="true" @finish="search"
                    @change="fileReady"
                    templateUrl="/file/template/product_combination.xlsx/组合商品导入模板">
      <span style="float: right">共{{importQuantity}}个套装</span>
    </excel-importer>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {MustCombinationColumns, SkuApi} from '../api';
  import CombinationEditor from './combination.edit.vue';
  import {SkuSelector} from '@/modules/selector';
  import CombinationDetail from './tabs/detail.vue';
  import {LogTab} from '@/component/log';
  import {BatchProcessor, ExcelImporter} from '@/component/ui';
  import {Util} from '@/libs/util';

  class CombinationFilter {
    constructor() {
      this.combination = true;
    }
  }

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      CombinationEditor, SkuSelector, CombinationDetail, LogTab, BatchProcessor, ExcelImporter
    },
    data() {
      return {
        api: SkuApi,
        pk: 'skuId',
        codeProp: 'skuCode',
        currentTab: 'detail',
        importQuantity: 0,
        mustColumns: MustCombinationColumns,
        filter: new CombinationFilter()
      };
    },
    methods: {
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
      },
      search() {
        this.doSearch(SkuApi.listCombination(this.filter, this.paging));
      },
      resetFilter() {
        this.filter = new CombinationFilter();
      },
      batchEnable() {
        this.doBatch('批量启用', item => {
          return SkuApi.enableCombination(item.skuId);
        }, item => !item.enable);
      },
      batchDisable() {
        this.doBatch('批量禁用', item => {
          return SkuApi.disableCombination(item.skuId);
        }, item => item.enable);
      },
      toggleCombination(combination) {
        if (combination.enable) {
          SkuApi.disableCombination(combination.skuId).then(() => combination.enable = false);
        } else {
          SkuApi.enableCombination(combination.skuId).then(() => combination.enable = true);
        }
      },
      showImport() {
        this.importQuantity = 0;
        this.$refs.excelImport.show(this.doImport);
      },
      showExport() {
        this.exportData(value => this.api.exportCombination(value, this.filter));
      },
      fileReady(list) {
        let set = new Set();
        list.forEach(x => set.add(x['套装编码']));
        this.importQuantity = set.size;
      },
      doImport(list) {
        return SkuApi.importCombination(list);
      },
      togglePrepackage(combination) {
        if (combination.prepackage) {
          SkuApi.disablePrepackage(combination.skuId).then(() => combination.prepackage = false);
        } else {
          SkuApi.enablePrepackage(combination.skuId).then(() => combination.prepackage = true);
        }
      },
      batchSetPrepackage() {
        this.doBatch('批量设置预包装', item => {
          return SkuApi.enablePrepackage(item.skuId);
        }, item => !item.prepackage);
      },
      batchUnsetPrepackage() {
        this.doBatch('批量取消预包装', item => {
          return SkuApi.disablePrepackage(item.skuId);
        }, item => item.prepackage);
      }
    }
  };
</script>
