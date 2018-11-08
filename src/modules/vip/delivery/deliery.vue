<template>
  <el-dialog title="发货" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <el-table :data="list" height="300px" @current-change="currentRowChange">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="出仓编号" prop="vipDeliveryCode" min-width="150"></el-table-column>
      <el-table-column label="拣货单号" prop="vipDispatchCode" min-width="150"></el-table-column>
      <el-table-column label="唯品拣货单号" prop="pickingCode" min-width="150"></el-table-column>
      <go-enum-column label="出库状态" prop="outStatus" enum-name="OutStatus"
                      width="120"></go-enum-column>
      <el-table-column label="通知数量" prop="noticeQuantity" min-width="100"></el-table-column>
      <el-table-column label="出库数量" prop="outQuantity" min-width="100"></el-table-column>
      <el-table-column label="差异数量" prop="noticeQuantity" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.noticeQuantity-scope.row.outQuantity}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="delivery()">发货</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {List} from '@/libs/mixins';
  import {VipDeliveryApi} from './api';

  export default {
    name: 'Delivery',
    mixins: [List],
    components: {},
    data() {
      return {
        api: VipDeliveryApi,
        pk: 'vipDeliveryId',
        visible: false,
        domain: {}
      };
    },
    methods: {
      show(row) {
        this.domain = row;
        this.visible = true;
        this.filter = {[this.pk]: row[this.pk]};
        this.api.queryDispatch(row[this.pk], this.filter).then(response => {
          this.list = response;
        });
      },
      delivery() {
        let entity = {};
        entity[this.pk] = this.domain[this.pk];
        entity.version = this.domain.version;
        if (this.list.length > 0) {
          this.api.delivery(this.domain[this.pk], entity).then(() => {
            this.$message.success('发货成功');
            this.visible = false;
            this.confirm();
          });
        } else {
          this.$message.warning('没有绑定出仓单');
        }
      },
    }
  };
</script>