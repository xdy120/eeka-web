<template>
  <el-dialog title="编辑策略" :visible.sync="show" :before-close="cancel">
    <el-form :model="store" :rules="rules" ref="editForm" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="策略名称" prop="name">
            <el-input v-model="store.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拦截日期">
            <go-date-time-picker v-model="store.interceptPoint"
                                 placeholder="请选择拦截日期（支付时间）"></go-date-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="暂停审单">
            <go-date-time-picker v-model="store.interceptBeginDate"
                                 placeholder="开始日期"></go-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="至">
            <go-date-time-picker v-model="store.interceptEndDate"
                                 placeholder="结束日期"></go-date-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="每天暂停审单">
            <el-time-picker v-model="store.interceptBeginTime" format="HH:mm" value-format="HH:mm"
                            placeholder="每天暂停时间开始"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="至">
            <el-time-picker v-model="store.interceptEndTime" format="HH:mm" value-format="HH:mm"
                            placeholder="每天暂停时间开始"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="订单最小金额">
            <el-tooltip class="item" effect="dark" content="审核订单实际销售金额最小值"
                        placement="top">
              <el-input-number v-model="store.minAmount" controls-position="right"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大金额">
            <el-tooltip class="item" effect="dark" content="审核订单实际销售金额最大值"
                        placement="top">
              <el-input-number v-model="store.maxAmount" controls-position="right"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="订单最小数量">
            <el-tooltip class="item" effect="dark" content="审核订单中总商品最小数量"
                        placement="top">
              <el-input-number v-model="store.minQuantity" controls-position="right"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大数量">
            <el-tooltip class="item" effect="dark" content="审核订单中总商品最大数量"
                        placement="top">
              <el-input-number v-model="store.maxQuantity" controls-position="right"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="拦截商品">
        <el-tooltip class="item" effect="dark" content="支持款号、套装编码、规格编码，多个编码之间用英文分号隔开"
                    placement="top">
          <el-input v-model="store.interceptProduct"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="拦截区域">
        <el-tooltip class="item" effect="dark" content="填写省市区名称关键字即可，模糊匹配，多个关键字之间用英文分号隔开：上海;南京"
                    placement="top">
          <el-input v-model="store.interceptRegion"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-row>
        <el-checkbox v-model="store.buyerMessage">买家留言</el-checkbox>
        <el-checkbox v-model="store.sellerMessage">卖家留言</el-checkbox>
        <el-checkbox v-model="store.cod">货到付款</el-checkbox>
        <el-checkbox v-model="store.invoice">需要发票</el-checkbox>
        <el-checkbox v-model="store.blackListMember">黑名单会员</el-checkbox>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import api from './api';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'Editor',
    components: {},
    props: {
      eid: {
        type: String,
        required: false,
      },
      onClosed: {
        type: Function,
        required: false,
      }
    },
    data() {
      return {
        show: false,
        store: {},
        rules: {
          name: ValidateRules.requiredMax
        }
      };
    },
    watch: {
      eid(val) {
        if (val) {
          if (val > 0) {
            api.get(val).then(r => this.store = JSON.parse(r.settingJson));
          }
          else {
            this.store = this.defaultValue();
          }
          this.show = true;
        }
        else {
          this.show = false;
        }
      },
    },
    methods: {
      defaultValue() {
        return {};
      },
      save() {
        this.$refs.editForm.validate(valid => {
          if (!valid) {
            return;
          }

          if (this.eid > 0) {
            api.modify(this.eid, this.store).then(() => {
              this.callback(true);
            });
          }
          else {
            api.add(this.store).then(() => {
              this.callback(true);
            });
          }
        });
      },
      callback(reload) {
        this.onClosed && this.onClosed(reload);
      },
      cancel() {
        this.dialogCloseConfirm(() => {
          this.callback(false);
        });
      },
    }
  };
</script>
