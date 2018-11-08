<template>
  <div v-if="dialog">
    <el-button @click="showList">选择用户</el-button>
    <el-dialog title="选择用户" :visible.sync="visible" :close-on-click-modal="false" append-to-body>
      <el-container>
        <el-header height="35px" class="oms-search">
          <el-form>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="登录名">
                  <el-input v-model="filter.loginName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="filter.userName"></el-input>
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
          <el-button @click="confirmCurrentUser">当前用户</el-button>
        </el-header>
        <el-main v-resize="mainHeight">
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="departmentName" label="部门"></el-table-column>
            <el-table-column prop="userName" label="姓名" width="120px"></el-table-column>
            <el-table-column prop="nickname" label="呢称" width="120px"></el-table-column>
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
    <el-popover ref="grid" placement="bottom" width="400" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form label-width="70px">
            <el-col :span="12">
              <el-form-item label="登录名">
                <el-input v-model="filter.loginName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="filter.userName"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-header>
        <el-header height="35px">
          <el-row>
            <el-col :span="18">
              <el-button-group>
                <go-search-button @click="clickSearch">搜索</go-search-button>
                <go-clean-button @click="reset">清空</go-clean-button>
              </el-button-group>
              <el-button @click="confirm">确认</el-button>
            </el-col>
            <el-col :span="6" align="right">
              <el-button @click="confirmCurrentUser" type="success">{{user.nickname}}</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="departmentName" label="部门"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="nickname" label="呢称"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input :placeholder="placeholder" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
  </div>
</template>
<script>
  import {List, PageList, Selector} from '@/libs/mixins';
  import {UserApi} from './api';
  import {Assert} from '@/libs/util';
  import {mapGetters} from 'vuex';

  export default {
    name: 'UserSelector',
    mixins: [List, PageList, Selector],
    props: {
      value: String,
      nickname: String,
      placeholder: {
        type: String,
        default: '请选择用户'
      },
      isDefaultValue: {
        type: Boolean,
        default: true
      },
      dialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pk: 'userId',
        api: UserApi,
        text: this.nickname
      };
    },
    created() {
      if (this.isDefaultValue) {
        this.selectedItem = this.user;
        this.text = this.user.nickname;
        this.confirm(this.user);
      }
    },
    watch: {
      nickname(val) {
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
    computed: {
      ...mapGetters([
        'user',
      ])
    },
    methods: {
      confirmCurrentUser() {
        this.text = this.user.nickname;
        this.$emit('update:nickname', this.user.nickname);
        this.$emit('update:userName', this.user.userName);
        this.visible = false;
      },
      customClean() {
        this.text = null;
        this.$emit('update:nickname', null);
        this.$emit('update:userName', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.text = this.selectedItems.map(x => x.nickname).join();
          this.$emit('input', this.selectedItems.map(x => x.userId).join());
          this.$emit('update:nickname', this.text);
          this.$emit('update:userName', this.selectedItems.map(x => x.userName).join());
        } else {
          this.text = this.selectedItem.nickname;
          this.$emit('input', this.selectedItem.userId);
          this.$emit('update:nickname', this.text);

        }
      },
    }
  };
</script>