<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="500px" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form>
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-form>
        </el-header>
        <el-header height="35px">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table ref="dataTable" :data="list" :height="300" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <el-table-column prop="stockUploadStrategyName" label="配置名称"/>
            <el-table-column prop="mallWarehouse" label="商城区域仓" width="100"></el-table-column>
            <go-enable-column prop="autoUpload" label="自动上传" width="80px"></go-enable-column>
            <go-enable-column prop="manualUpload" label="手工上传" width="80px"></go-enable-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择上传配置" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid
                 :disabled="disabled"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {StockUploadStrategyApi} from '../api';
  import {List, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';
  import StoreSelector from '@/modules/base/store/store.selector';

  export default {
    components: {StoreSelector},
    mixins: [List, Selector],
    props: {
      settingStockUploadName: {
        type: String
      }
    },
    data() {
      return {
        pk: 'stockUploadStrategyId',
        api: StockUploadStrategyApi,
        text: this.stockUploadStrategyName
      };
    },
    methods: {
      customConfirm() {
        this.text = this.selectedItem.stockUploadStrategyName;
      }
    },
    created() {
      this.search();
    },
    watch: {
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
        }
      },
      stockUploadStrategyName(val) {
        this.text = val;
      }
    }
  };
</script>
