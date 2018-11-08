<template>
  <el-dialog title="明细拆分" :visible.sync="visible" width="1200px">
    <el-container>
      <el-header height="35px">
        <el-button @click="splitDetail()">拆分明细</el-button>
      </el-header>
      <el-main>
        <el-table :data="list" :height="300">
          <el-table-column prop="productCode" label="商品编码" width="100"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码" width="120"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <go-quantity-column prop="quantity" label="数量" width="80px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity"></el-input-number>
            </template>
          </go-quantity-column>
          <el-table-column label="操作" fixed="right" width="80px">
            <template slot-scope="scope">
              <go-delete-button @click="removeDetail(scope.$index)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
    <sku-selector :display="false" ref="skuSelector"></sku-selector>
  </el-dialog>
</template>
<script>
  import {SkuSelector} from '@/modules/selector';
  import {SalesOrderDetail} from '../util';
  import {Edit} from '@/libs/mixins';
  import {SalesOrderDetailApi} from '../api';

  export default {
    mixins: [Edit],
    components: {SkuSelector, SalesOrderDetailApi},
    data() {
      return {
        source: {},
        list: [],
        version: null,
        storeSetting: null
      };
    },
    methods: {
      show(storeSetting, detail, version) {
        this.source = {};
        this.list = [];
        this.storeSetting = storeSetting;
        this.version = version;
        this.list.push(Object.assign({}, detail));
        Object.assign(this.source, detail);
        this.visible = true;
      },
      removeDetail(index) {
        if (index === 0) {
          this.$message.warning('明细拆分不能删除原明细！');
          return;
        }
        this.list.splice(index, 1);
      },
      doSave() {
        for (let index in this.list) {
          let detail = this.list[index];
          if (detail.quantity === 0) {
            this.$message.warning('拆分明细数量不能为0！');
            return;
          }
          let update = detail;
          let quantity = Number.parseInt(detail.quantity);
          let sellingPrice = Number.parseFloat(detail.sellingPrice);
          update.sellingAmount = (sellingPrice * quantity).toFixed(2);
          update.settlementAmount = 0;
          update.actualAmount = 0;
          update.distributionAmount = 0;
          update.discountAmount = 0;
          this.list[index] = update;
        }
        let splitBO = {};
        splitBO.version = this.version;
        splitBO.salesOrderId = this.source.salesOrderId;
        splitBO.salesOrderDetailId = this.source.salesOrderDetailId;
        splitBO.splitDetails = this.list;
        SalesOrderDetailApi.split(splitBO).then(() => {
          this.$message.success('订单拆分成功');
          this.$emit('ok');
          this.visible = false;
        });
      },
      splitDetail() {
        //判断是否换同款
        if (!this.storeSetting) {
          this.$message.warning('该单异常,无店铺信息,请核实后操作!');
          return;
        }
        let exchangeDifferentSpu = this.storeSetting.exchangeDifferentSpu;
        let productId = null;

        if (!(exchangeDifferentSpu && exchangeDifferentSpu === true)) {
          productId = this.source.productId;
        }
        this.$refs.skuSelector.showDialog({
          productId: productId,
          multiple: false,
          onSelected: sku => {
            this.$confirm(`确认要拆分出【${sku.skuCode}】吗？`).then(() => {
              let detail = new SalesOrderDetail(sku, false);
              this.list.push(detail);
            });
          }
        });
      }
    }
  };
</script>