<template>
  <el-dialog title="明细" :visible.sync="visible" :fullscreen="true">
    <el-container>
      <el-header class="oms-search" style="height: 70px">
        <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="商品编码">
                <el-input v-model="filter.productCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规格编码">
                <el-input v-model="filter.skuCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <three-checkbox style="margin-left: 40px;margin-top: 5px" v-model="filter.abnormal">
                异常
              </three-checkbox>
              <three-checkbox style="margin-left: 40px;margin-top: 5px"
                              v-model="filter.vipPriceAbnormal">
                唯品价异常
              </three-checkbox>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-header class="oms-action">
        <el-button-group>
          <go-search-button @click="clickSearch">搜索</go-search-button>
          <go-clean-button @click="reset">清空</go-clean-button>
        </el-button-group>
      </el-header>
      <el-main>
        <el-table :data="detailList" height="400px" show-summary>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <go-abnormal-column label="唯品价异常" prop="vipPriceAbnormal"
                              width="100"></go-abnormal-column>
          <el-table-column label="退货单编码" prop="vipReturnCode"></el-table-column>
          <el-table-column label="商品编码" prop="productCode"></el-table-column>
          <el-table-column label="商品名称" prop="productName"></el-table-column>
          <el-table-column label="规格编码" prop="skuCode"></el-table-column>
          <el-table-column label="规格名称" prop="skuName"></el-table-column>
          <go-money-column label="唯品价" prop="vipPrice"></go-money-column>
          <go-quantity-column label="通知数量" prop="noticeQuantity"></go-quantity-column>
          <go-quantity-column label="正品入库数量" prop="inQuantity" width="100"></go-quantity-column>
          <go-quantity-column label="次品入库数量" prop="inSubstandardQuantity" width="100"></go-quantity-column>
          <go-money-column label="唯品金额" prop="vipAmount"></go-money-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                       @current-change="search" @size-change="pageSizeChange"/>
      </el-footer>
    </el-container>
  </el-dialog>
</template>
<script>
  import {DetailEdit, DetailList, List, PageList} from '@/libs/mixins';
  import {ProductSearchPart} from '@/modules/product/index';
  import {VipReturnNoticeDetailApi} from './api';

  export default {
    mixins: [List, PageList, DetailList, DetailEdit],
    components: {ProductSearchPart},
    data() {
      return {
        api: VipReturnNoticeDetailApi,
        pk: 'vipReturnNoticeDetailId',
        orderId: 'vipReturnNoticeId',
      };
    }
  };
</script>
