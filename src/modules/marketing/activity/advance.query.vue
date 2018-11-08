<template>
  <el-form :model="domain">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="开始时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.beginTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.beginTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="结束时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.endTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.endTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="制单时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.createdTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.createdTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="制单人" label-width="100px">
          <el-input v-model="filter.creator" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="审核时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.auditedTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.auditedTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审核人" label-width="100px">
          <el-input v-model="filter.auditor" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" style="text-align: right">
        <el-button-group>
          <go-search-button @click="clickSearch">搜索</go-search-button>
          <go-clean-button @click="reset">清空</go-clean-button>
        </el-button-group>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>

  export default {
    name: 'AdvanceQuery',
    props: {
      filter: Object
    },
    data() {
      return {
        domain: this.filter
      };
    },
    watch: {
      filter(val) {
        this.domain = val;

      }
    },
    methods: {
      reset() {
        this.$emit('reset');
      },
      search() {
        this.$emit('search', this.domain);
      },
      cancel() {
        this.$emit('cancel');
      }
    }
  };
</script>