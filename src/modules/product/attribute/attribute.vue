<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="filter.attributeName" placeholder="属性名称"
                    @keyup.enter.native="clickSearch"></el-input>
        </el-col>
      </el-row>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="showEditor()">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <attribute-editor ref="editor" @ok="search"></attribute-editor>
      <el-table :data="list" :height="mainHeight" @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column prop="attributeName" label="属性名称" :width="200"></el-table-column>
        <go-enum-column prop="attributeType" label="输入类型" enum-name="ProductAttributeType"
                        :width="120"></go-enum-column>
        <el-table-column prop="dataDictName" label="数据字典" :width="120"></el-table-column>
        <go-boolean-column prop="system" label="系统内置" :width="80"></go-boolean-column>
        <go-boolean-column prop="useCode" label="生成编码" :width="80"></go-boolean-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <go-modify-button v-if="!scope.row.system"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-delete-button v-if="!scope.row.system"
                              @click="remove(scope.row)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
  import {List, TableResize} from '@/libs/mixins';
  import AttributeEditor from './attribute.edit.vue';
  import {AttributeApi} from '../api';

  export default {
    mixins: [TableResize, List],
    components: {AttributeEditor},
    data() {
      return {
        pk: 'attributeId',
        api: AttributeApi
      };
    }
  };
</script>
