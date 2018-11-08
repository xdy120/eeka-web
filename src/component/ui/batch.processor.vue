<template>
  <el-dialog :visible.sync="visible" :title="title" :before-close="handleClose" append-to-body>
    <el-table :data="list" height="300">
      <el-table-column :prop="displayProp" label="单据" width="150"></el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.currentStatus===0">未开始</span>
          <span v-if="scope.row.currentStatus===1" class="primary">进行中</span>
          <span v-if="scope.row.currentStatus===2" class="success">成功</span>
          <span v-if="scope.row.currentStatus===3" class="danger">失败</span>
          <span v-if="scope.row.currentStatus===4" class="info">已取消</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <go-tooltip-button v-if="scope.row.currentStatus===0" tooltip="取消" icon="android-cancel"
                             @click="scope.row.currentStatus=4"></go-tooltip-button>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="消息"></el-table-column>
    </el-table>
    <el-progress :text-inside="true" :status="progressStatus" :stroke-width="18"
                 :percentage="percentage" style="margin-top: 10px"></el-progress>
    <slot></slot>
    <span>当前第{{currentIndex}}条，共{{list.length}}条</span><span style="float:right">成功{{successCount}}条，失败{{failedCount}}条，跳过{{list.length-successCount-failedCount}}条</span>
    <div slot="footer" class="dialog-footer">
      <el-button @click="run" :disabled="currentStatus===2">{{buttonText}}</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'BatchProcessor',
    props: {
      prop: String
    },
    data() {
      return {
        currentStatus: 1,
        successCount: 0,
        failedCount: 0,
        visible: false,
        currentIndex: 0,
        title: '批量处理',
        displayProp: this.prop,
        list: [],
        action: null
      };
    },
    computed: {
      progressStatus() {
        return this.failedCount > 0 ? 'exception' : 'success';
      },
      buttonText() {
        switch (this.currentStatus) {
          case 1:
            return '开始';
          case 2:
            return '进行中';
          default:
            return '完成';
        }
      },
      percentage() {
        return this.list.length > 0 ? this.currentIndex * 100 / this.list.length : 0;
      }
    },
    methods: {
      show(title, prop, list, action) {
        list.forEach(x => x.currentStatus = 0);
        this.title = title;
        if (prop) {
          this.displayProp = prop;
        }
        this.list = list;
        this.action = action;
        this.visible = true;
        this.currentStatus = 1;
        this.failedCount = 0;
        this.successCount = 0;
      },
      doNext() {
        if (this.currentIndex < this.list.length) {
          let currentData = this.list[this.currentIndex];
          if (currentData.currentStatus === 0) {
            currentData.currentStatus = 1;
            this.action(currentData).then(() => {
              currentData.currentStatus = 2;
              this.currentIndex++;
              this.successCount++;
              this.doNext();
            }).catch(err => {
              currentData.currentStatus = 3;
              currentData.message = err;
              this.currentIndex++;
              this.failedCount++;
              this.doNext();
            });
          } else {
            this.currentIndex++;
            this.doNext();
          }
        } else {
          this.currentStatus = 3;
        }
      },
      run() {
        if (this.currentStatus === 1) {
          this.doNext();
        } else if (this.currentStatus === 3) {
          this.finish();
        }
      },
      reset() {
        this.list = [];
        this.currentIndex = 0;
        this.visible = false;
      },
      finish() {
        this.reset();
        this.$emit('finish');
      },
      cancel() {
        this.reset();
        this.$emit('cancel');
      },
      handleClose() {
        this.$confirm('关闭会取消当前操作，未处理的数据将不会进行处理，确认取消？').then(() => {
          this.cancel();
        });
      }
    }
  };
</script>