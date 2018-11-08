<template>
  <el-container>
    <el-header class="oms-search" height="100px">
      <el-form :model="filter" label-width="100px" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="24" align="right">
            <three-checkbox style="margin-left: 5px" v-model="filter.matched">已关联</three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.manual">人工关联</three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.autoUpload">自动上传
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.autoListing">自动上架
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.autoDelisting">自动下架
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.combination">组合商品
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.dropShipping">代发
            </three-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品状态">
              <enum-selector v-model="filter.mallProductStatus"
                             enum-name="MallProductStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统商品编码">
              <el-input v-model="filter.productCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统规格编码">
              <el-input v-model="filter.skuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="平台商品ID">
              <el-input v-model="filter.mallProductIds" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台规格ID">
              <el-input v-model="filter.mallSkuIds" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商家商品编码">
              <el-input v-model="filter.mallProductOutCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商家规格编码">
              <el-input v-model="filter.mallSkuOutCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
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
        <el-button @click="download(false)">铺货下载</el-button>
        <el-button @click="download(true)">全店下载</el-button>
      </el-button-group>
      <el-button @click="exportMappings">导出</el-button>
      <el-dropdown>
        <el-button>
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <go-drop-down-item @click="batchRemove">删除</go-drop-down-item>
          <go-drop-down-item @click="batchUpload" divided>启用自动上传</go-drop-down-item>
          <go-drop-down-item @click="batchUnUpload">禁用自动上传</go-drop-down-item>
          <go-drop-down-item @click="batchListing" divided>启用自动上架</go-drop-down-item>
          <go-drop-down-item @click="batchUnListing">禁用自动上架</go-drop-down-item>
          <go-drop-down-item @click="batchDelisting" divided>启用自动下架</go-drop-down-item>
          <go-drop-down-item @click="batchUnDelisting">禁用自动下架</go-drop-down-item>
          <go-drop-down-item @click="batchDropShipping">代发</go-drop-down-item>
          <go-drop-down-item @click="batchUnDropShipping">取消代发</go-drop-down-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-checkbox v-model="imgColumnVisible">显示图片</el-checkbox>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" @current-change="currentRowChange"
                @selection-change="selectionChange" :height="mainHeight">
        <go-selection-column></go-selection-column>
        <el-table-column label="图片" v-if="imgColumnVisible" width="105px">
          <template slot-scope="scope">
            <div style="height: 104px;width: 100px;padding-top: 2px;padding-bottom: 2px">
              <img :src="scope.row.imageUrl" style="width: 100%"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标记" width="150">
          <template slot-scope="scope">
            <tooltip-icon tooltip="未关联" icon="break" v-if="!scope.row.matched"></tooltip-icon>
            <tooltip-icon tooltip="自动上传" icon="upload" v-if="scope.row.autoUpload"></tooltip-icon>
            <tooltip-icon tooltip="自动上架" icon="listing" v-if="scope.row.autoListing"></tooltip-icon>
            <tooltip-icon tooltip="自动下架" icon="delisting"
                          v-if="scope.row.autoDelisting"></tooltip-icon>
            <el-tag v-if="scope.row.dropShipping">代发</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="店铺" width="100"></el-table-column>
        <go-enum-column prop="marketingType" enum-name="MarketingType" label="活动"></go-enum-column>
        <go-link-column prop="mallProductId" label="平台商品ID" width="120"
                        @click="jumpToMallProductPage"></go-link-column>
        <el-table-column prop="mallProductName" label="平台商品名称" width="120"></el-table-column>
        <el-table-column prop="mallSkuId" label="平台规格Id" width="120"></el-table-column>
        <el-table-column prop="mallSkuName" label="平台规格名称" width="120"></el-table-column>
        <go-money-column prop="mallSkuPrice" label="平台价格"></go-money-column>
        <go-quantity-column prop="mallSkuQuantity" label="平台库存" width="70"></go-quantity-column>
        <go-enum-column prop="mallProductStatus" label="平台状态"
                        enum-name="MallProductStatus"></go-enum-column>
        <el-table-column prop="mallProductOutCode" label="商家商品编码" width="100"></el-table-column>
        <el-table-column prop="mallSkuOutCode" label="商家规格编码" width="120"></el-table-column>
        <el-table-column prop="productCode" label="系统商品编码" width="120" sortable></el-table-column>
        <el-table-column prop="productName" label="系统商品名称" width="120"></el-table-column>
        <el-table-column prop="skuCode" label="系统规格编码" width="120" sortable></el-table-column>
        <el-table-column prop="skuName" label="系统规格名称" width="120"></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <go-date-time-column prop="createdTime" label="创建日期"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新日期"></go-date-time-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <sku-selector type="text" text="关联" title="手动关联铺货关系" :multiple="false"
                          @confirm="selectSkus"/>
            <go-toggle :value="scope.row.dropShipping" :onText="'代发'" :offText="'取消代发'"
                       @change="dropShippingChange(scope.row)"></go-toggle>
            <log-popover module-name="PRODUCT_MALL_MAPPING"
                         :bizId="scope.row.productMallMappingId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="35px">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <batch-processor ref="batchProcessor" @finish="search"></batch-processor>
    <download ref="downloader"></download>
    <!--<sku-importer ref="skuImport" v-on:finish="readData"></sku-importer>-->
  </el-container>
</template>

<script>
  import {ProductMallMappingApi} from '../api';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/selector';
  import {BatchProcessor} from '@/component/ui';
  import Download from './download';
  import {ValidateRules} from '@/libs/util';
  import AdvanceQuery from './advance.query.vue';
  import {LogPopover} from '@/component/log';
  import {SkuImporter, SkuSelector} from '@/modules/product/index';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      StoreSelector,
      BatchProcessor,
      Download,
      AdvanceQuery,
      SkuSelector,
      SkuImporter,
      LogPopover
    },
    data() {
      return {
        imgColumnVisible: false,
        productMallMappingId: '',
        api: ProductMallMappingApi,
        pk: 'productMallMappingId',
        codeProp: 'mallSkuOutCode',
        rules: {
          storeId: ValidateRules.required,
          mallProductId: [
            {min: 0, max: 500, message: '长度在 0 到 500 个字符'}
          ],
          mallProductOutCode: [
            {min: 0, max: 500, message: '长度在 0 到 500 个字符'}
          ],
        },
      };
    },
    methods: {
      download(downloadAll) {
        this.$refs.downloader.show(downloadAll);
      },
      batchRemove() {
        this.doBatch('批量删除铺货', item => {
          return ProductMallMappingApi.remove(item.productMallMappingId);
        });
      },
      batchUpload() {
        this.doBatch('批量启用自动上传', item => {
          item.autoUpload = 1;
          return ProductMallMappingApi.modify(item.productMallMappingId, item);
        });
      },
      batchUnUpload() {
        this.doBatch('批量禁用自动上传', item => {
          item.autoUpload = 0;
          return ProductMallMappingApi.modify(item.productMallMappingId, item);
        });
      },
      batchListing() {
        this.doBatch('批量启动自动上架', item => {
          item.autoListing = 1;
          return ProductMallMappingApi.modify(item.productMallMappingId, item);
        });
      },
      batchUnListing() {
        this.doBatch('批量启动自动上架', item => {
          item.autoListing = 0;
          return ProductMallMappingApi.modify(item.productMallMappingId, item);
        });
      },
      batchDelisting() {
        this.doBatch('批量启动自动下架', item => {
          item.autoDelisting = 1;
          return ProductMallMappingApi.modify(item.productMallMappingId, item);
        });
      },
      batchUnDelisting() {
        this.doBatch('批量禁止自动下架', item => {
          item.autoDelisting = 0;
          return ProductMallMappingApi.modify(item.productMallMappingId, item);
        });
      },
      batchDropShipping() {
        this.doBatch('批量设置代发', item => {
          return ProductMallMappingApi.setDropShipping(item);
        }, item => !item.dropShipping);
      },
      batchUnDropShipping() {
        this.doBatch('批量取消代发', item => {
          return ProductMallMappingApi.cancelDropShipping(item);
        }, item => item.dropShipping);
      },
      selectSkus(sku) {
        this.selectedItem.skuId = sku.skuId;
        this.selectedItem.skuCode = sku.skuCode;
        this.selectedItem.skuName = sku.skuName;
        this.selectedItem.productId = sku.productId;
        this.selectedItem.productCode = sku.productCode;
        this.selectedItem.productName = sku.productName;
        this.selectedItem.matched = 1;
        this.selectedItem.manual = 1;
        ProductMallMappingApi.modify(this.selectedItem.productMallMappingId,
          this.selectedItem).then(this.search);
      },
      exportMappings() {
        if (!this.filter.storeId) {
          this.$message.error('至少选择店铺');
          return;
        }
        this.exportData(value => this.api.export(value, this.filter));
      },
      dropShippingChange(mapping) {
        if (!mapping.dropShipping) {
          ProductMallMappingApi.setDropShipping(mapping).then(() => {
            mapping.dropShipping = true;
            this.search();
          });
        } else {
          ProductMallMappingApi.cancelDropShipping(mapping).then(() => {
            mapping.dropShipping = false;
            this.search();
          });
        }
      },
      jumpToMallProductPage(mapping) {
        ProductMallMappingApi.getMallProductUrl(mapping).then(url => {
          window.open(url, '_blank');
        });
      }
    }
  };
</script>
