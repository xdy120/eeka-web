<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="名称" prop="stockUploadStrategyName">
        <el-input v-model="domain.stockUploadStrategyName"></el-input>
      </el-form-item>
      <el-form-item label="店铺" prop="storeName">
        <store-selector v-model="domain.storeId"
                        :store-name.sync="domain.storeName"></store-selector>
      </el-form-item>
      <el-form-item label="商城仓库" prop="mallWarehouse">
        <el-input v-model="domain.mallWarehouse"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <data-dict-item-selector v-model="domain.rule.brandNames"
                                 :dataDictId="10101" multiple></data-dict-item-selector>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="domain.autoUpload">自动上传</el-checkbox>
        <el-checkbox v-model="domain.manualUpload">手工上传</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {DataDictItemSelector, StoreSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';
  import {Edit} from '@/libs/mixins';
  import {StockUploadStrategyApi} from '../api';

  export default {
    mixins: [Edit],
    components: {DataDictItemSelector, StoreSelector},
    data() {
      return {
        domain: {
          rule: []
        },
        pk: 'stockUploadStrategyId',
        api: StockUploadStrategyApi,
        rules: {
          stockUploadStrategyName: ValidateRules.requiredMax,
          storeName: ValidateRules.required
        }
      };
    },
    methods: {
      genDefaultDomain() {
        return {
          rule: {warehouses: [], brandNames: ''},
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
