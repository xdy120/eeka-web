<template>
  <el-container>
    <el-header class="oms-action">
      <go-search-button @click="search">搜索</go-search-button>
      <el-button @click="openAdd">新增策略</el-button>
    </el-header>
    <el-container>
      <el-main v-resize="mainHeight">
        <el-table :data="list" :height="mainHeight">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="审单策略名称" prop="settingJson.name"></el-table-column>
          <go-boolean-column width="100" label="拦截买家留言"
                             prop="settingJson.buyerMessage"></go-boolean-column>
          <go-boolean-column width="100" label="拦截卖家留言"
                             prop="settingJson.sellerMessage"></go-boolean-column>
          <go-boolean-column width="100" label="拦截货到付款" prop="settingJson.cod"></go-boolean-column>
          <go-boolean-column width="100" label="拦截需要发票"
                             prop="settingJson.invoice"></go-boolean-column>
          <go-boolean-column width="120" label="拦截黑名单会员"
                             prop="settingJson.blackListMember"></go-boolean-column>
          <go-date-time-column label="创建时间" prop="createdTime"></go-date-time-column>
          <go-date-time-column label="修改时间" prop="modifiedTime"></go-date-time-column>
          <go-enable-column prop="settingJson.enable"></go-enable-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <go-toggle :value="scope.row.settingJson.enable"
                         @change="toggleEnable(scope.row)"></go-toggle>
              <go-modify-button @click="openEdit(scope.row)"></go-modify-button>
              <go-delete-button @click="remove(scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <editor :eid="editId" :on-closed="editClosed"></editor>
  </el-container>
</template>

<script>
  import {TableResize} from '@/libs/mixins';
  import Editor from './editor.vue';
  import api from './api';

  export default {
    mixins: [TableResize],
    components: {Editor},
    data() {
      return {
        filter: {},
        list: [],
        editId: undefined,
      };
    },
    created() {
      this.search();
    },
    methods: {
      openAdd() {
        this.editId = '0';
      },
      openEdit(current) {
        this.editId = current.settingId;
      },
      search() {
        api.list(this.filter).then(r => {
          r.map(i => i.settingJson = JSON.parse(i.settingJson));
          this.list = r;
        });
      },
      reset() {
        this.filter = {};
      },
      toggleEnable(row) {
        row.settingJson.enable = !row.settingJson.enable;
        api.modify(row.settingId, JSON.stringify(row.settingJson)).then(() => {
          this.$message.success('操作成功');
        });
      },
      editClosed(reload) {
        this.editId = undefined;
        if (reload) {
          this.search();
        }
      },
      remove(row) {
        this.deleteConfirm(() => {
          api.remove(row.settingId).then(() => {
            this.$message.success('删除成功!');
            this.search();
          });
        });
      }
    }
  };
</script>

