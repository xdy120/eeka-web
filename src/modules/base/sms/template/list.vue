<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="18">
          <el-button @click="openAdd">新增模板</el-button>
        </el-col>
        <el-col :span="6">
          <store-selector ref="storeSelector" multiple @confirm="selectedStore"/>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-row>
        <el-col :span="18">
          <el-table :data="list" :height="mainHeight" @current-change="selectedTemplate">
            <el-table-column type="index" width="50" label="序号"/>
            <el-table-column label="模板名称" prop="smsTemplateName"/>
            <el-table-column label="短信帐户" prop="smsAccountId"></el-table-column>
            <go-enum-column label="模板类型" prop="smsTemplateType" enum-name="SmsTemplateType">
            </go-enum-column>
            <go-date-time-column label="修改时间" prop="modifiedTime"></go-date-time-column>
            <go-date-time-column label="创建时间" prop="createdTime"></go-date-time-column>
            <go-enable-column></go-enable-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <go-toggle :value="scope.row.enable" @change="enable(scope.row)"></go-toggle>
                <go-modify-button type="text" @click="openEditor(scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6">
          <el-table :data="stores" :height="mainHeight" style="margin-left: 5px">
            <el-table-column label="店铺名称" prop="storeName"></el-table-column>
            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
                <go-delete-button type="text" @click="removeStore(scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>

    <!--短信模板-->
    <el-dialog title="短信模板" :visible.sync="smsTemplateFormVisible">
      <el-form :model="smsTemplateForm" ref="templateName" label-width="80px" label-position="left">
        <el-form-item label="模板名称" prop="smsTemplateName"
                      :rules="[
                        { required: true, message: '请输入名称', trigger: 'blur,change' },
                        { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur,change' }
                    ]">
          <el-input v-model="smsTemplateForm.smsTemplateName"/>
        </el-form-item>
        <el-form-item label="模板类型" prop="smsTemplateType"
                      :rules="[
                        { required: true, message: '请选择模板类型', trigger: 'blur,change' },
                    ]">
          <enum-selector v-model="smsTemplateForm.smsTemplateType" enum-name="SmsTemplateType"/>
        </el-form-item>

        <el-form-item label="会员类型" prop="memberType"
                      :rules="[
                        { required: true, message: '请选择会员类型', trigger: 'blur,change' },
                    ]">
          <enum-selector v-model="smsTemplateForm.memberType" enum-name="MemberType"/>
        </el-form-item>

        <el-form-item label="短信账号" prop="smsAccountId"
                      :rules="[
                        { required: true, message: '请选择短信账号', trigger: 'blur,change' },
                    ]">
          <sms-account-selector v-model="smsTemplateForm.smsAccountId"
                                :sms-account-name.sync="smsTemplateForm.smsAccountName"></sms-account-selector>
        </el-form-item>

        <el-form-item label="内容" prop="smsContent"
                      :rules="[
                        { required: true, message: '请输入短信内容', trigger: 'blur,change' },
                    ]">
          <el-input ref="txt" v-model="smsTemplateForm.smsContent" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3}"></el-input>
        </el-form-item>
        <el-row>
          <el-button v-for="c in vars" type="text" v-bind:key="c" @click="setVar(c)">{{c}}
          </el-button>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="save">保存</el-button>
      </div>
    </el-dialog>

  </el-container>

</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';
  import {SmsAccountSelector, StoreSelector} from '@/modules/base/index';
  import api from './api';

  export default {
    name: 'SmsTemplate',
    mixins: [TableResize],
    components: {StoreSelector, SmsAccountSelector},
    data() {
      return {
        vars: ['店铺名称', '会员呢称', '收货人', '来源单号', '物流公司', '物流单号', '商品名称', '商品数量', '发货时间', '店铺电话',
          '店铺地址', '活动编码'],
        list: [],
        stores: [],
        smsTemplateFormVisible: false,
        smsTemplateForm: {smsContent: ''},
      };
    },
    created() {
      this.search();
    },
    methods: {
      setVar(c) {

        let ct = this.smsTemplateForm.smsContent || '';
        let cl = this.$refs.txt.$el.firstChild.selectionStart;

        let varValue = '{' + c + '}';
        let cf = ct.substring(0, cl);
        let ca = ct.substring(cl, ct.length);

        let content = cf + varValue + ca;
        this.smsTemplateForm.smsContent = content;

      },
      openAdd() {
        this.smsTemplateFormVisible = true;
        this.smsTemplateForm = {smsContent: ''};
      },
      openEditor(current) {
        this.smsTemplateForm = current;
        this.smsTemplateFormVisible = true;
      },
      selectedTemplate(selected) {
        this.currentTemplate = selected;
        this.listStore();
      },
      selectedStore(selected) {
        if (this.currentTemplate) {
          let smsStoreTemplate = [];
          selected.map(e => {
            smsStoreTemplate.push({
              smsTemplateId: this.currentTemplate.smsTemplateId,
              storeId: e.storeId,
              storeName: e.storeName,
            });
          });
          api.addStore(this.currentTemplate.smsTemplateId, smsStoreTemplate).then(r => {
            this.listStore();
          });
        }
        else {
          this.$message('请选择模版才能增加店铺');
        }
        this.$refs.storeSelector.text = '';
      },
      removeStore(selectedStore) {
        api.removeStore(this.currentTemplate.smsTemplateId, selectedStore.smsStoreTemplateId).then(
          () => {
            this.listStore();
          });
      },
      fetchList() {
        api.list().then(r => {
          this.list = r;
        });
      },
      listStore() {
        if (this.currentTemplate) {
          api.listStore(this.currentTemplate.smsTemplateId).then(r => {
            this.stores = r;
          });
        }
      },
      save() {
        this.$refs.templateName.validate(vaild => {
          if (!vaild) {
            return;
          }

          if (this.smsTemplateForm.smsTemplateId) {
            api.modify(this.smsTemplateForm.smsTemplateId, this.smsTemplateForm).then(() => {
              this.fetchList();
              this.smsTemplateFormVisible = false;
            });
          }
          else {
            api.add(this.smsTemplateForm).then(() => {
              this.fetchList();
              this.smsTemplateFormVisible = false;
            });
          }
        });
      },
      enable(current) {
        if (current.enable) {
          api.disable(current.smsTemplateId).then(this.search);
        }
        else {
          api.enable(current.smsTemplateId).then(this.search);
        }
      },
    }
  };
</script>