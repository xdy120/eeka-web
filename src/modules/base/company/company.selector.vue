<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="400" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="公司编码">
                  <el-input v-model="filter.companyCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司名称">
                  <el-input v-model="filter.companyName"></el-input>
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
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column label="公司编码" prop="companyCode"></el-table-column>
            <el-table-column label="公司名称" prop="companyName"></el-table-column>
            <el-table-column label="电话" prop="telephone"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择公司" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
  </div>
</template>
<script>
  import {List, Selector} from '@/libs/mixins';
  import {CompanyApi} from './api';
  import {Assert} from '@/libs/util';

  export default {
    name: 'CompanySelector',
    mixins: [List, Selector],
    props: {
      companyCode: String,
      companyName: String,
      dialogVisible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        pk: 'companyId',
        api: CompanyApi,
        text: this.companyName
      };
    },
    watch: {
      companyName(val) {
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
        this.$emit('update:companyName', null);
        this.$emit('update:companyCode', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.$emit('input', this.selectedItems.map(x => x.companyId).join());
          this.$emit('update:companyName', this.text);
          this.$emit('update:companyCode', this.selectedItems.map(x => x.companyCode).join());
        } else {
          this.text = this.selectedItem.companyName;
          this.$emit('input', this.selectedItem.companyId);
          this.$emit('update:companyName', this.text);
          this.$emit('update:companyCode', this.selectedItem.companyCode);
        }
      }
    }
  };
</script>