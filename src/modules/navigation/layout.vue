<style lang="less">
  @import "layout.less";
</style>
<template>
  <el-container>
    <el-header class="layout-header" height="60px">
      <div class="layout-header-nav">
        <el-button type="text" size="large"
                   :style="{transform: 'rotateZ(' + (sidebar.opened ? '0' : '90') + 'deg)'}"
                   @click="triggerSidebar">
          <el-icon name="oms-navicon" style="font-size: 24px;color: #a4a6ac"/>
        </el-button>
      </div>
      <div class="layout-header-logo">
        <img src="../../assets/images/logo.png"
             style="border-radius:5px 0;width: 180px;">
      </div>
      <div class="layout-header-split">|
      </div>
      <div class="layout-header-menu">
        <navbar/>
      </div>
      <div class="layout-header-quick">
        <div class="layout-header-avator-item">
          <el-popover ref="popoverMessage" placement="bottom" trigger="click"
                      v-model="messageVisible">
            <meessage-list ref="messageList"
                           @messageCountChange="messageCountChange"></meessage-list>
          </el-popover>
          <el-tooltip
              :content="messageCount > 0 ? '有' + messageCount + '条未读消息' : '无未读消息'"
              placement="bottom">
            <el-button type="text" size="large" v-popover:popoverMessage @click="showMessage">
              <el-badge :value="messageCount" :is-dot="true" :hidden="!messageCount > 0">
                <el-icon name="message" style="color:#a4a6ac;font-size: 24px"/>
              </el-badge>
            </el-button>
          </el-tooltip>
        </div>
        <div class="layout-header-avator-item">
          <el-tooltip content="个人设置">
            <el-button type="text" size="large" @click="modifyPwd">
              <el-icon name="oms-setting" style="color:#a4a6ac;font-size: 24px"/>
            </el-button>
          </el-tooltip>
        </div>
        <div class="layout-header-avator-item">
          <el-tooltip content="退出">
            <el-button type="text" size="large" @click="logout">
              <el-icon name="oms-exit" style="color:#a4a6ac;font-size: 24px"/>
            </el-button>
          </el-tooltip>
        </div>
        <div class="layout-header-avator-item">
          <el-tooltip :content="currentUserName">
            <avatar>
              {{ currentUserName }}
            </avatar>
          </el-tooltip>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside v-show="sidebar.opened" width="240px" style="background-color: #e6eaee">
        <sidebar/>
      </el-aside>
      <el-container>
        <el-header height="36px"
                   style="padding: 5px 4px 5px 4px;box-shadow:0 2px 1px 1px rgba(100, 100, 100, 0.1);">
          <div style="float: left">
            <el-tag :key="item.path" class="tag" size="medium" v-for="item in quickbar"
                    :closable="true" @close="closeTag(item)">
              <el-button type="text" :class="tagClass(item)" :icon="tagIcon(item)"
                         @click="activeTag(item)">{{item.itemName}}
              </el-button>
            </el-tag>
          </div>
          <div style="float: right">
            <el-tag class="tag" size="medium">
              <el-button type="text" class="danger" @click="closeAllTag">关闭所有</el-button>
            </el-tag>
          </div>
        </el-header>
        <div style="padding: 5px;border-bottom:1px solid #ebeef5" v-if="activeMenuItem">
          <span class="info" style="font-weight:bold;font-size: 16px">
            {{activeMenuItem.itemName}}
          </span>
        </div>
        <el-container :class="contentClass">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-container>
      </el-container>
    </el-container>
    <password-editor ref="passwordEditor"></password-editor>
  </el-container>
</template>
<style scoped>
  .tag {
    display: inline-block;
    border: 1px solid #e9eaec !important;
    background: #fff !important;
    color: #495060 !important;
    margin-right: 2px;
  }
</style>
<script>
  import navbar from './navbar.vue';
  import sidebar from './sidebar.vue';
  import {
    ACTIVE_MENU_ITEM,
    CLEAR_QUICK_MENU_ITEM,
    CLOSE_ALL_QUICK_MENU_ITEM,
    CLOSE_QUICK_MENU_ITEM,
    TOGGLE_SIDEBAR,
    USER_LOGOUT
  } from '@/libs/mutation.types';
  import {mapGetters} from 'vuex';
  import {MeessageList} from '../message/index';
  import PasswordEditor from '../base/company/modify.pwd';
  import {UserApi} from '../base/company/api';

  export default {
    components: {navbar, sidebar, MeessageList, PasswordEditor},
    data() {
      return {
        messageCount: 0,
        lockScreenSize: 0,
        messageVisible: false,
        jobVisible: false
      };
    },
    created() {
      this.$store.commit(CLEAR_QUICK_MENU_ITEM);
      UserApi.validatePassword(this.$store.getters.user.userId).catch(response => {
        if (response) {
          this.$refs.passwordEditor.show(true);
        }
      });
    },
    computed: {
      ...mapGetters([
        'sidebar', 'user', 'quickbar', 'activeModule', 'activeMenu', 'activeMenuItem'
      ]),
      currentUserName() {
        return this.user ? this.user.nickname : '未知';
      },
      contentClass() {
        return this.$route.matched.length < 2 ? 'layout-content-bg' : 'layout-content';
      }
    },
    methods: {
      messageCountChange(count) {
        this.messageCount = count;
      },
      tagIcon(item) {
        if (item.router === this.$route.path) {
          return 'el-icon-star-on';
        }
        return '';
      },
      tagClass(item) {
        if (item.router === this.$route.path) {
          return 'primary';
        }
        return 'info';
      },
      closeAllTag() {
        this.$store.commit(CLOSE_ALL_QUICK_MENU_ITEM);
      },
      activeTag(item) {
        this.$store.commit(ACTIVE_MENU_ITEM, item);
      },
      closeTag(item) {
        this.$store.commit(CLOSE_QUICK_MENU_ITEM, item);
      },
      showMessage() {
        this.$refs.messageList.search();
        this.messageVisible = true;
      },
      triggerSidebar() {
        this.$store.commit(TOGGLE_SIDEBAR);
      },
      modifyPwd() {
        this.$refs.passwordEditor.show(false);
      },
      logout() {
        this.$store.dispatch(USER_LOGOUT);
      }
    }
  };
</script>