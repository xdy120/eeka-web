<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下载类型">
              <enum-selector v-model="filter.downloadType" enum-name="DownloadType"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <store-edit ref="editor" @ok="search"></store-edit>
      <el-table ref="dataTable" :data="list" :height="mainHeight">
        <el-table-column prop="storeName" label="名称"></el-table-column>
        <go-enum-column prop="downloadType" enum-name="DownloadType" label="下载类型"
                        width="120"></go-enum-column>
        <go-date-time-column prop="beginTime" label="开始时间"></go-date-time-column>
        <go-quantity-column width="80px" prop="delayMinutes" label="延迟分钟"></go-quantity-column>
        <go-quantity-column width="80px" prop="intervalSeconds" label="间隔秒数"></go-quantity-column>
        <go-enum-column enum-name="JobTriggerType" prop="jobTriggerType" label="触发类型"
                        width="100"></go-enum-column>
        <go-quantity-column width="80px" prop="jobInterval" label="任务间隔"></go-quantity-column>
        <el-table-column prop="jobCron" label="Cron表达式" width="100px"></el-table-column>
        <go-enable-column></go-enable-column>
        <go-supplement-column label="开启补单"></go-supplement-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <go-toggle :value="scope.row.enable" @change="toggleEnable(scope.row)"></go-toggle>
            <su-toggle :value="scope.row.supplement"
                       @change="toggleSupplement(scope.row)"></su-toggle>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <store-auth ref="storeAuth"></store-auth>
  </el-container>
</template>
<script>
  import {DetailEdit, List, TableResize} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/selector';
  import {StoreDownloadConfigApi} from './api';
  import StoreAuth from './auth';
  import StoreEdit from './store.download.config.edit.vue';

  export default {
    mixins: [List, TableResize, DetailEdit],
    components: {StoreEdit, StoreSelector, StoreAuth},
    data() {
      return {
        pk: 'storeDownloadConfigId',
        api: StoreDownloadConfigApi
      };
    },
    created() {
      this.search();
    },
    methods: {
      accessToken(store) {
        this.$refs.storeAuth.show(store);
      },
      toggleSupplement(row) {
        let entity = {};
        entity[this.pk] = row[this.pk];
        entity.version = row.version;
        if (!row.supplement) {
          this.api.enableSupplement(row[this.pk], entity).then(() => {
            this.$message.success('已启用');
            row.supplement = true;
            this.clickSearch();
          });
        } else {
          this.api.disableSupplement(row[this.pk], entity).then(() => {
            this.$message.warning('已禁用');
            row.supplement = false;
            this.clickSearch();
          });
        }
      },
    }
  };
</script>
