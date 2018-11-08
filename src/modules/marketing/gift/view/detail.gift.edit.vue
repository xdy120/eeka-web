<template>
  <el-dialog title="设置赠品" :visible.sync="visible" width="80%">
    <el-container>
      <el-form :model="filter" @keyup.enter.native="searchDetail" v-if="!this.isEnable">
        <el-header class="oms-search">
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
        </el-header>
      </el-form>
      <el-header class="oms-action" v-if="!this.isEnable">
        <el-button-group>
          <go-search-button @click="searchDetail">搜索</go-search-button>
          <go-clean-button @click="reset">清空</go-clean-button>
        </el-button-group>
        <el-button-group v-if="editMode">
          <sku-selector v-on:confirm="skuConfirm" :columns="columns"></sku-selector>
          <el-button @click="showSkuImport">导入</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <el-table :data="detailList" height="400px" show-summary :is-enable="this.isEnable">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <el-table-column label="套装">
            <template slot-scope="scope">
              <span :class="scope.row.combination?'success':'danger'">{{scope.row.combination?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="每次赠送数量">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row)">
                {{scope.row.quantity}}
              </div>
              <div v-else>
                <el-input size="small" v-model="scope.row.quantity"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="planQuantity" label="赠品总数量">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row)">
                {{scope.row.planQuantity}}
              </div>
              <div v-else>
                <el-input size="small" v-model="scope.row.planQuantity"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sentQuantity" label="已送数量">
            <template slot-scope="scope">
              <div>
                {{scope.row.sentQuantity}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="alertQuantity" label="预警数量">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row)">
                {{scope.row.alertQuantity}}
              </div>
              <div v-else>
                <el-input size="small" v-model="scope.row.alertQuantity"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope" v-if="!isEnable">
              <go-modify-button v-if="scope.row.giftStrategyGiftId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.giftStrategyGiftId"
                                 @click="modifyGift(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.giftStrategyGiftId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="scope.row.giftStrategyGiftId"
                                @click="removeGift(scope.row)"></go-delete-button>
              <go-delete-button v-else
                                @click="detailList.splice(scope.$index,1)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer :height="32" style="padding: 0">
        <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                       @current-change="searchDetail" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
      <sku-importer ref="skuImport" :must-columns="mustColumns" v-on:finish="readData"
                    templateUrl="/file/template/strategy_set_gift.xlsx/营销策略赠品导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {SkuColumns, MustGiftColumns, GiftSkuColumns, GiftStrategyApi} from '../api';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailEdit, TableResize, DetailList],
    components: {SkuSelector, ProductSearchPart, SkuImporter},
    data() {
      return {
        api: GiftStrategyApi,
        pk: 'giftStrategyRuleId',
        orderId: 'giftStrategyRuleId',
        entity: {},
        columns: GiftSkuColumns,
        sentQuantity: 0,
        relation: SkuColumns,
        mustColumns: MustGiftColumns,
        isEnable: null,
      };
    },
    computed: {},
    methods: {
      removeGift(gift) {
        this.$confirm('是否删除此赠品？').then(() => {
          this.api.removeGift(gift.productId, gift.giftStrategyRuleId,
            gift.giftStrategyGiftId).then(() => {
            this.$message.success('赠品删除成功');
            this.searchDetail();
          });
        });
      },
      add() {
        let entity = {};
        if (this.detailList.length > 0) {
          entity.details = this.detailList;
          GiftStrategyApi.addGift(this.entity.giftStrategyId, this.entity.giftStrategyRuleId,
            entity.details).then(r => {
            this.$message.success('提交成功');
            this.searchDetail();
          });
        } else {
          this.$message.error('至少要有一行明细');
        }
      },
      modifyGift(gift) {
        let entity = {};
        entity.details = this.detailList;
        GiftStrategyApi.modifyGift(this.entity.giftStrategyId, gift.giftStrategyRuleId, gift).then(
          () => {
            this.$message.success('修改成功');
            this.$delete(gift, '_back_data');
          });
      },
      searchDetail() {
        if (this.api) {
          return this.doSearch(
            this.api.listDetailGiftPage(this.entity.giftStrategyRuleId, this.filter,
              this.paging));
        }
      },
      show(entity, isEnable) {
        if (entity) {
          this.entity = entity;
          this.searchDetail();
          this.editMode = true;
          this.visible = true;
          this.isEnable = isEnable;
        } else {
          this.editMode = false;
          this.visible = true;
          this.isEnable = isEnable;
        }
      },
      skuConfirm(data) {
        if (!this.inserted) {
          this.detailList = [];
          this.inserted = true;
        }
        data.forEach(detail => {
          if (this.detailList.findIndex(v => v.skuId === detail.skuId) < 0) {
            detail[this.orderId] = this.entity[this.orderId];
            detail.sentQuantity = 0;
            this.detailList.push(detail);
          }
        });
      },
    },
  };
</script>