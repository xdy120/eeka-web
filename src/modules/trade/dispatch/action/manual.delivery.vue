<template>
  <el-dialog title="手工发货" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="快递" prop="expressId">
        <express-selector v-model="domain.expressId"
                          :express-name.sync="domain.expressName"></express-selector>
      </el-form-item>
      <el-form-item label="快递单号" prop="expressNo">
        <el-input v-model="domain.expressNo"></el-input>
      </el-form-item>
      <el-form-item label="发货仓库" prop="warehouseId" v-if="dispatchOrder.offlineDelivery">
        <warehouse-selector v-model="domain.warehouseId"></warehouse-selector>
      </el-form-item>
      <el-form-item label="箱码" prop="boxNo">
        <el-input v-model="domain.boxNo"></el-input>
      </el-form-item>
      <el-form-item label="仓库单号" prop="outCode">
        <el-input v-model="domain.outCode"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Placeholders, ValidateRules} from '@/libs/util';
  import {ExpressSelector} from '@/modules/selector';
  import {DispatchOrderApi} from '../api';
  import {DispatchOrderActionMixin} from './mixin';
  import {WarehouseSelector} from '@/modules/base/index';

  export default {
    components: {ExpressSelector, WarehouseSelector},
    mixins: [Edit, DispatchOrderActionMixin],
    data() {
      return {
        Placeholders,
        rules: {
          expressId: ValidateRules.required,
          expressNo: ValidateRules.required,
          warehouseId: ValidateRules.required
        }
      };
    },
    methods: {
      getDefaultDomain(dispatchOrder) {
        return {
          expressId: dispatchOrder.suggestExpressId,
          expressName: dispatchOrder.suggestExpressName,
          expressNo: dispatchOrder.suggestExpressNo,
        };
      },
      doSave() {
        DispatchOrderApi.manualDelivery(this.domain).then(this.confirm);
      },
    }
  };
</script>