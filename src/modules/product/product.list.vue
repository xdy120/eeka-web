<template>
  <el-container>
    <el-header class="oms-search" height="95px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch"
               label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: right">
            <three-checkbox style="margin-left: 5px" v-model="filter.prepackage">预包装
            </three-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-input v-model="filter.productName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品条形码">
              <el-input v-model="filter.barcodes"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="品牌">
              <data-dict-item-selector v-model="filter.brandName" data-dict-id="10101"
                                       :code.sync="filter.brandCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年份">
              <data-dict-item-selector v-model="filter.listingYear"
                                       data-dict-id="10104"></data-dict-item-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="波段">
              <data-dict-item-selector v-model="filter.waveband"
                                       data-dict-id="10107"></data-dict-item-selector>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="openProductCreate()">新增</el-button>
        <el-button @click="showImport">导入</el-button>
        <el-button @click="productPriceImport">价格导入</el-button>
        <el-button @click="exportProduct()">导出</el-button>
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
            <el-button type="text" @click="batchToWms">转入WMS</el-button>
          </go-drop-down-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange" @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column prop="productCode" label="商品编码" width="200" sortable></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="barcode" label="商品条码"></el-table-column>
        <go-enum-column prop="productType" label="商品类型" enum-name="ProductType"></go-enum-column>
        <el-table-column prop="productShortName" label="商品简介"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="60"></el-table-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <go-enum-column prop="productSyncStatus" label="推送状态"
                        enum-name="ProductSyncStatus"></go-enum-column>
        <go-boolean-column prop="singleDelivery" label="独立发货" width="80"></go-boolean-column>
        <go-boolean-column prop="gift" label="赠品"></go-boolean-column>
        <go-enable-column prop="enable" label="状态"></go-enable-column>
        <el-table-column label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <go-tooltip-button tooltip="转入WMS" icon="import"
                               @click="toWms(scope.row)"></go-tooltip-button>
            <go-toggle :value="scope.row.enable" @change="toggleProduct(scope.row)"></go-toggle>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <tabs-footer ref="tabsFooter" @updated="scrollToRow">
      <el-tabs type="border-card" v-model="currentTab">
        <el-tab-pane name="basic" label="基本信息">
          <info :currentTab="currentTab" :parentData="selectedItem"></info>
        </el-tab-pane>
        <el-tab-pane name="sku" label="商品规格">
          <sku :currentTab="currentTab" :parentData="selectedItem"></sku>
        </el-tab-pane>
        <el-tab-pane name="attribute" label="商品属性">
          <attribute :currentTab="currentTab" :parentData="selectedItem"></attribute>
        </el-tab-pane>
        <el-tab-pane name="log" label="日志">
          <log-tab module-name="PRODUCT" :parent-data="selectedItem" prop="productId"
                   :current-tab="currentTab"/>
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-count="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <product-create ref="productCreater" @ok="search"></product-create>
    <product-editor ref="editor" @ok="search"></product-editor>
    <batch-processor ref="batchProcessor" @finish="search"></batch-processor>
    <excel-importer ref="excelImport" :must-columns="mustColumns" :templateUrl="templateUrl"
                    :batch="true" @finish="search"
                    @change="fileReady">
      <span style="float: right">共{{quantity}}个商品</span>
    </excel-importer>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import ProductCreate from './product.create.vue';
  import ProductEditor from './product.edit.vue';
  import SkuEditor from './sku/sku.edit.vue';
  import SkuInfoEditor from './sku/sku.info.vue';
  import {Attribute, Info, Sku} from './tabs';
  import {MustPriceColumns, MustProductColumns, ProductApi} from './api';
  import {LogTab} from '@/component/log';
  import {BatchProcessor, ExcelImporter} from '@/component/ui';
  import {DataDictItemSelector} from '@/modules/selector';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      SkuEditor,
      SkuInfoEditor,
      ProductCreate,
      ProductEditor,
      LogTab,
      Info,
      Sku,
      Attribute,
      BatchProcessor,
      ExcelImporter,
      DataDictItemSelector
    },
    data() {
      return {
        api: ProductApi,
        pk: 'productId',
        codeProp: 'productCode',
        currentTab: 'basic',
        quantity: 0,
        templateUrl: '',
        mustColumns: MustProductColumns,
      };
    },
    methods: {
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
      },
      toggleProduct(product) {
        if (product.enable) {
          ProductApi.disable(product.productId).then(() => product.enable = false);
        } else {
          ProductApi.enable(product.productId).then(() => product.enable = true);
        }
      },
      openProductCreate() {
        this.$refs.productCreater.show();
      },
      batchEnable() {
        this.doBatch('商品批量启用', item => {
          return ProductApi.enable(item.productId);
        }, item => !item.enable);
      },
      batchDisable() {
        this.doBatch('商品批量禁用', item => {
          return ProductApi.disable(item.productId);
        }, item => item.enable);
      },
      batchToWms() {
        this.doBatch('商品批量推送WMS', item => {
          return ProductApi.noticeWms(item.productId);
        }, item => item.enable);
      },
      toWms(product) {
        ProductApi.noticeWms(product.productId).then(() => {
          this.$message.success('已提交后台进行推送...');
        });
      },
      showImport() {
        this.quantity = 0;
        this.templateUrl = '/file/template/product.xlsx/商品管理-商品导入模板';
        this.mustColumns = MustProductColumns;
        this.$refs.excelImport.show(this.doImport);
      },
      productPriceImport() {
        this.quantity = 0;
        this.templateUrl = '/file/template/product_price.xlsx/商品管理-价格导入模板';
        this.mustColumns = MustPriceColumns;
        this.$refs.excelImport.show(this.priceImport);
      },
      exportProduct() {
        this.exportData(value => this.api.exportSku(value, this.filter));
      },
      fileReady(list) {
        let productSet = new Set();
        list.forEach(x => productSet.add(x['商品编码']));
        this.quantity = productSet.size;
      },
      doImport(list) {
        return ProductApi.importProduct(list);
      },
      priceImport(list) {
        return ProductApi.importPrice(list);
      }
    }
  };
</script>
