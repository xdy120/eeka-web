<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-button @click="openSkuEditor()">新增</el-button>
      <el-button @click="openSkuBatchEditor()">批量修改</el-button>
    </div>
    <el-table ref="skuTable" :data="list" :height="tabsMinTableHeight">
      <el-table-column prop="skuCode" label="规格编码"></el-table-column>
      <el-table-column prop="skuName" label="规格名称"></el-table-column>
      <el-table-column prop="barcode" label="条码"></el-table-column>
      <el-table-column prop="color" label="颜色"></el-table-column>
      <el-table-column prop="size" label="尺码"></el-table-column>
      <go-money-column prop="vipPrice" label="唯品价"></go-money-column>
      <go-money-column prop="markedPrice" label="吊牌价"></go-money-column>
      <go-money-column prop="sellingPrice" label="销售价"></go-money-column>
      <go-money-column prop="costPrice" label="成本价"></go-money-column>
      <go-money-column prop="purchasePrice" label="采购价"></go-money-column>
      <go-money-column prop="distributionPrice" label="分销价"></go-money-column>
      <go-money-column prop="logisticsInsurance" label="保价"></go-money-column>
      <go-boolean-column prop="prepackage" label="预包装"></go-boolean-column>
      <go-enable-column prop="enable" label="状态"></go-enable-column>
      <el-table-column prop="logisticsInsurance" label="操作" width="150">
        <template slot-scope="scope">
          <go-modify-button @click="openSkuEditor(scope.row.skuId)"/>
          <go-toggle :value="scope.row.enable" @change="toggleSku(scope.row)"/>
          <go-toggle :onText="'预包装'" :offText="'非预包装'" :value="scope.row.prepackage"
                     @change="togglePrepackage(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <sku-editor ref="skuEditor" :product="parentData" :remote="true" @ok="search"/>
    <el-dialog title="批量修改 " width="600px" :visible.sync="batchEditorVisible"
               :before-close="dialogCloseConfirm">
      <sku-info-editor ref="skuInfoEditor" :batch="true"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="skuInfoEditorOk">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {Assert} from '@/libs/util';
  import {AttributeApi, ProductApi, SkuApi} from '../api';
  import SkuEditor from '../sku/sku.edit.vue';
  import SkuInfoEditor from '../sku/sku.info.vue';

  export default {
    name: 'ProductAttribute',
    mixins: [TableResize, List, Tabs],
    components: {SkuEditor, SkuInfoEditor},
    data() {
      return {
        tab: 'sku',
        pk: 'skuId',
        domain: this.parentData,
        batchEditorVisible: false
      };
    },
    created() {
      AttributeApi.listCustom().then(data => {
        this.attributes = data;
      });
    },
    methods: {
      search() {
        if (this.parentData) {
          this.domain = this.parentData;
          this.doSearch(ProductApi.listSkus(this.parentData.productId), this.$refs.skuTable);
        }
      },
      toggleSku(sku) {
        if (sku.enable) {
          SkuApi.disable(sku.skuId).then(() => sku.enable = false);
        } else {
          SkuApi.enable(sku.skuId).then(() => sku.enable = true);
        }
      },
      openSkuEditor(skuId) {
        this.$refs.skuEditor.show(skuId);
      },
      openSkuBatchEditor() {
        if (Assert.isEmpty(this.domain) || Assert.isEmpty(this.domain.productId)) {
          this.$message.warning('请选择商品！');
        } else {
          this.batchEditorVisible = true;
        }
      },
      skuInfoEditorOk() {
        let data = this.$refs.skuInfoEditor.getModifyInfo();
        ProductApi.modifySkus(this.domain.productId, data).then(() => {
          this.batchEditorVisible = false;
          this.search();
        });
      },
      togglePrepackage(sku) {
        if (sku.prepackage) {
          SkuApi.disablePrepackage(sku.skuId).then(() => sku.prepackage = false);
        } else {
          SkuApi.enablePrepackage(sku.skuId).then(() => sku.prepackage = true);
        }
      }
    }
  };
</script>