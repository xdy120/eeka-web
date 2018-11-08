<template>
  <div :style="{height:tabsTableHeight+'px'}">
    <el-form :model="domain" class="oms-search">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="会员呢称">
            <el-input v-model="domain.memberName" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退换类型">
            <el-input v-model="domain.returnType" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退入仓库">
            <el-input v-model="domain.inVirtualWarehouseName" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退回快递">
            <el-input v-model="domain.expressName" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="快递单号">
            <el-input v-model="domain.expressNo" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退货数量">
            <el-input v-model="domain.quantity" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="应退金额">
            <el-input v-model="domain.refundableAmount" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="domain.returnType==='正常换货'">
        <el-col :span="6">
          <el-form-item label="换出仓库">
            <el-input v-model="domain.outVirtualWarehouseName" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人">
            <el-input v-model="domain.contact" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号">
            <el-input v-model="domain.mobile" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话">
            <el-input v-model="domain.telephone" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="domain.returnType==='正常换货'">
        <el-col :span="6">
          <el-form-item label="区域">
            <el-input v-model="domain.regionPath" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地址">
            <el-input v-model="domain.address" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="domain.remark" type="textarea" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import {TableResize} from '@/libs/mixins';

  export default {
    name: 'ReturnOrderBasic',
    mixins: [TableResize],
    props: {
      parentData: {
        required: true
      }
    },
    data() {
      return {
        domain: this.parentData ? this.parentData : {}
      };
    },
    watch: {
      parentData(val) {
        this.domain = val ? val : {};
      },
    }
  };
</script>