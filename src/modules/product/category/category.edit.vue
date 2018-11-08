<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="编码" prop="productCategoryCode">
        <el-input v-model="domain.productCategoryCode"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="productCategoryName">
        <el-input v-model="domain.productCategoryName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="beforeDoSave">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {TreeEdit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {CategoryApi} from '../api';

  export default {
    name: 'ProductCategoryEditor',
    mixins: [TreeEdit],
    data() {
      return {
        pk: 'productCategoryId',
        api: CategoryApi,
        rules: {
          productCategoryCode: ValidateRules.code,
          productCategoryName: ValidateRules.name
        }
      };
    },
    methods: {
      beforeDoSave() {
        this.$refs.editForm.validate().then(() => {
          this.doSave();
        });
      }
    }
  };
</script>