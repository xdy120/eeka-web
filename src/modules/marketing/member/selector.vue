<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="600" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="会员名称">
                  <el-input v-model="filter.memberName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号">
                  <el-input v-model="filter.mobile"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header height="35px">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
            <el-button @click="confirm" v-if="!multiple">确认</el-button>
          </el-button-group>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" @selection-change="selectionChange"
                    @current-change="currentRowChange" @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="memberName" label="会员名称"></el-table-column>
            <el-table-column prop="storeName" label="店铺名称"></el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page"
                         @size-change="pageSizeChange" @current-change="search">
          </el-pagination>
        </el-footer>
      </el-container>
    </el-popover>

    <!--
    <el-input v-model="iMemberName" readonly>
        <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
    -->

    <el-input :placeholder="placeholder" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-circle-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid
                 :disabled="disabled"></el-button>
    </el-input>

  </div>
</template>
<script>
  import {List, PageList, Selector} from '@/libs/mixins';
  import {MemberApi} from './api';

  export default {
    name: 'MemberSelector',
    mixins: [List, PageList, Selector],
    props: {
      value: {
        required: false
      },
      placeholder: {
        type: String,
        default: '请选择会员'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      memberName: {
        type: String,
        required: false
      },
      memberContact: String,
      memberMobile: String,
      memberTelephone: String,
      memberAddress: String,
      memberCountry: String,
      memberProvince: String,
      memberCity: String,
      memberDistrict: String,
      storeId: String,
      storeName: String
    },
    watch: {
      memberName(val) {
        this.text = val;
      }
    },
    data() {
      return {
        pk: 'memberId',
        api: MemberApi,
        text: this.memberName
      };
    }
  };
</script>