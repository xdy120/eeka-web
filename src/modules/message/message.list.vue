<template>
  <el-container>
    <el-main>
      <el-table :data="list" height="300" @row-click="readMessage">
        <go-boolean-column label="已读" prop="read"></go-boolean-column>
        <go-enum-column prop="messageType" label="类型" enum-name="MessageType"
                        width="80"></go-enum-column>
        <el-table-column label="内容" width="300">
          <template slot-scope="scope">
            <span v-if="scope.row.messageType==='WARNING'"
                  class="danger">{{scope.row.content}}</span>
            <span v-else-if="scope.row.messageType==='SYSTEM_NOTIFICATION'" class="primary">{{scope.row.content}}</span>
            <span v-else-if="scope.row.messageType==='NOTIFICATION'" class="primary">{{scope.row.content}}</span>
            <span v-else>
              <span v-if="scope.row.url">
                <a target="_blank"
                   :href="baseUrl+'/file'+scope.row.url+'/'+scope.row.content">
                  <i class="el-icon-download"></i>{{scope.row.content}}</a>已生成!
              </span>
              <span v-else>{{scope.row.content}}</span></span>
          </template>
        </el-table-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <go-delete-button @click="remove(scope.row)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {List, PageList} from '@/libs/mixins';
  import {MessageApi} from './api';
  import config from '@/config/config';

  export default {
    mixins: [List, PageList],
    data() {
      return {
        api: MessageApi,
        pk: 'messageId',
        baseUrl: config.url
      };
    },
    mounted() {
      setInterval(this.getMessages, 60000);
    },
    methods: {
      search() {
        this.$emit('change');
        return this.doSearch(this.api.list(this.filter, this.paging));
      },
      getMessages() {
        MessageApi.countUnread().then(result => {
          this.$emit('messageCountChange', result);
        });
      },
      readMessage(row) {
        if (!row.read) {
          MessageApi.markRead(row.messageId).then(this.search);
        }
      }
    }
  };
</script>