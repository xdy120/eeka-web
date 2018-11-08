<template>
  <el-dialog title="明细" :visible.sync="visible" :fullscreen="true">
    <el-container>
      <el-header class="oms-search">
        <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="店铺名称">
                <el-input v-model="filter.storeName" placeholder="支持右侧模糊匹配"
                          style="width: 135px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-header class="oms-action">
        <el-col :span="4">
          <el-button-group style="width: 135px">
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="resetDetail">清空</go-clean-button>
          </el-button-group>
        </el-col>
        <el-col :span="6" v-if="editMode && editing.length===0">
          <store-selector v-model="domain.storeId" :multiple=true
                          @confirm="storeConfirm"></store-selector>
        </el-col>
      </el-header>
      <el-main>
        <el-table :data="details" height="400px">
          <go-selection-column></go-selection-column>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="storeName" label="店铺名称"></el-table-column>
          <el-table-column prop="rate" label="上传比例">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row) && scope.row.presellStoreId">
                {{scope.row.rate}}%
              </div>
              <div v-else>
                <el-input v-model="scope.row.rate">
                  <template slot="suffix">%</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.presellStoreId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.presellId" type="text"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button type="text" v-if="canEdit(scope.row) && scope.row.presellStoreId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button type="text" v-if="editMode"
                                @click="remove(scope.$index)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add()">提交</el-button>
      </div>
    </el-container>
  </el-dialog>
</template>
<script>
  import {DetailEdit, List, PageList, TableResize} from '@/libs/mixins';
  import {PresellStoreApi} from './api';
  import {SkuSelector, StoreSelector} from '@/modules/selector';

  export default {
    name: 'StoreEdit',
    mixins: [List, PageList, DetailEdit, TableResize],
    components: {SkuSelector, StoreSelector},
    data() {
      return {
        api: PresellStoreApi,
        pk: 'presellStoreId',
        orderId: 'presellId',
      };
    },
    methods: {
      show(row) {
        if (row.status === 'CREATED') {
          this.editMode = true;
        }
        this.domain = row;
        this.filter.presellId = row.presellId;
        this.search();
        this.visible = true;
      },
      search() {
        PresellStoreApi.listStores(this.domain.presellId, this.filter, this.paging).then(r => {
          this.details = r.data;
          this.total = r.total;
        });
      },
      resetDetail() {
        this.filter = {[this.orderId]: this.domain[this.orderId]};
      },
      remove(index) {
        let detail = this.details[index];
        if (detail[this.pk]) {
          PresellStoreApi.remove(detail.presellId, detail.presellStoreId).then(r => {
            this.$message.success(`明细: ${detail.storeName} 删除成功`);
            this.$delete(this.details, index);
          });
        } else {
          this.$delete(this.details, index);
        }
      },
      modify(index) {
        let detail = this.details[index];
        if (detail[this.pk]) {
          PresellStoreApi.modifyStore(detail[this.orderId], detail[this.pk], detail).then(r => {
            console.log(r);
            this.$message.success(`明细: ${detail.storeName} 修改成功`);
            this.$set(this.details, index, r);
            this.$delete(this.editing, index);
          });
        } else {
          this.api.addStore(detail[this.orderId], detail).then(r => {
            this.$message.success(`明细: ${detail.storeName} 新增成功`);
            this.$set(this.details, index, r);
            this.$delete(this.editing, index);
          });
        }
      },
      add() {

      },
      storeConfirm(data) {
        data.forEach(row => {
          if (this.details.findIndex(v => v.storeId === row.storeId) < 0) {
            row.presellId = this.domain.presellId;
            row.rate = 100;
            this.details.unshift(row);
          }
        });
      },
    },
  };
</script>