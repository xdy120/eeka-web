<template>
    <el-popover width="600" title="日志" trigger="click" @show="search()" placement="left" >
      <el-table :data="list" style="margin: 0">
        <el-table-column prop="operatorName" width="100" label="操作人"></el-table-column>
        <el-table-column prop="operateTime" label="操作时间" type="datetime"></el-table-column>
        <el-table-column prop="operateInfo" width="100" label="操作"></el-table-column>
        <el-table-column prop="remark" label="内容"></el-table-column>
      </el-table>
      <el-button type="text" slot="reference">wms日志</el-button>
    </el-popover>
</template>

<script>
  import {DispatchOrderApi} from '../api';
  import {TableResize, Tabs} from '@/libs/mixins/index';
  export default {
    name: 'wmsLog',
    mixins: [TableResize, Tabs],
    props: {
      dispatchOrderId: String,
    },
    data() {
      return {
        api: DispatchOrderApi,
        visible: false,
        list:[]
      };
    },
    methods: {
      search(){
        DispatchOrderApi.listWmsLog(this.dispatchOrderId).then((response)=>{
          if (response){
            this.list = response;
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>