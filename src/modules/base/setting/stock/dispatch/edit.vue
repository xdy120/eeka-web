<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="110px">
      <el-form-item label="配货策略名称" prop="stockDispatchStrategyName">
        <el-input v-model="domain.stockDispatchStrategyName"></el-input>
      </el-form-item>
      <el-form-item label="商城仓库" prop="mallWarehouse">
        <el-input v-model="domain.mallWarehouse"></el-input>
      </el-form-item>
      <el-form-item label="默认快递" prop="defaultExpressId">
        <express-selector v-model="domain.defaultExpressId"
                          :express-name.sync="domain.defaultExpressName"></express-selector>
      </el-form-item>
      <el-form-item label="默认到付快递" prop="defaultCodExpressId">
        <express-selector v-model="domain.defaultCodExpressId"
                          :express-name.sync="domain.defaultCodExpressName"></express-selector>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {ExpressSelector, StoreSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';
  import {Edit} from '@/libs/mixins';
  import {StockDispatchStrategyApi} from '../api';

  export default {
    mixins: [Edit],
    components: {ExpressSelector, StoreSelector},
    data() {
      return {
        pk: 'stockDispatchStrategyId',
        api: StockDispatchStrategyApi,
        rules: {
          stockDispatchStrategyName: ValidateRules.requiredMax,
        }
      };
    },
    methods: {
      genDefaultDomain() {
        return {
          rule: {warehouses: []},
          autoUpload: true,
          manualUpload: true
        };
      },
      beforeDoSave() {
        this.domain.settingJson = JSON.stringify(this.domain.rule);
      }
    }
  };
</script>
