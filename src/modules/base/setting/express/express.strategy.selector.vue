<template>
  <div v-if="dialog">
    <el-button @click="showList">请选择快递策略</el-button>
    <el-dialog title="请选择快递策略" :visible.sync="visible" :close-on-click-modal="false" append-to-body>
      <el-container>
        <el-header height="35px">
          <el-form>
            <el-row>
              <el-col :span="20">
                <el-input v-model="filterText" prefix-icon="el-icon-search"></el-input>
              </el-col>
              <el-col :span="4" align="right">
                <el-button @click="confirm">确认</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-table :data="filterList" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="expressStrategyId" label="策略编码" width="160px"
                             sortable></el-table-column>
            <el-table-column prop="expressStrategyName" label="策略名称"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
  <div v-else>
    <el-popover ref="grid" placement="bottom" width="400" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form>
            <el-row>
              <el-col :span="20">
                <el-input v-model="filterText" prefix-icon="el-icon-search"></el-input>
              </el-col>
              <el-col :span="4" align="right">
                <el-button @click="confirm">确认</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-table ref="dataTable" :data="filterList" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="expressStrategyId" label="策略编码"></el-table-column>
            <el-table-column prop="expressStrategyName" label="策略名称"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择策略" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid
                 :disabled="disabled"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {ExpressStrategyApi} from './api';
  import {Assert} from '@/libs/util';
  import {List, Selector} from '@/libs/mixins';

  export default {
    name: 'ExpressStrategySelector',
    mixins: [List, Selector],
    props: {
      expressStrategyName: String,
      clearExpressStrategy: {
        type: Boolean,
        required: false,
        default: true
      },
      dialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        pk: 'expressStrategyId',
        api: ExpressStrategyApi,
        filterText: null,
        filterList: [],
        text: this.expressStrategyName
      };
    },
    created() {
      this.search();
    },
    watch: {
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.selectedItems = [];
        }
      },
      expressStrategyName(val) {
        this.text = val;
      },
      filterText() {
        this.localSearch();
      }

    },
    methods: {
      search() {
        return this.doSearch(ExpressStrategyApi.list());
      },
      thenSearch(data) {
        this.list = data;
        this.filterList = data;
      },
      localSearch() {
        if (!Assert.isEmpty(this.filterText)) {
          let filterData = [];
          var reg = new RegExp(this.filterText, 'i');
          for (let item of this.list) {
            if (reg.test(item.expressStrategyId) || reg.test(item.expressStrategyName)) {
              filterData.push(item);
            }
          }
          this.filterList = filterData;
        }
        else {
          this.filterList = this.list;
        }
      },
      customClean() {
        this.text = null;
        this.$emit('update:expressStrategyName', null);
        this.$emit('update:expressStrategyId', null);
        if (this.clearExpressStrategy) {
          this.$emit('update:expressStrategyId', null);
        }
      },
      reset() {
        this.filter = {expressStrategyId: this.expressStrategyId};
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.expressStrategyName).join();
          this.$emit('input', this.selectedItems.map(x => x.expressStrategyId).join());
          this.$emit('update:expressStrategyName', this.text);
        } else {
          this.text = this.selectedItem.expressStrategyName;
          this.$emit('input', this.selectedItem.expressStrategyId);
          this.$emit('update:expressStrategyName', this.text);
          this.$emit('update:expressStrategyId', this.selectedItem.expressStrategyId);
        }
      }
    },
  };
</script>