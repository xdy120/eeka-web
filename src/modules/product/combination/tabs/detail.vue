<template>
  <div>
    <div style="margin-bottom: 5px">
      <sku-selector text="新增" @confirm="selectSkus" quantity></sku-selector>
    </div>
    <el-table ref="dataTable" :data="list" :height="tabsMinTableHeight">
      <el-table-column prop="productCode" label="商品编码"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="skuCode" label="规格编码"></el-table-column>
      <el-table-column prop="skuName" label="规格名称"></el-table-column>
      <el-table-column prop="quantity" label="数量"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <go-delete-button v-if="!domain.enable" @click="removeDetail(scope.row)"></go-delete-button>
          <el-button type="text" v-if="!scope.row.mainSku" @click="setMainSku(scope.row)">设为主商品</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {SkuSelector} from '@/modules/selector';
  import {CombinationApi} from '../../api';

  export default {
    name: 'CombinationDetail',
    mixins: [TableResize, List, Tabs],
    components: {SkuSelector},
    data() {
      return {
        tab: 'detail',
        pk: 'combinationDetailId',
        api: CombinationApi,
        domain: this.parentData
      };
    },
    methods: {
      search() {
        if (this.parentData) {
          this.domain = this.parentData;
          this.doSearch(CombinationApi.listDetail(this.parentData.skuId));
        }
      },
      removeDetail(row) {
        this.$confirm('删除后不可恢复，是否删除？').then(() => {
          CombinationApi.removeDetail(row.combinationId, row.combinationDetailId).then(this.search);
        });
      },
      selectSkus(skus) {
        let details = [];
        for (let sku of skus) {
          details.push({
            combinationId: this.domain.skuId,
            productId: sku.productId,
            productCode: sku.productCode,
            productName: sku.productName,
            skuId: sku.skuId,
            skuCode: sku.skuCode,
            skuName: sku.skuName,
            quantity: sku.quantity
          });
        }
        CombinationApi.addDetail(this.parentData.skuId, details).then(this.search);
      },
      setMainSku(row){
        CombinationApi.setMainSku(row.combinationId,row).then(()=>{
          this.search();
        });
      }
    }
  };
</script>