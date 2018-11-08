<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="名称" prop="dataDictName">
        <el-input v-model="domain.dataDictName"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="dataDictType">
        <enum-selector enum-name="DataDictType" v-model="domain.dataDictType"></enum-selector>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {TreeEdit} from '@/libs/mixins';
  import {DataDictApi} from './api';

  export default {
    mixins: [TreeEdit],
    data() {
      return {
        pk: 'dataDictId',
        api: DataDictApi,
        rules: {
          dataDictName: ValidateRules.name,
          dataDictType: ValidateRules.required
        }
      };
    }
  };
</script>
