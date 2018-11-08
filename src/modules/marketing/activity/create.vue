<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="活动明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <activity-basic ref="editForm" v-model="domain"></activity-basic>
    </div>
    <div v-show="stepTitle==='活动明细'">
      <el-container>
        <el-header height="35px">
          <sku-selector @confirm="selectSkus" :columns="columns"></sku-selector>
          <el-button @click="showSkuImport">导入</el-button>
        </el-header>
        <el-main>
          <el-table :data="domain.details" height="400px" show-summary>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="productCode" label="商品编码" width="120px"></el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column prop="skuCode" label="规格编码" width="120px"></el-table-column>
            <el-table-column prop="skuName" label="规格名称"></el-table-column>
            <el-table-column prop="planQuantity" label="计划数量" width="120px">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.planQuantity"
                                 :min="0"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120px">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.price"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="金额" width="120px">
              <template slot-scope="scope">
                {{(isNaN(scope.row.planQuantity) ? 0 : scope.row.planQuantity ) *
                (isNaN(scope.row.price) ? 0:scope.row.price)}}
              </template>
            </el-table-column>
            <el-table-column label="平台商品ID" width="120px">
              <template>
                <el-input v-model="scope.row.mallProductId"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px" fixed="right">
              <template slot-scope="scope">
                <go-delete-button @click="removeDetail(scope.$index)"></go-delete-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
    <sku-importer ref="skuImport" :must-columns="mustColumns" @finish="readData"
                  templateUrl="/file/template/activity.xlsx/活动报名导入模板"></sku-importer>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import {SkuImporter, SkuSelector} from '@/modules/product/index';
  import {ActivityApi, MustColumns, SkuColumns} from './api';
  import ActivityBasic from './base.vue';

  export default {
    name: 'ActivtyCreator',
    mixins: [Steps, Edit],
    components: {SkuSelector, ActivityBasic, SkuImporter},
    data() {
      return {
        pk: 'activityId',
        api: ActivityApi,
        stepTitle: '基本信息',
        columns:SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
              if (!this.domain.useLockQuantity) {
                this.domain.useLockQuantity = false;
              }
              this.next();
            });
            return;
          case '活动明细':
            if (!this.domain.details) {
              this.$message.warning('请选择明细');
              return;
            } else {
              this.next();
            }
            break;
          default:
            this.next();
            break;
        }
      },
    },
  }
  ;
</script>
