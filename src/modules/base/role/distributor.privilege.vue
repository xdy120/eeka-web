<template>
  <el-dialog title="分配分销商权限" :visible.sync="visible" :close-on-click-modal="false"
             width="600px" :before-close="dialogCloseConfirm">
    <div style="height:500px; margin:0px 0px 0px 0px">
      <el-transfer
          v-model="select"
          :props="{
                                  key: 'storeId',
                                  label: 'storeName'
                                }"
          :titles="['可选', '已选']"
          :data="distributors">
      </el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="distributorPrivilegeSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>

  export default {
    name: 'DistributorPrivilege',
    components: {},
    props: {},
    data() {
      return {
        distributors: [],
        select: [],
        visible: false,
        currentId: ''
      };
    },
    methods: {
      show(id) {
        this.currentId = id;

        this.visible = true;
      },
      distributorPrivilegeSubmit() {

      }
    }
  };
</script>