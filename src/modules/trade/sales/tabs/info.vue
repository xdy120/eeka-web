<template>
  <div :style="{height:tabsTableHeight+'px'}">
    <el-form :model="domain" class="oms-search" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="推荐仓库">
            <el-input v-model="domain.suggestVirtualWarehouseName" readonly>
              <el-button v-if="SalesOrderUtil.isBeforeAllDispatch(domain)" slot="append"
                         icon="el-icon-edit" @click="showSuggestWarehouse"
                         v-permission="101010104"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推荐快递">
            <el-input v-model="domain.suggestExpressName" readonly>
              <el-button v-if="SalesOrderUtil.isBeforeAllDispatch(domain)" slot="append"
                         icon="el-icon-edit" @click="showSuggestExpress"
                         v-permission="101010104"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="留单日期">
            <el-input v-model="domain.holdDate" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发货时间">
            <el-input v-model="domain.lastDeliveryTime" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="创建类型">
            <enum-show input enum-name="SalesOrderCreateType"
                       :value="domain.sub.createType"></enum-show>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="平台制单时间">
            <el-input v-model="domain.sub.mallCreatedTime" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="平台完成时间">
            <el-input v-model="domain.sub.mallFinishedTime" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="快递费">
            <el-input v-model="domain.sub.expressFee" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="会员昵称">
            <el-input v-model="domain.sub.memberName" readonly>
              <a class="primary" :href="wangwangUrl" target="_blank" slot="append" v-if="aliMall">
                <img border="0" :src="wangwangImgUrl" alt="联系买家"/>
              </a>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话">
            <el-input v-model="domain.telephone" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机">
            <el-input v-model="domain.mobile" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人">
            <el-input v-model="domain.contact" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="区域">
            <el-input v-model="regionPath" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址">
            <el-input v-model="domain.address" readonly>
              <el-button v-if="SalesOrderUtil.isBeforeAllDispatch(domain)" slot="append"
                         icon="el-icon-edit" @click="showAddressEditor"
                         v-permission="101010104"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="买家备注">
            <el-input v-model="domain.sub.buyerMemo" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电商备注">
            <el-input v-model="domain.remark" readonly>
              <el-button v-if="SalesOrderUtil.isBeforeAllDispatch(domain)" slot="append"
                         icon="el-icon-edit" @click="showRemark"
                         v-permission="101010104"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="卖家备注">
            <el-input v-model="domain.sub.sellerMemo" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <suggest-express ref="suggestExpress" @ok="ok"/>
    <suggest-warehouse ref="suggestWarehouse" @ok="ok"/>
    <receiver-info ref="recviverInfo" @ok="ok"/>
    <remark ref="remark" @ok="ok"/>
  </div>
</template>
<script>
  import {TableResize} from '@/libs/mixins';
  import {Assert} from '@/libs/util';
  import {ReceiverInfo, Remark, SuggestExpress, SuggestWarehouse} from '../action';
  import {SalesOrderUtil} from '@/modules/trade/sales/util';

  export default {
    name: 'SalesOrderBasic',
    mixins: [TableResize],
    components: {ReceiverInfo, SuggestWarehouse, SuggestExpress, Remark},
    props: {
      parentData: {
        required: true
      }
    },
    data() {
      return {
        domain: this.parentData ? this.parentData : {sub: {}},
        SalesOrderUtil,
      };
    },
    computed: {
      regionPath() {
        if (this.domain.countryName) {
          return `${this.domain.countryName}/${this.domain.provinceName}/${this.domain.cityName}/${this.domain.districtName}`;
        }
        else {
          return null;
        }
      },
      aliMall() {
        return Assert.inArray(this.domain.sub.mallType,
          ['TAOBAO', 'TAOBAO_FX', 'TAOBAO_JX', 'TMALL', 'TMALL_HK']);
      },
      wangwangImgUrl() {
        return `http://amos.alicdn.com/realonline.aw?v=2&uid=${this.domain.sub.memberName}&site=cntaobao&s=2&charset=utf-8`;
      },
      wangwangUrl() {
        return `http://www.taobao.com/webww/ww.php?ver=3&touid=${this.domain.sub.memberName}&siteid=cntaobao&status=2&charset=utf-8`;
      }
    },
    watch: {
      parentData(val) {
        this.domain = val ? val : {sub: {}};
      }
    },
    methods: {
      showSuggestExpress() {
        this.$refs.suggestExpress.show(this.parentData);
      },
      showSuggestWarehouse() {
        this.$refs.suggestWarehouse.show(this.parentData);
      },
      showAddressEditor() {
        this.$refs.recviverInfo.show(this.parentData);
      },
      showRemark() {
        this.$refs.remark.show(this.parentData);
      },
      ok() {
        this.$emit('change');
      }
    }
  };
</script>