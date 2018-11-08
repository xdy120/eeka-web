<template>
  <el-container>
    <el-header height="35px">
      <el-button @click="beforeShowEditor">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight">
        <el-table-column label="编码" prop="dataDictItemCode" :width="200"></el-table-column>
        <el-table-column label="名称" prop="dataDictItemName" :width="200"></el-table-column>
        <el-table-column label="操作" :width="200">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <go-delete-button @click="remove(scope.row)"></go-delete-button>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
      </el-table>
      <data-dict-item-editor ref="editor" :data-dict="dataDict"
                             @ok="search"></data-dict-item-editor>
    </el-main>
  </el-container>
</template>
<script>
  import {DataDictApi, DataDictItemApi} from './api';
  import {List, TableResize} from '@/libs/mixins';
  import DataDictItemEditor from './datadict.item.edit.vue';

  export default {
    mixins: [TableResize, List],
    components: {DataDictItemEditor},
    props: {
      dataDict: {
        required: true
      }
    },
    watch: {
      dataDict(val) {
        this.iDataDict = val;
        this.search();
      }
    },
    data() {
      return {
        pk: 'dataDictItemId',
        api: DataDictItemApi,
        iDataDict: this.dataDict
      };
    },
    methods: {
      search() {
        if (this.iDataDict) {
          this.doSearch(DataDictApi.listItems(this.iDataDict.dataDictId));
        }
      },
      beforeShowEditor() {
        const selectItem = this.$emit('selectedDictId');
        if (selectItem.iDataDict === null || selectItem.iDataDict.dataDictType === 'GROUP') {
          this.$message.warning('请先选择一个字典');
        } else {
          this.showEditor();
        }
      }
    }
  };
</script>
