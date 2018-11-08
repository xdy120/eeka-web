<template>
  <el-select placeholder="请选择配货仓库" v-model="selected" @change="selectedItemChange"
             value-key="virtualWarehouseId">
    <el-option
        v-for="item in list"
        :key="item.virtualWarehouseId"
        :label="item.virtualWarehouseName"
        :value="item">
    </el-option>
  </el-select>
</template>
<script>
  import {StockDispatchStrategyApi} from '@/modules/base/setting/index';
  import {Assert} from '@/libs/util';

  export default {
    name: 'DispatchWarehouseSelector',
    props: {
      value: String,
      virtualWarehouseName: null,
      storeId: {
        String,
        require: true,
      },
    },
    data() {
      return {
        list: [],
        selected: null,
      };
    },
    created() {
      if (this.storeId) {
        StockDispatchStrategyApi.getStrategyVirtualWarehouse(this.storeId).then(item => {
          this.list = item;
          this.bind(this.value);
        });
      }
    },
    watch: {
      value(val) {
        this.bind(val);
      },
      storeId(storeId) {
        if (storeId) {
          StockDispatchStrategyApi.getStrategyVirtualWarehouse(this.storeId).then(item => {
            this.list = item;
            this.bind(this.value);
          });
        } else {
          this.list = [];
          this.selected = null;
        }
      },
    },
    methods: {
      bind(val) {
        if (val && !Assert.isEmpty(this.list)) {
          this.selected = this.list.find(x => x.virtualWarehouseId === val);
        } else {
          this.selected = null;
        }
      },
      selectedItemChange(item) {
        if (item) {
          this.$emit('input', item.virtualWarehouseId);
          this.$emit('change', item);
        } else {
          this.$emit('input', null);
          this.$emit('change', null);
        }
      },
    }
  };
</script>