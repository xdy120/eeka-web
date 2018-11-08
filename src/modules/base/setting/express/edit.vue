<template>
  <el-dialog title="编辑" width="420px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="快递策略名称" prop="expressStrategyName" label-width="160px">
        <el-input v-model="domain.expressStrategyName"></el-input>
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
  import {ExpressStrategyApi} from './api';

  export default {
    mixins: [Edit],
    components: {DataDictItemSelector, StoreSelector, ExpressStrategyApi},
    data() {
      return {
        domain: {
          expresses: []
        },
        visible: false,
        pk: 'expressStrategyId',
        api: ExpressStrategyApi,
        rules: {
          expressStrategyName: ValidateRules.requiredMax
        }
      };
    },
    methods: {
      show(data) {
        if (data) {
          this.domain = data;
        } else {
          this.domain = {};
        }
        this.visible = true;
      },
      beforeDoSave() {
        this.domain.settingJson = JSON.stringify(this.domain.setting);
      }
    }
  };
</script>
