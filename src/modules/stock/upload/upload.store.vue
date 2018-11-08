<template>
  <el-container>
    <el-header height="75px" class="oms-search">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="上传配置">
              <stock-upload-setting-selector v-model="strategyId"></stock-upload-setting-selector>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-button @click="storeUpload">开始单店库存同步</el-button>
            <go-search-button @click="search">刷新日志</go-search-button>
            <!--<el-button @click="allUpload">全店库存同步</el-button>-->
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input v-model="filter.batchId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="filter.status">
                <el-option value="成功">成功</el-option>
                <el-option value="失败">失败</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="logs" :height="mainHeight">
        <el-table-column prop="_source.batchId" label="批次号" :width="150"/>
        <el-table-column prop="_source.storeName" label="店铺" :width="150"/>
        <el-table-column prop="_source.productCode" label="商品编码" :width="150" sortable/>
        <el-table-column prop="_source.skuCode" label="规格编码" :width="150" sortable/>
        <el-table-column prop="_source.quantity" label="上传数量" :width="100"/>
        <el-table-column prop="_source.status" label="状态" :width="80"/>
        <el-table-column prop="_source.oper" label="操作人" :width="80"/>
        <go-date-time-column prop="_source.@timestamp" label="上传日期"
                             type="datetime"></go-date-time-column>
        <el-table-column prop="_source.message" label="内容"/>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="pager.page" :page-size="pager.pageSize"
                     :total="pager.total" @current-change="search" @size-change="handleSizeChange"/>
    </el-footer>
  </el-container>
</template>
<script>
  import {Log, TableResize} from '@/libs/mixins';
  import {SkuSelector, StockUploadSettingSelector} from '@/modules/selector';
  import {LogApi} from '@/component';
  import {Assert} from '@/libs/util';
  import {StockUploadApi} from './api';

  export default {
    mixins: [TableResize, Log],
    components: {SkuSelector, StockUploadSettingSelector},
    data() {
      return {
        strategyId: null,
        logApi: LogApi,
        logIndex: 'stock-upload-*'
      };
    },
    methods: {
      storeUpload() {
        if (!Assert.isBlank(this.strategyId)) {
          this.$confirm('单店初始化将同步店铺所有的商品库存数据，此过程不可逆，请谨慎操作。确认上传请点击【确定】', '提示',
            {type: 'warning'}).then(() => {
            StockUploadApi.storeUpload(this.strategyId).then(batchId => {
              this.filter.batchId = batchId;
              this.search();
            });
          });
        } else {
          this.$message.error('请选择库存策略！');
        }
      },
      allUpload() {
        this.$confirm('全店初始化将同步所有在售店铺的商品库存数据，此过程不可逆，请谨慎操作。确认上传请点击【确定】', '提示',
          {type: 'warning'}).then(() => {
          StockUploadApi.allUpload().then(batchId => {
            this.filter.batchId = batchId;
            this.search();
          });
        });
      },
      buildFilter(query) {
        if (this.filter.batchId) {
          query.push({match: {'batchId': this.filter.batchId}});
        }
        if (this.filter.productCode) {
          query.push({match: {'productCode': this.filter.productCode}});
        }
        if (this.filter.skuCode) {
          query.push({match: {'skuCode': this.filter.skuCode}});
        }
        if (this.filter.status) {
          query.push({match: {'status': this.filter.status}});
        }
      }
    }
  };
</script>