<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="600" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="编码">
                  <el-input v-model="filter.supplierCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="简称">
                  <el-input v-model="filter.supplierShortName" placeholder="支持右侧模糊匹配"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="名称">
                  <el-input v-model="filter.supplierName" placeholder="支持右侧模糊匹配"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header :height="35">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <el-table-column label="供应商编码" prop="supplierCode" sortable></el-table-column>
            <el-table-column label="供应商简称" prop="supplierShortName" sortable></el-table-column>
            <el-table-column label="供应商全称" prop="supplierName" sortable></el-table-column>
            <el-table-column label="联系人" prop="contact" sortable></el-table-column>
            <el-table-column label="公司名称" prop="companyName" sortable></el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-popover>
    <el-input placeholder="选择供应商" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-circle-close" @click="clean"
                 v-if="selectedItem||selectedItems.length>0"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid
                 :disabled="disabled"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {SupplierApi} from '../api';
  import {List, PageList, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';

  export default {
    name: 'SupplierSelector',
    mixins: [List, PageList, Selector],
    props: {
      supplierCode: String,
      supplierName: String,
      dialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        pk: 'supplierId',
        api: SupplierApi,
        text: this.supplierName,
      };
    },
    watch: {
      supplierName(val) {
        this.text = val;
      },
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.selectedItems = [];
        }
      },
    },
    methods: {
      customClean() {
        this.text = null;
        this.$emit('update:supplierName', null);
        this.$emit('update:supplierShortName', null);
        this.$emit('update:supplierCode', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.supplierName).join();
          this.$emit('input', this.selectedItems.map(x => x.supplierId).join());
          this.$emit('update:purchaseOrderCode', this.text);
          this.$emit('update:purchaseOrderCode',
            this.selectedItems.map(x => x.purchaseOrderCode).join());
        } else {
          this.text = this.selectedItem.supplierName;
          this.$emit('update:supplierName', this.text);
          this.$emit('update:supplierShortName', this.selectedItem.supplierShortName);
          this.$emit('update:supplierCode', this.selectedItem.supplierCode);
        }
      },
      clickSearch() {
        this.filter['status'] = 'AUDITED';
        this.search();
      },
    },
    created() {
      this.filter['status'] = 'AUDITED';
      this.search();
    }
  };
</script>