<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form label-width="100px" @submit.native.prevent="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="快递策略名称">
              <el-input v-model="filter.expressStrategyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="showEditor()">新增</el-button>
    </el-header>
    <el-container>
      <el-main v-resize="mainHeight">
        <el-table ref="dataTable" :data="list" :height="mainHeight"
                  @current-change="currentStrategyChange">
          <el-table-column prop="expressStrategyName" label="策略名称"/>
          <go-date-time-column prop="createdTime" label="创建时间" width="160"></go-date-time-column>
          <go-date-time-column prop="modifiedTime" label="修改时间" width="160"></go-date-time-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <go-add-button @click="addExpress(scope.row)" tooltip="新增快递策略"></go-add-button>
              <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
              <go-delete-button @click="remove(scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-aside width="400px" style="padding-left: 5px">
        <el-table :data="expresses" :height="mainHeight" @current-change="currentExpressChange">
          <el-table-column prop="expressName" label="快递名称"/>
          <go-quantity-column prop="priorityNo" label="优先级" width="80"></go-quantity-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <go-modify-button @click="updExpress(scope.row)"></go-modify-button>
              <go-delete-button @click="delExpress(scope.row,scope.$index)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
        <express-edit ref="expressEdit"></express-edit>
        <edit ref="editor" @ok="search"></edit>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script>
  import {List, TableResize} from '@/libs/mixins';
  import {ExpressStrategyApi} from './api';
  import {StoreSelector} from '@/modules/selector';
  import ExpressEdit from './express.edit';
  import Edit from './edit';

  export default {
    mixins: [TableResize, List],
    components: {StoreSelector, ExpressEdit, Edit},
    data() {
      return {
        pk: 'expressStrategyId',
        api: ExpressStrategyApi,
        selectedExpress: null,
        expresses: [],
      };
    },
    created() {
      this.search();
    },
    methods: {
      thenSearch(response) {
        if (response.length > 0) {
          response.forEach(x => {
            x.rule = JSON.parse(x.settingJson);
          });
          this.list = response;
        }
      },
      currentStrategyChange(strategy) {
        this.selectedItem = strategy;
        if (strategy && strategy.rule.expresses) {
          this.expresses = strategy.rule.expresses;
        } else {
          this.expresses = [];
        }
      },
      currentExpressChange(express) {
        this.selectedExpress = express;
      },
      addExpress(strategy) {
        this.$refs.expressEdit.show(e => {
          if (this.expresses.some(x => x.expressId === e.expressId)) {
            this.$message.error('该快递已添加');
          } else {
            this.expresses.push(e);
            this.modifySetting(strategy);
          }
        });
      },
      updExpress(w) {
        this.$refs.expressEdit.upd(w, e => {
          if (this.selectedItem.rule != null && this.selectedItem.rule.length > 0) {
            this.selectedItem.rule.forEach(x => {
              if (x.expressId === e.expressId) {
                x.priorityNo = e.priorityNo;
                x.expressId = e.expressId;
                x.expressName = e.expressName;
              }
            });
          }
          this.selectedExpress = e;
          this.modifySetting(this.selectedItem);
        });
      },
      delExpress(row, index) {
        this.$confirm('是否删除？').then(() => {
          this.expresses.splice(index, 1);
          this.modifySetting(this.selectedItem);
        });
      },
      modifySetting(strategy) {
        strategy.settingJson = JSON.stringify({expresses: this.expresses});
        ExpressStrategyApi.modify(strategy.expressStrategyId, strategy).then(this.showSuccess);
      }
    }
  };
</script>
