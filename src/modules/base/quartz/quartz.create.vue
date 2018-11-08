<template>
  <el-dialog title="编辑" width="500px" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" label-position="right" label-width="100px"
             ref="editForm">
      <el-form-item label="任务名" prop="jobName">
        <el-input v-model="domain.jobName"></el-input>
      </el-form-item>
      <el-form-item label="任务组" prop="jobGroup">
        <el-input v-model="domain.jobGroup"></el-input>
      </el-form-item>
      <el-form-item label="触发器名" prop="triggerName">
        <el-input v-model="domain.triggerName"></el-input>
      </el-form-item>
      <el-form-item label="触发器组" prop="triggerGroup">
        <el-input v-model="domain.triggerGroup"></el-input>
      </el-form-item>
      <el-form-item label="执行类" prop="className">
        <el-input v-model="domain.className"></el-input>
      </el-form-item>
      <el-form-item label="触发器类型" prop="triggerType">
        <el-select v-model="domain.triggerType" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行间隔" v-if="domain.triggerType === 'SIMPLE'" prop="interval">
        <el-input v-model="domain.interval"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" v-if="domain.triggerType === 'CRON'" prop="cron">
        <el-input v-model="domain.cron"></el-input>
      </el-form-item>
      <el-form-item
          v-for="(map, index) in domain.mapList"
          :label="'数据项' + index"
          :key="index"
          :prop="map.value">
        <el-col :span="9"><el-input v-model="map.key"></el-input></el-col>
        <el-col :span="2" style="text-align: center">-</el-col>
        <el-col :span="9"><el-input v-model="map.value"></el-input></el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="danger" @click.prevent="removeMap(map)">删除</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDataMapItem">新增数据项</el-button>
      <el-button @click="submitJob('editForm')">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {QuartzApi} from './api';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'QuartzCreator',
    mixins: [Edit, ValidateRules],
    data() {
      return {
        api: QuartzApi,
        rules: {
          jobName: ValidateRules.required,
          jobGroup: ValidateRules.required,
          triggerName: ValidateRules.required,
          triggerGroup: ValidateRules.required,
          className: ValidateRules.required,
          triggerType: ValidateRules.required,
          interval: ValidateRules.required,
          cron: ValidateRules.required
        },
        options: [
          {value: 'SIMPLE', label: 'SIMPLE'},
          {value: 'CRON', label: 'CRON'}
        ],
        oldData: {
          jobName: '',
          jobGroup: ''
        }
      };
    },
    methods: {
      genDefaultDomain() {
        return {mapList: []};
      },
      show(entity) {
        if (entity) {
          this.api.get(entity['jobGroup'], entity['jobName']).then(r => {
            if (this.thenGet) {
              this.thenGet(r);
            }
            this.domain = r;
            this.oldData.jobName = r.jobName;
            this.oldData.jobGroup = r.jobGroup;
            this.editMode = true;
            this.visible = true;
            this.isRequestSend = false;
          });
        } else {
          if (this.$refs.editForm) {
            this.$refs.editForm.resetFields();
          }
          this.domain = this.genDefaultDomain();
          this.editMode = false;
          this.visible = true;
          this.isRequestSend = false;
        }
      },
      submitJob(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            if (this.domain.status) {
              this.api.modify(this.oldData.jobGroup, this.oldData.jobName, this.domain).then(r => {
                this.visible = false;
                this.$message.success('修改定时任务成功');
                this.$emit('ok', this.domain);
              });
            } else {
              this.api.get(this.domain.jobGroup, this.domain.jobName).then(r => {
                if (r) {
                  this.$message.error('该定时任务已存在');
                } else {
                  this.api.add(this.domain).then(r => {
                    this.visible = false;
                    this.$message.success('新增定时任务成功');
                    this.$emit('ok', this.domain);
                  });
                }
              });
            }
          }
        });
      },
      addDataMapItem() {
        this.domain.mapList.push({'key': '', 'value': ''});
      },
      removeMap(map) {
        var index = this.domain.mapList.indexOf(map);
        if (index !== -1) {
          this.domain.mapList.splice(index, 1);
        }
      }
    }
  };
</script>