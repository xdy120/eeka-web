<template>
  <div style="display:inline">
    <el-button type="primary" @click="showDialog()">新增</el-button>
    <el-dialog title="商品选择" :visible.sync="formVisible" :close-on-click-modal="false" width="80%"
               append-to-body>
      <el-container class="oms-search">
        <el-header>
          <el-form label-width="70px">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="商品编码">
                  <el-input v-model="filter.productCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规格编码">
                  <el-input v-model="filter.productName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-header>
        <el-header class="oms-action">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
            <el-button @click="confirm">确认</el-button>
          </el-button-group>
        </el-header>
        <el-main>
          <el-row>
            <el-table :data="list" :height="200" style="margin-top: 5px"
                      @selection-change="selectItem">
              <go-selection-column></go-selection-column>
              <el-table-column prop="productType" label="商品类型"></el-table-column>
              <el-table-column prop="productName" label="商品名称"></el-table-column>
              <el-table-column prop="productCode" label="商品编码"></el-table-column>
            </el-table>
          </el-row>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="filter.pageSize"
                         :current-page.sync="filter.page" @size-change="handleSizeChange"
                         @current-change="search">
          </el-pagination>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
  import {ProductApi} from '@/modules/product/api';

  export default {
    name: 'ProductSelector',
    props: {
      value: {
        required: false
      }
    },
    data() {
      return {
        selectedItems: [],
        formVisible: false,
        list: [],
        filter: {
          page: 1,
          pageSize: 20,
        },
        total: 0
      };
    },

    methods: {
      handleSizeChange(size) {
        this.filter.pageSize = size;
        this.filter.page = 1;
        this.search();
      },
      showDialog() {
        this.formVisible = true;
      },
      reset() {
        this.filter = {
          page: 1,
          pageSize: 20,
        };
      },
      search() {
        ProductApi.list(this.filter).then(response => {
          this.list = response.data;
          this.total = response.total;
        });
      },
      selectItem(selection) {
        this.selectedItems = [];
        selection.forEach(row => {
          this.selectedItems.push(row);
        });
      },
      confirm() {
        this.$emit('confirm', this.selectedItems);
        this.formVisible = false;
      }
    },
  };
</script>