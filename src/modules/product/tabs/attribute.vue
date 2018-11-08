<template>
  <div :style="{height:tabsTableHeight+'px'}">
    <el-form>
      <el-row :gutter="10">
        <el-col :span="6" v-for="item in attributes" :key="item.attributeId">
          <el-form-item :label="item.attributeName">
            <el-input :value="domain[item.attributeId]" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import {TableResize, Tabs} from '@/libs/mixins';
  import {AttributeApi} from '../api';

  export default {
    name: 'ProductAttribute',
    mixins: [TableResize, Tabs],
    data() {
      return {
        tab: 'attribute',
        domain: {},
        attributes: [],
      };
    },
    created() {
      AttributeApi.listCustom().then(data => {
        this.attributes = data;
      });
    },
    methods: {
      search() {
        let val = this.parseAttr();
        this.domain = val;
      },
      parseAttr() {
        if (this.parentData && this.parentData.attributesJson) {
          return JSON.parse(this.parentData.attributesJson);
        } else {
          return {};
        }
      }
    }
  };
</script>