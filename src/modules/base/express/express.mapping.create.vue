<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="110px">
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form-item label="快递名称" prop="expressName">
            <express-selector v-model="domain.expressId"
                              :express-name.sync="domain.expressName"></express-selector>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="外部编码" prop="outerCode">
            <el-input v-model="domain.outerCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form-item label="物流接口" prop="wmsAppId">
            <wms-app-selector v-model="domain.wmsAppId"></wms-app-selector>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {ExpressWmsMappingApi} from './api';
  import {ExpressSelector, WmsAppSelector} from '@/modules/selector';

  export default {
    name: 'ExpressMappingCreator',
    mixins: [Edit],
    components: {
      ExpressSelector,
      WmsAppSelector,
      ValidateRules
    },
    props: {},
    data() {
      return {
        api: ExpressWmsMappingApi,
        pk: 'expressWmsMappingId',
        standards: [],
        rules: {
          expressName: {required: true, max: 10, message: '快递名称[1-10]不能为空', trigger: 'manual'},
          outerCode: ValidateRules.required,
          wmsAppId: ValidateRules.required,
        },
      };
    },
    methods: {
      doSave() {
        if (this.domain.expressWmsMappingId) {
          ExpressWmsMappingApi.modify(
              this.domain.expressWmsMappingId,
              this.domain
          ).then(() => {
            this.visible = false;
            this.$message.success('修改快递成功');
            this.$emit('ok', this.domain);
          });
        } else {
          ExpressWmsMappingApi.add(this.domain).then(() => {
            this.visible = false;
            this.$message.success('新增快递成功');
            this.$emit('ok', this.domain);
          });
        }
      },
    },
  };
</script>