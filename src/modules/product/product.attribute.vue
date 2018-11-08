<template>
  <div style="height:280px" class="oms-search">
    <el-form :model="domain" ref="editForm" label-width="100px">
      <el-row :gutter="10" v-for="(row,index) in attributesGroup" :key="index">
        <el-col :span="8" v-for="item in row" :key="item.attributeId">
          <el-form-item :label="item.attributeName">
            <el-input v-if="item.attributeType==='TEXT'"
                      v-model="domain[item.attributeId]"></el-input>
            <data-dict-item-selector v-else v-model="domain[item.attributeId]"
                                     :data-dict-id="item.dataDictId"></data-dict-item-selector>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import {DataDictItemSelector} from '@/modules/selector';
  import {AttributeApi} from './api';

  export default {
    name: 'ProductAttribute',
    components: {DataDictItemSelector},
    props: {
      value: String
    },
    watch: {
      value(val) {
        this.domain = this.parseAttr(val);
      }
    },
    computed: {
      attributesGroup: function () {
        let list = this.attributes;
        let arrTemp = [];
        let index = 0;
        let sectionCount = 3;
        for (let i = 0; i < list.length; i++) {
          index = Math.floor(i / sectionCount);
          if (arrTemp.length <= index) {
            arrTemp.push([]);
          }
          arrTemp[index].push(list[i]);
        }
        return arrTemp;
      }
    },
    data() {
      return {
        domain: {},
        attributes: [],
      };
    },
    created() {
      AttributeApi.listCustom().then(data => {
        this.attributes = data;
        this.domain = this.parseAttr(this.value);
      });
      this.$watch('domain', val => {
        this.$emit('input', JSON.stringify(val));
      }, {deep: true});
    },
    methods: {
      parseAttr(val) {
        if (val) {
          return JSON.parse(val);
        } else {
          return {};
        }
      }
    }
  };
</script>