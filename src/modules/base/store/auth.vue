<template>
  <el-dialog title="店铺授权" :visible.sync="visible" :before-close="dialogCloseConfirm" width="800px">
    <el-form>
      <el-form-item label="请求地址">
        <el-input v-model="authUrl"></el-input>
      </el-form-item>
    </el-form>
    <!--<el-form>-->
    <!--<el-form-item label="请求地址">-->
    <!--<el-input v-model="url"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <el-form>
      <el-form-item label="校验码">
        <el-input v-model="code"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="accessToken">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {StoreApi} from './api';
  import {Edit} from '@/libs/mixins';

  export default {
    name: 'StoreEdit',
    mixins: [Edit],
    data() {
      return {
        authUrl: 'http://www.greatonce.com',
        url: null,
        code: null,
        store: null
      };
    },
    methods: {
      show(store) {
        this.store = store;
        let win = window.open('about:blank', '_blank');
        let authWin = this;
        win.on = function () {
          authWin.url = win.location.href;
        };
        StoreApi.getAuthConfig(store.storeId).then(data => {
          win.location.href = data;
          this.authUrl = data;
          this.visible = true;
        });
      },
      accessToken() {
        StoreApi.accessToken(this.store.storeId, this.code).then(this.confirm);
      }
    }
  };
</script>