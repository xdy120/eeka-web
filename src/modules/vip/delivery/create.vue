<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-form :model="domain" ref="editForm" label-width="120px" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="品牌" prop="brandName">
            <data-dict-item-selector v-model="domain.brandName" :code.sync="domain.brandCode"
                                     data-dict-id="10101"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺" prop="storeId">
            <store-selector v-model="domain.storeId" :store-name.sync="domain.storeName"
                            mall-type="VIP" :clearable="false"></store-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="PO单号" prop="poCode" :rules="ValidateRules.name">
            <el-input v-model="domain.poCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="送货仓库" prop="vipWarehouseCode">
            <data-dict-item-selector v-model="domain.vipWarehouseName"
                                     :code.sync="domain.vipWarehouseCode"
                                     data-dict-id="10804"></data-dict-item-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="承运商" prop="carrierName">
            <data-dict-item-selector v-model="domain.carrierName" :code.sync="domain.carrierCode"
                                     data-dict-id="10801"></data-dict-item-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配送模式" prop="deliveryMethodName">
            <data-dict-item-selector v-model="domain.deliveryMethodName"
                                     :code.sync="domain.deliveryMethodCode"
                                     data-dict-id="10803"></data-dict-item-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12" style="height: 45px;">
          <el-form-item label="送货批次" prop="deliveryDate">
            <el-row>
              <el-col :span="14">
                <el-date-picker v-model="domain.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                :clearable="false"></el-date-picker>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="deliveryTime">
                  <el-select v-model="domain.deliveryTime" style="margin-left: 5px"
                             :clearable="false">
                    <el-option
                        v-for="item in deliveryTimes" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="height: 45px;">
          <el-form-item label="要求到货时间" prop="arrivalDate">
            <el-row>
              <el-col :span="14">
                <el-date-picker v-model="domain.arrivalDate" type="date" value-format="yyyy-MM-dd"
                                :clearable="false"></el-date-picker>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="arrivalTime">
                  <el-select v-model="domain.arrivalTime" style="margin-left: 5px"
                             :clearable="false">
                    <el-option
                        v-for="item in arrivalTimes" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="运单号" prop="waybillNumber">
            <el-input v-model="domain.waybillNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="JIT类型" prop="jitType">
            <enum-selector v-model="domain.jitType" enum-name="VipJitType"></enum-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="domain.remark" type="textarea"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">保存</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {Edit, List} from '@/libs/mixins';
  import {DataDictItemSelector, StoreSelector, WarehouseSelector} from '@/modules/selector';
  import {DataDictApi} from '@/modules/base/datadict';
  import {Util, ValidateRules} from '@/libs/util';
  import {VipDeliveryApi} from './api';

  export default {
    name: 'VipDeliveryCreator',
    mixins: [List, Edit],
    components: {StoreSelector, WarehouseSelector, DataDictItemSelector},
    data() {
      return {
        api: VipDeliveryApi,
        pk: 'vipDeliveryId',
        ValidateRules: ValidateRules,
        dictId: 10805,
        arrivalTimes: [],
        deliveryTimes: [],
        rules: {
          storeId: ValidateRules.required,
          poCode: ValidateRules.required,
          vipWarehouseCode: ValidateRules.required,
          carrierName: ValidateRules.required,
          deliveryMethodName: ValidateRules.required,
          arrivalDate: ValidateRules.required,
          deliveryDate: ValidateRules.required,
          deliveryTime: ValidateRules.required,
          arrivalTime: ValidateRules.required,
          remark: ValidateRules.remark,
          jitType: ValidateRules.required
        }
      };
    },
    watch: {
      ['domain.deliveryMethodCode'](val) {
        DataDictApi.listItems(val === '1' ? 10805 : 10806).then(data => {
          this.arrivalTimes = data.map(x => x.dataDictItemName).sort();
          this.calcArrivalDate();
        });
      },
      'domain.deliveryTime'() {
        this.calcArrivalDate();
      }
    },
    created() {
      DataDictApi.listItems(10807).then(data => {
        this.deliveryTimes = data.map(x => x.dataDictItemName).sort();
      });
    },
    methods: {
      genDefaultDomain() {
        let today = Util.dateFormatter(new Date(), 'yyyy-MM-dd');
        let deliveryTime = null;
        for (let item of this.deliveryTimes) {
          let now = new Date();
          let exp = `${today} ${item}:00`;
          let date = new Date(exp);
          if (date > now) {
            deliveryTime = item;
            break;
          }
        }
        return {
          arrivalDate: today,
          deliveryDate: today,
          deliveryTime: deliveryTime,
          deliveryMethodCode: '1',
          deliveryMethodName: '汽运',
          jitType: 'NORMAL'
        };
      },
      beforeShow() {
        this.calcArrivalDate();
      },
      calcArrivalDate() {
        this.domain.arrivalDate = this.domain.deliveryDate;
        let exp = `${this.domain.deliveryDate} ${this.domain.deliveryTime}:00`;
        let date = new Date(exp);
        if (this.domain.deliveryMethodCode === '1') {
          date.setHours(date.getHours() + 3, date.getMinutes() + 30);
          this.calcArrivalTime(date);
        } else {
          let hours = 15;
          if (date.getHours() > 8 && date.getHours() < 15) {
            hours = 11;
          }
          date.setHours(date.getHours() + hours);
          this.calcArrivalTime(date);
        }
      },
      calcArrivalTime(target) {
        let today = Util.dateFormatter(new Date(), 'yyyy-MM-dd');
        for (let item of this.arrivalTimes) {
          let exp = `${today} ${item}:00`;
          let date = new Date(exp);
          if (date >= target) {
            this.domain.arrivalTime = item;
            return;
          }
        }
        for (let item of this.arrivalTimes) {
          let exp = `${today} ${item}:00`;
          let date = new Date(exp);
          date.setDate(date.getDate() + 1);
          if (date >= target) {
            this.domain.arrivalDate = Util.dateFormatter(date, 'yyyy-MM-dd');
            this.domain.arrivalTime = item;
            return;
          }
        }
      }
    }
  };
</script>
