<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="字典编码" prop="dataDictItemCode">
        <el-input v-model="domain.dataDictItemCode"></el-input>
      </el-form-item>
      <el-form-item label="字典名称" prop="dataDictItemName">
        <el-input v-model="domain.dataDictItemName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-checkbox v-model="continuous">连续录入</el-checkbox>
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {Edit} from '@/libs/mixins';
  import {DataDictItemApi} from './api';

  export default {
    mixins: [Edit],
    props: {
      dataDict: Object
    },
    data() {
      return {
        pk: 'dataDictItemId',
        api: DataDictItemApi,
        continuous: true,
        rules: {
          dataDictItemCode: ValidateRules.code,
          dataDictItemName: ValidateRules.name
        }
      };
    },
    methods: {
      genDefaultDomain() {
        return {
          dataDictId: this.dataDict.dataDictId,
          system: false
        };
      }
    }
  };
</script>
