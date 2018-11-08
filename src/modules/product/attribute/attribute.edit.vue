<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="名称" prop="attributeName">
        <el-input v-model="domain.attributeName"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="attributeType">
        <enum-selector v-model="domain.attributeType"
                       enum-name="ProductAttributeType"></enum-selector>
      </el-form-item>
      <el-form-item label="数据字典" v-if="domain.attributeType=='DATA_DICT'">
        <data-dict-selector v-model="domain.dataDictId"
                            :data-dict-name.sync="domain.dataDictName"></data-dict-selector>
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
          attributeName: [ValidateRules.name],
          attributeType: ValidateRules.required
        },
      };
    },
    watch: {
      ['domain.attributeType'](val) {
        if (val !== 'DATA_DICT') {
          this.cleanAttribute();
        }
      }
    },
    methods: {
      genDefaultDomain() {
        return {useCode: false, system: false};
      },
      doSave() {
        if (this.domain[this.pk]) {
          //更新
          AttributeApi.modify(this.domain[this.pk], this.domain).then(result => {
            if (result === '') {
              this.$message.error('属性名称不能重复');
            } else {
              this.$emit('ok', this.domain);
              this.close();
              this.$message.success('单据修改成功');
              this.cleanAttribute();
            }
          });
        } else {
          //新增
          AttributeApi.add(this.domain).then(result => {
            if (result === '') {
              this.$message.error('属性名称不能重复');
            } else {
              this.$emit('ok', this.domain);
              this.close();
              this.$message.success('单据新增成功');
            }
          });
        }
      },
      onClosed(){
        this.cleanAttribute();
      },
      cleanAttribute(){
        this.domain.dataDictId = '';
        this.domain.dataDictName = '';
      },
    }
  };
</script>
