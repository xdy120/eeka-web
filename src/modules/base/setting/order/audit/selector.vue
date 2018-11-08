<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="400" v-model="show">
      <el-container>
        <el-header height="35px">
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" @current-change="selectItem" @row-dblclick="confirm">
            <el-table-column prop="settingJson.name" label="策略名称"></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-popover>
    <el-input v-model="text" readonly>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
  </div>
</template>

<script>
  import api from './api';

  export default {
    name: 'OrderAuditSelector',
    props: {
      value: {
        required: true
      },
      orderStrategyName: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        show: false,
        text: this.orderStrategyName,
        list: [],
        selected: undefined,
        filter: {},
        total: 0
      };
    },
    watch: {
      orderStrategyName(val) {
        this.text = val;
      }
    },
    methods: {
      showDialog() {
        this.show = true;
      },
      search() {
        api.list().then(r => {
          this.list = r.map(e => {
            e.settingJson = JSON.parse(e.settingJson);
            return e;
          }).filter(e => e.settingJson.name === (this.filter.name || e.settingJson.name));
        });
      },
      reset() {
        this.filter = {};
      },
      selectItem(row) {
        this.selected = row;
      },
      confirm(row) {
        if (row) {
          this.selected = row;
        }
        this.text = this.selected.settingJson.name;
        this.$emit('input', this.selected.settingId);
        this.$emit('update:orderStrategyName', this.text);
        this.$emit('confirm', this.selected);

        this.show = false;
      }
    },
    created() {
      this.search();
    },
  };
</script>