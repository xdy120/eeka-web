<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="区域编码" prop="regionCode">
        <el-input v-model="domain.regionCode"></el-input>
      </el-form-item>
      <el-form-item label="区域名称" prop="regionName">
        <el-input v-model="domain.regionName"></el-input>
      </el-form-item>
      <el-form-item label="区域简称">
        <el-input v-model="domain.regionShortName"></el-input>
      </el-form-item>
      <el-form-item label="邮编">
        <el-input v-model="domain.zip"></el-input>
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="domain.longitude"></el-input>
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="domain.latitude"></el-input>
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
  import {RegionApi} from './api';

  export default {
    name: 'RegionEditor',
    mixins: [TreeEdit],
    data() {
      return {
        pk: 'regionId',
        api: RegionApi,
        rules: {
          regionCode: {required: true, max: 25, message: '编码[1-25]不能为空', trigger: 'manual'},
          regionName: ValidateRules.name
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