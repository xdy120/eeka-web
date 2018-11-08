<style>
  #num{font-size: 40px;color: red}
  #expressNo{font-size: 40px}
  #expressName{font-size: 30px;line-height: 36px}
  #weight{font-size: 30px;line-height: 36px}
  #expressId{font-size: 30px;line-height: 36px}
</style>
<template>
  <el-dialog title="B2C快递签收" fullscreen :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-form :model="domain" ref="editForm" label-width="80px" :rules="rules">
      <el-row :gutter="10" type="flex" justify="center">
        <el-col :span="21">
          <el-col :span="12">
            <el-form-item  prop="expressName" label-width="200px" size="medium">
              <label slot="label" id="expressId" >快递公司</label>
              <express-selector v-model="domain.expressId" :expressName.sync="domain.expressName"
                                :out-filter="expressFilter" use-default></express-selector>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label-width="200px" size="medium">
              <label slot="label" id="weight" >重量(KG)</label>
              <el-input-number v-model.trim="domain.weight"></el-input-number>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="center">
        <el-col :span="21">
          <el-col :span="12">
            <el-form-item label-width="200px" size="medium" prop="expressNo">
              <label slot="label"  id = "expressName">快递单号</label>
              <el-input v-model.trim="domain.expressNo" @keyup.enter.native="insertList()"
                  id="expressNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="200px" size="medium">
              <label slot="label" style="font-size: 30px;">已扫数量</label>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <label slot="label" id = "num">{{this.domain.num}}</label>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="center" >
       <el-col :span="18">
        <el-table :data="domain.list" :height="400" max-height="400px">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="快递公司" prop="expressName"></el-table-column>
          <el-table-column label="重量" prop="weight" width="150px"></el-table-column>
          <el-table-column label="快递单号" prop="expressNo" width="400px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <go-delete-button @click="removeItem(scope.$index)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
       </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" type="flex" justify="right" >
      <el-col :span="12">
        <el-button @click="cancle">返回</el-button>
      </el-col>
      <el-col :span="9">
        <el-button @click="submitAndAdd">提交并继续录入</el-button>
        <el-button @click="submit">提交</el-button>
      </el-col>
    </div>
  </el-dialog>
</template>
<script>
  import {ReturnSignApi} from '../api';
  import {ExpressSelector} from '@/modules/base/index';
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'SignCreator',
    mixins: [Edit],
    components: {ExpressSelector},
    props: {},
    data() {
      return {
        pk: 'returnSignId',
        api: ReturnSignApi,
        expressFilter: {
          expressUses: 'AFTER_SALE,ALL'
        },
        rules: {
          expressName: ValidateRules.required,
          expressNo: ValidateRules.required
        }
      };
    },
    methods: {
      genDefaultDomain(){
        return {
          num: 0
        };
      },
      databaseVilidata() {
        this.domain.num = this.domain.num + 1;
        this.domain.list.push({
          'expressNo': this.domain.expressNo, 'expressName': this.domain.expressName,
          'weight': this.domain.weight, 'expressId': this.domain.expressId
        });
        this.domain.expressNo = null;
      },
      insertList() {
        this.$refs.editForm.validate().then(() => {
          if (this.domain.list) {
            if (this.domain.list.findIndex(v => v.expressNo === this.domain.expressNo) >= 0) {
              this.$message.error('快递单号已在下表记录');
            } else {
              this.databaseVilidata();
            }
          }else{
            this.domain.list = [];
            this.databaseVilidata();
          }
        });
      },
      removeItem(index) {
        this.$delete(this.domain.list, index);
        this.domain.num = this.domain.num - 1;
        this.$message.success('删除成功');
      },
      submit() {
        if (this.domain.list && this.domain.list.length > 0) {
          ReturnSignApi.addBatch(this.domain.list).then(() => {
            this.$message.success('快递签收成功');
            this.visible = false;
            this.domain.num = 0;
            this.$emit('ok', this.domain);
          });
        } else {
          this.$message.error('至少要有一行明细');
        }
      },
      submitAndAdd() {
        if (this.domain.list && this.domain.list.length > 0) {
          ReturnSignApi.addBatch(this.domain.list).then(() => {
            this.$message.success('快递签收成功');
            this.domain = {};
            this.domain.num = 0;
          });
        } else {
          this.$message.error('至少要有一行明细');
        }
      },
      resetFields() {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      },
      cancle(){
        this.close();
      }
    }
  };
</script>
