<template>
  <el-select v-model="selected"
             :disabled="disabled"
             :clearable="true"
             :filterable="filterable"
             @focus="search">
    <el-option v-for="item in list"
               :key="item.contactId"
               :label="item.addr"
               :value="item">
    </el-option>
  </el-select>
</template>


<script>

  import {List} from '@/libs/mixins';
  import {StoreApi} from './api';
  import {Assert} from '@/libs/util';

  export default {
    mixins: [List],
    props: {
      value: String,
      addr: String,
      store: Object,
      disabled: {
        type: Boolean,
        default: false
      },
      filterable: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        pk: 'storeId',
        api: StoreApi,
        selected: null,
        list: []
      };
    },
    watch: {
      selected(val) {
        this.$emit('input', val.contactId);
        this.$emit('update:addr', val.addr);
      }
    },
    methods: {
      search() {
        if (this.store
          && Assert.inArray(this.store.mallType,
            ['TAOBAO', 'TAOBAO_FX', 'TAOBAO_JX', 'TMALL', 'TMALL_HK'])
          && !Assert.isEmpty(this.store.mallAppId)
          && !Assert.isEmpty(this.store.accessToken)) {
          StoreApi.getStoreReturnAddress(this.store).then(response => {
            this.list = response;
          });
        }
      },
    }
  };
</script>

<style scoped>

</style>