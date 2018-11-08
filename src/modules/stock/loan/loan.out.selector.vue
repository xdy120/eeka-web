<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="800" v-model="visible">
      <el-container>
        <el-header height="75px" class="oms-search">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item label="单号">
                  <el-input v-model="filter.stockLoanOutCode"
                            :placeholder="Placeholders.IN"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库仓库">
                  <virtual-warehouse-selector
                      v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="借调人">
                  <el-input v-model="filter.loanUser"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item label="规格编码">
                  <el-input v-model="filter.skuCodes"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="制单时间">
                  <el-input v-model="filter.beginTime"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="到">
                  <el-input v-model="filter.endTime"></el-input>
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
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table ref="dataTable" :height="300" :data="list"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="needReturn" label="需归还" width="60"></el-table-column>
            <el-table-column prop="stockLoanOutCode" label="借出单号" width="100"></el-table-column>
            <el-table-column prop="loanType" label="借调类型" width="100"></el-table-column>
            <go-enum-column prop="status" label="状态" enum-name="StockLoanOutStatus"
                            width="60"></go-enum-column>
            <el-table-column prop="loanUser" label="借调人" width="70"></el-table-column>
            <el-table-column prop="warehouseName" label="出库仓库" width="100"></el-table-column>
            <go-date-column prop="expectReturnDate" label="预计归还日期"></go-date-column>
            <el-table-column prop="creator" label="制单人" width="100"></el-table-column>
            <go-date-time-column prop="createdTime" label="制单日期"></go-date-time-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择借出单" v-model="text" :disabled="disabled" class="selector"
              v-popover:grid suffix-icon="el-icon-arrow-down" readonly>
      <el-button slot="append" icon="el-icon-close" @click="clean" v-if="text"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {StockLoanOutApi} from './api';
  import {Assert, Placeholders} from '@/libs/util';
  import {List, PageList, Selector} from '@/libs/mixins';
  import {VirtualWarehouseSelector} from '@/modules/selector';

  export default {
    name: 'LoanOutCodeSelector',
    mixins: [List, PageList, Selector],
    components: {VirtualWarehouseSelector},
    props: {
      stockLoanOutCode: String,
    },
    data() {
      return {
        pk: 'stockLoanOutId',
        api: StockLoanOutApi,
        filterText: null,
        filterList: [],
        text: this.stockLoanOutCode,
        nowDay: parseInt(new Date().getTime() / (1000 * 60 * 60 * 24)),
        Placeholders
      };
    },
    created() {
      this.search();
      this.init();
    },
    watch: {
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.$refs.dataTable.clearSelection();
        } else {
          this.init();
        }
      },
      storeName(val) {
        this.text = val;
      },
      filterText() {
        this.localSearch();
      }
    },
    methods: {
      init() {
        if (!this.dialog) {
          if (!Assert.isEmpty(this.value) && this.iMultiple) {
            let ids = this.value.split(',');
            let selectedItems = this.list.filter(x => ids.some(y => y === x.stockLoanOutCode));
            for (let row of selectedItems) {
              this.$refs.dataTable.toggleRowSelection(row, true);
            }
          }
        }
      },
      localSearch() {
        if (!Assert.isEmpty(this.filterText)) {
          let filterData = [];
          var reg = new RegExp(this.filterText.trim(), 'i');
          for (let item of this.list) {
            if (reg.test(item.stockLoanOutCode)) {
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
        this.$emit('update:stockLoanOutCode', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.stockLoanOutCode).join();
          this.$emit('update:stockLoanOutCode',
            this.selectedItems.map(x => x.stockLoanOutCode).join());
        } else {
          this.text = this.selectedItem.stockLoanOutCode;
          this.$emit('update:stockLoanOutCode', this.selectedItem.stockLoanOutCode);
        }
        this.$refs.dataTable.clearSelection();
      },
      clickSearch() {
        this.search();
      },
      overdueDay(row) {
        let newDate = (Date.parse(row.expectReturnDate)) / (1000 * 60 * 60 * 24);
        let overdueDay = this.nowDay - newDate;
        return overdueDay > 0 ? overdueDay : 0;
      }
    }
  };
</script>
