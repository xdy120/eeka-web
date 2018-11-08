<template>
  <div v-if="visible" style="margin-bottom: 5px">
    <el-row :gutter="10" style="margin-bottom: 5px;">
      <el-col :span="18">
        <span class="warning"
              style="font-size: 14px;margin-right: 20px">当前配置：{{currentConfig}}</span>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            配置<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <go-drop-down-item v-for="item in configList" :key="item"
                               @click="getConfig(componentName, item)">
              {{item}}
            </go-drop-down-item>
            <go-drop-down-item divided @click="saveConfig">
              保存配置
            </go-drop-down-item>
            <go-drop-down-item @click="saveOtherConfig">
              另存为配置
            </go-drop-down-item>
            <go-drop-down-item divided @click="getConfigList(componentName)">
              刷新配置
            </go-drop-down-item>
            <go-drop-down-item @click="deleteConfig(componentName, currentConfig)">
              删除配置
            </go-drop-down-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span style="margin-left: 15px">
          <el-checkbox style="margin-left: 5px" v-model="mustNotVisible">不满足全部条件</el-checkbox>
          <el-checkbox style="margin-left: 5px" v-model="shouldVisible">满足任意条件</el-checkbox>
        </span>
      </el-col>
      <el-col :span="6">
        <slot></slot>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <span class="danger" style="font-size: 14px;">满足全部条件</span>
        <el-button type="text" @click="addQueryCondtion('MUST')">
          <span class="success" style="font-size: 14px">添加字段</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6" :key="item.id" v-for="item in vMustSelectedFields">
        <query-condition :item="item" :custom-fields="vCustomFields"
                         @delete="deleteField"></query-condition>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="mustNotVisible">
      <el-col :span="24">
        <span class="danger" style="font-size: 14px;">不满足全部条件</span>
        <el-button type="text" @click="addQueryCondtion('MUST_NOT')">
          <span class="success" style="font-size: 14px">添加字段</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="mustNotVisible">
      <el-col :span="6" :key="item.id" v-for="item in vMustNotSelectedFields">
        <query-condition :item="item" :custom-fields="vCustomFields"
                         @delete="deleteField"></query-condition>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="shouldVisible">
      <el-col :span="24">
        <span class="danger" style="font-size: 14px;">满足任意条件</span>
        <el-button type="text" @click="addQueryCondtion('SHOULD')">
          <span class="success" style="font-size: 14px">添加字段</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="shouldVisible">
      <el-col :span="6" :key="item.id" v-for="item in vShouldSelectedFields">
        <query-condition :item="item" :custom-fields="vCustomFields"
                         @delete="deleteField"></query-condition>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {AdvanceQueryApi} from './api';
  import {List} from '@/libs/mixins/index';
  import StoreSelector from '@/modules/base/store/store.selector';
  import {BoolType, FieldType} from '@/component/query/index';
  import QueryCondition from '@/component/query/query.condition';

  export default {
    name: 'AdvanceQuery',
    components: {QueryCondition, StoreSelector},
    mixins: [List, FieldType],
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      generalConfig: {
        type: Object,
        default: () => {
        }
      },
      customFields: {
        type: Array
      },
      selectedFields: {
        type: Array,
        default: () => []
      },
      componentName: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        api: AdvanceQueryApi,
        rules: [],
        domain: {},
        vSelectedFields: [],
        vMustSelectedFields: [],
        vMustNotSelectedFields: [],
        vShouldSelectedFields: [],
        vCustomFields: this.customFields,
        vFieldType: FieldType,
        configList: {},
        currentConfig: '',
        mustNotVisible: false,
        shouldVisible: false,
        id: 0
      };
    },
    created() {
      this.getConfigList(this.componentName);
    },
    watch: {
      vSelectedFields() {
        this.vMustSelectedFields = [];
        this.vMustNotSelectedFields = [];
        this.vShouldSelectedFields = [];
        for (let field of this.vSelectedFields) {
          if (field.boolType === BoolType.MUST.title) {
            this.vMustSelectedFields.push(field);
          } else if (field.boolType === BoolType.MUST_NOT.title) {
            this.vMustNotSelectedFields.push(field);
          } else if (field.boolType === BoolType.SHOULD.title) {
            this.vShouldSelectedFields.push(field);
          }
        }
      }
    },
    methods: {
      getConfig(component, configName) {
        this.api.getConfig(component, configName).then(response => {
          if (response && response.config) {
            this.vSelectedFields = response.config;
            this.mustNotVisible = response.mustNotVisible;
            this.shouldVisible = response.shouldVisible;
            this.currentConfig = configName;
          } else {
            this.vSelectedFields = [];
            this.mustNotVisible = false;
            this.shouldVisible = false;
            this.currentConfig = '';
          }
          if (this.vSelectedFields[this.vSelectedFields.length - 1]) {
            this.id = this.vSelectedFields[this.vSelectedFields.length - 1].id;
          }
        });
      },
      getConfigList(component) {
        this.api.getConfigList(component).then(response => {
          if (response) {
            this.configList = response.configList;
            if (!this.currentConfig && this.configList[0]) {
              this.getConfig(component, this.configList[0]);
            }
          }
        });
      },
      deleteConfig(component, configName) {
        this.api.deleteConfig(component, configName).then(() => {
          this.currentConfig = '';
          this.$message.success('删除配置成功');
          this.getConfigList(component);
        });
      },
      saveConfig() {
        if (this.currentConfig) {
          this.api.saveConfig(this.componentName, this.currentConfig,
            {
              config: this.vSelectedFields,
              mustNotVisible: this.mustNotVisible,
              shouldVisible: this.shouldVisible
            }).then(
            () => {
              this.$message.success('保存配置成功');
              this.getConfigList(this.componentName);
            });
        } else {
          this.saveOtherConfig();
        }
      },
      saveOtherConfig() {
        this.$prompt('请输入配置名称', '保存').then(({value}) => {
          this.api.saveConfig(this.componentName, value, {
            config: this.vSelectedFields,
            mustNotVisible: this.mustNotVisible,
            shouldVisible: this.shouldVisible
          }).then(
            () => {
              this.$message.success('保存配置成功');
              this.getConfigList(this.componentName);
            });
        });
      },
      addQueryCondtion(boolType) {
        if (boolType === BoolType.MUST.title) {
          this.vSelectedFields.push(
            {id: ++this.id, field: this.vCustomFields[0], boolType: BoolType.MUST.title});
        } else if (boolType === BoolType.MUST_NOT.title) {
          this.vSelectedFields.push(
            {id: ++this.id, field: this.vCustomFields[0], boolType: BoolType.MUST_NOT.title});
        } else if (boolType === BoolType.SHOULD.title) {
          this.vSelectedFields.push(
            {id: ++this.id, field: this.vCustomFields[0], boolType: BoolType.SHOULD.title});
        }
      },
      deleteField(item) {
        let index = this.vSelectedFields.indexOf(item);
        if (index !== -1) {
          this.vSelectedFields.splice(index, 1);
        }
      },
      constructQueryDomain() {
        let fields = [];
        for (let i = 0; i < this.vSelectedFields.length; i++) {
          let field = this.vSelectedFields[i];
          if (field.value || field.value === 0 ||
            (!field.value && (field.operator === 'NULL' || field.operator === 'NOT_NULL'))) {
            let data = {
              field: field.field.field,
              type: field.field.type.name,
              value: field.value,
              operator: field.operator,
              boolType: field.boolType
            };
            if (typeof field.value === 'string') {
              data.value = field.value.trim();
            }
            if (field.field.relation) {
              data.relation = field.field.relation;
            }
            if (field.field.type.name === 'DATETIME') {
              data.value = field.value.getTime();
            }
            fields.push(data);
          }
        }
        const params = new URLSearchParams();
        params.set('fields', JSON.stringify(fields));
        return params;
      },
      resetDomain() {
        for (let i = 0; i < this.vSelectedFields.length; i++) {
          let field = this.vSelectedFields[i];
          if (field.value || field.value === 0) {
            field.value = undefined;
          }
        }
      },
      clearSelected(item) {
        if (item.operator) {
          item.operator = undefined;
        }
        if (item.value || item.value === 0) {
          item.value = undefined;
        }
      }
    },
  };
</script>