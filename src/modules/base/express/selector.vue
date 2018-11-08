<template>
  <div v-if="dialog">
    <el-button @click="showList">选择快递</el-button>
    <el-dialog title="选择快递" :visible.sync="visible" width="500px" :close-on-click-modal="false"
               append-to-body>
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="快递名称">
                  <el-input v-model="filter.expressName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="快递编码">
                  <el-input v-model="filter.expressCode"></el-input>
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
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="expressCode" label="快递编码"></el-table-column>
            <el-table-column prop="expressName" label="快递名称"></el-table-column>
            <go-enum-column prop="codType" label="到付类型" enum-name="CodType"
                            width="100px"></go-enum-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
  <div v-else>
    <el-popover ref="grid" placement="bottom" width="500px" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="快递名称">
                  <el-input v-model="filter.expressName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="快递编码">
                  <el-input v-model="filter.expressCode"></el-input>
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
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="expressName" label="快递名称"></el-table-column>
            <go-enum-column prop="codType" label="付款类型" enum-name="CodType"
                            width="100px"></go-enum-column>
            <go-enum-column prop="expressType" label="快递类型" enum-name="ExpressType"
                            width="100px"></go-enum-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择快递" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
  </div>
</template>
<script>
  import {List, PageList, Selector} from '@/libs/mixins';
  import {ExpressApi} from './api';
  import {Assert} from '@/libs/util';

  export default {
    name: 'ExpressSelector',
    mixins: [List, PageList, Selector],
    props: {
      expressName: String,
      expressCode: String,
      dialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pk: 'expressId',
        api: ExpressApi,
        text: this.expressName
      };
    },
    watch: {
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.selectedItems = [];
          this.defaultValue();
        }
      },
      expressName(val) {
        this.text = val;
        if (Assert.isEmpty(val)) {
          this.defaultValue();
        }
      },
    },
    created() {
      for (let key in this.outFilter) {
        this.filter[key] = this.outFilter[key];
      }
      this.oldFilter = this.filter;
      this.search();

    },
    methods: {
      thenSearch(data) {
        this.list = data;
        this.defaultValue();
      },
      defaultValue(){
        if(this.useDefault && this.list != null && this.list.length>0){
          this.text = this.list[0].expressName;
          this.confirm(this.list[0]);
        }
      },
      customClean() {
        this.text = null;
        this.$emit('update:expressName', null);
        this.$emit('update:expressCode', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.expressName).join();
          this.$emit('input', this.selectedItems.map(x => x.expressId).join());
          this.$emit('update:expressName', this.text);
          this.$emit('update:expressCode', this.selectedItems.map(x => x.expressCode).join());
          this.$emit('confirm', this.selectedItems);
        } else {
          this.text = this.selectedItem.expressName;
          this.$emit('update:expressName', this.text);
          this.$emit('update:expressCode', this.expressCode);
          this.$emit('confirm', this.selectedItem);
        }
      }
    }
  };
</script>