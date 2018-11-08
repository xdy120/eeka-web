<template>
  <el-dialog :title="title" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="名称" prop="attributeName">
        <el-input v-model="domain.attributeName"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="attributeType">
        <enum-selector v-model="domain.attributeType"
                       enum-name="ProductAttributeType"></enum-selector>
      </el-form-item>
      <el-form-item label="数据字典" v-show="domain.attributeType=='DATA_DICT'">
        <data-dict-selector v-model="domain.dataDictId"></data-dict-selector>
      </el-form-item>
      <el-form-item v-show="domain.attributeType=='DATA_DICT'">
        <el-checkbox v-model="domain.useCode">用于编码生成</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {AttributeApi} from '../api';
  import {DataDictSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';
  import {Edit} from '@/libs/mixins';

  export default {
    name: 'AttributeEditor',
    mixins: [Edit],
    components: {DataDictSelector},
    data() {
      return {
        pk: 'attributeId',
        api: AttributeApi,
        rules: {
          attributeName: ValidateRules.name,
          attributeType: ValidateRules.required
        }
      };
    },
    methods: {
      genDefaultDomain() {
        return {useCode: false, system: false};
      },
    }
  };
</script>
