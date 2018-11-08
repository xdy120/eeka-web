<template>
  <el-dialog title="明细" :visible.sync="visible" :fullscreen="true">
    <el-container>
      <el-header class="oms-search">
        <product-search-part v-model="filter"></product-search-part>
      </el-header>
      <el-header class="oms-action">
        <el-button-group>
          <go-search-button @click="clickSearch">搜索</go-search-button>
          <go-clean-button @click="reset">清空</go-clean-button>
        </el-button-group>
        <el-button-group v-if="editMode">
          <sku-selector v-on:confirm="skuConfirm" :columns="columns"></sku-selector>
          <el-button @click="showSkuImport">导入</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <el-table :data="detailList" height="400px" show-summary>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <go-enum-column prop="status" label="状态"
                          enum-name="ActivityDetailStatus"></go-enum-column>
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <el-table-column prop="mallProductId" label="平台商品ID">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.activityDetailId">
                {{scope.row.mallProductId}}
              </template>
              <template v-else>
                <el-input v-model="scope.row.mallProductId"></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="lockQuantity" label="锁定数量" width="100px"></el-table-column>
          <el-table-column prop="planQuantity" label="计划数量" width="100px">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.activityDetailId">
                {{scope.row.planQuantity}}
              </template>
              <template v-else>
                <el-input size="small" v-model="scope.row.planQuantity"></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.activityDetailId">
                {{scope.row.price}}
              </template>
              <template v-else>
                <el-input size="small" v-model="scope.row.price"></el-input>
              </template>
            </template>
          </el-table-column>
          <go-money-column label="金额" width="80px">
            <template slot-scope="scope">
              {{(isNaN(scope.row.planQuantity) ? 0 : scope.row.planQuantity ) *
              (isNaN(scope.row.price) ? 0:scope.row.price)}}
            </template>
          </go-money-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" width="150px" fixed="right">
            <template slot-scope="scope">
              <tooltip-button tooltip="开始"></tooltip-button>

              <go-modify-button v-if="editMode && scope.row.activityDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.activityId" type="text"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.activityDetailId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="editMode"
                                @click="toRemove(scope.$index,scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer :height="32" style="padding: 0">
        <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
      <sku-importer ref="skuImport" :must-columns="mustColumns" @finish="readData"
                    templateUrl="/file/template/activity.xlsx/活动报名导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {ActivityDetailApi, MustColumns, SkuColumns} from './api';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import TooltipButton from '@/component/ui/tooltip.icon';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {TooltipButton, SkuSelector, ProductSearchPart, SkuImporter},
    data() {
      return {
        api: ActivityDetailApi,
        pk: 'activityDetailId',
        orderId: 'activityId',
        columns: SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns
      };
    },
    methods: {
      toRemove(scope, row) {
        this.$confirm('确认要删除明细吗？').then(() => {
          if (row[this.pk]) {
            let entity = {};
            entity[this.orderId] = this.entity[this.orderId];
            entity.version = this.entity.version;
            entity.status = this.entity.status;
            entity.details = [row];
            this.api.removeDetail(entity[this.orderId], entity).then(x => {
              this.$message.success('删除成功');
              this.show(x);
            });
          }
        });
      }
    }
  };
</script>