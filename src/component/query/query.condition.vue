<template>
  <div style="display: inline-block;">
    <div style="display: inline-block;width: 12px;">
      <el-button type="text" @click.prevent="deleteField(item)">
        <el-icon class="danger" name="delete"></el-icon>
      </el-button>
    </div>
    <el-select v-model="item.field" value-key="label" :clearable="false"
               @change="clearSelected(item)" style="width: 30%;display: inline-block">
      <el-option v-for="field in vCustomFields" :key="field.label" :label="field.label"
                 :value="field"/>
    </el-select>
    <el-select v-model="item.operator" value-key="value" :clearable="false"
               style="width:20%;display: inline-block">
      <template v-if="item.field.type.name === 'TEXT'">
        <el-option v-for="operator in vFieldType.text.operators" :key="operator.title"
                   :label="operator.caption" :value="operator.title"/>
      </template>
      <template v-else-if="item.field.type.name === 'LONG'">
        <el-option v-for="operator in vFieldType.long.operators" :key="operator.title"
                   :label="operator.caption" :value="operator.title"/>
      </template>
      <template v-else-if="item.field.type.name === 'FLOAT'">
        <el-option v-for="operator in vFieldType.float.operators" :key="operator.title"
                   :label="operator.caption" :value="operator.title"/>
      </template>
      <template v-else-if="item.field.type.name === 'BOOLEAN'">
        <el-option v-for="operator in vFieldType.boolean.operators" :key="operator.title"
                   :label="operator.caption" :value="operator.title"/>
      </template>
      <template v-else-if="item.field.type.name === 'DATETIME'">
        <el-option v-for="operator in vFieldType.datetime.operators" :key="operator.title"
                   :label="operator.caption" :value="operator.title"/>
      </template>
      <template v-else-if="item.field.type.name === 'ENUM'">
        <el-option v-for="operator in vFieldType.enum.operators" :key="operator.title"
                   :label="operator.caption" :value="operator.title"/>
      </template>
      <template v-else-if="item.field.type.name === 'STORE'">
        <el-option v-for="operator in vFieldType.store.operators" :key="operator.title"
                   :label="operator.caption" :value="operator.title"/>
      </template>
    </el-select>
    <div style="width: 40%;display: inline-block">
      <template
          v-if="item.field && item.operator && item.operator !== 'NULL' && item.operator !== 'NOT_NULL'">
        <el-input-number v-model="item.value"
                         v-if="item.field.type.name === 'LONG' || item.field.type.name === 'FLOAT'"/>
        <el-select v-model="item.value" placeholder="请选择"
                   v-else-if="item.field.type.name === 'BOOLEAN'">
          <el-option key="true" label="是" value="true"/>
          <el-option key="false" label="否" value="false"/>
        </el-select>
        <el-date-picker v-model="item.value" type="datetime"
                        v-else-if="item.field.type.name === 'DATETIME'"/>
        <enum-selector v-model="item.value" :enum-name="item.field.enumName"
                       :multiple="true" :useValue="true"
                       v-else-if="item.field.type.name === 'ENUM'"/>
        <store-selector multiple v-model="item.value"
                        v-else-if="item.field.type.name === 'STORE'"/>
        <el-input v-model="item.value" v-else/>
      </template>
      <el-input :disabled="true" v-else/>
    </div>
  </div>
</template>
<script>
  import {AdvanceQueryApi} from './api';
  import {List} from '@/libs/mixins/index';
  import StoreSelector from '@/modules/base/store/store.selector';
  import {FieldType} from '@/component/query/index';

  export default {
    name: 'QueryCondition',
    components: {StoreSelector},
    mixins: [List, FieldType],
    props: {
      customFields: {
        type: Array
      },
      item: {
        type: Object
      }
    },
    data() {
      return {
        api: AdvanceQueryApi,
        rules: [],
        vCustomFields: this.customFields,
        vFieldType: FieldType,
        id: 0
      };
    },
    created() {
    },
    watch: {
    },
    methods: {
      clearSelected(item) {
        if (item.operator) {
          item.operator = undefined;
        }
        if (item.value || item.value === 0) {
          item.value = undefined;
        }
      },
      deleteField(item) {
        this.$emit('delete', item);
      }
    },
  };
</script>