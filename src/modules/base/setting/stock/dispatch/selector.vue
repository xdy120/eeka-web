<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="400" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-form-item label="策略名称">
              <el-input v-model="filter.stockDispatchStrategyName"></el-input>
            </el-form-item>
          </el-form>
        </el-header>
        <el-header :height="35">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table ref="dataTable" :data="list" :height="300" style="margin-top: 5px"
                    @current-change="currentRowChange" @row-dblclick="confirm">
            <el-table-column prop="stockDispatchStrategyName" label="策略名称"/>
            <el-table-column prop="mallWarehouse" label="商城区域仓" width="100"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择配货策略" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid
                 :disabled="disabled"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {StockDispatchStrategyApi} from '../api';
  import {List, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';

  export default {
    name: 'StockDispatchStrategySelector',
    mixins: [List, Selector],
    props: {
      stockDispatchStrategyName: {
        type: String
      }
    },
    data() {
      return {
        pk: 'stockDispatchStrategyId',
        api: StockDispatchStrategyApi,
        text: this.stockDispatchStrategyName
      };
    },
    created() {
      this.search();
    },
    methods: {
      customConfirm() {
        this.text = this.selectedItem.stockDispatchStrategyName;
        this.$emit('update:stockDispatchStrategyName', this.selectedItem.stockDispatchStrategyName);
      }
    },
    watch: {
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
        }
      },
      stockDispatchStrategyName(val) {
        this.text = val;
      }
    }
  };
</script>
