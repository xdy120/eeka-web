<template>
  <div>
    <el-popover ref="popover" placement="bottom" width="400" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-row>
            <el-col :span="20">
              <el-input v-model="filterText" prefix-icon="el-icon-search"></el-input>
            </el-col>
            <el-col :span="4" align="right">
              <el-button @click="confirm">确认</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-table ref="dataTable" :data="filterList" :height="300"
                    @selection-change="selectionChange"
                    @current-change="currentRowChange" @row-dblclick="confirm">
            <el-table-column prop="dataDictItemId" type="selection" label="选择"
                             v-if="multiple"></el-table-column>
            <el-table-column prop="dataDictItemCode" label="编码"></el-table-column>
            <el-table-column prop="dataDictItemName" label="名称"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input :placeholder="placeholder" class="selector" v-model="text" v-popover:popover
              suffix-icon="el-icon-arrow-down">
      <el-button slot="append" icon="el-icon-close" @click="clean"
                 v-if="clearable&&text"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {DataDictApi} from './api';
  import {List, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';

  export default {
    name: 'DataDictItemSelector',
    mixins: [List, Selector],
    props: {
      code: String,
      placeholder: {
        type: String,
        default: '请选择'
      },
      dataDictId: {required: true},
      defaultFirst: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.text = val;
        } else {
          this.text = '';
          this.selectedItem = null;
          this.$refs.dataTable.clearSelection();
        }
      },
      filterText() {
        this.localSearch();
      },
      dataDictId: function () {
        this.search();
        this.text = '';
      }
    },
    data() {
      return {
        pk: 'dataDictItemName',
        api: DataDictApi,
        text: this.value,
        filterText: null,
        filterList: [],
        filter: {
          dataDictId: this.dataDictId
        }
      };
    },
    created() {
      this.search();
    },
    methods: {
      search() {
        DataDictApi.listItems(this.dataDictId).then(data => {
          this.list = data;
          this.filterList = data;
          if (this.defaultFirst && this.filterList.length > 0) {
            this.$refs.dataTable.setCurrentRow(this.filterList[0]);
            this.confirm(this.filterList[0]);
          }
        });
      },
      localSearch() {
        if (!Assert.isEmpty(this.filterText)) {
          let filterData = [];
          let reg = new RegExp(this.filterText.trim(), 'i');
          for (let item of this.list) {
            if (reg.test(item.dataDictItemCode) || reg.test(item.dataDictItemName)) {
              filterData.push(item);
            }
          }
          this.filterList = filterData;
        }
        else {
          this.filterList = this.list;
        }
      },
      customClean() {
        this.$emit('update:code', null);
      },
      customConfirm(inputValue) {
        this.text = inputValue;
        if (this.iMultiple) {
          let code = this.selectedItems.map(x => x.dataDictItemCode).join();
          this.$emit('update:code', code);
        } else {
          this.$emit('update:code', this.selectedItem.dataDictItemCode);
        }
      }
    },
  };
</script>