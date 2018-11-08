<template>
  <el-container>
    <el-main>
      <el-input v-model="domain" placeholder="请输入公司域名"></el-input>
      <el-button @click="loadDomain">下一步</el-button>
    </el-main>
    <el-footer>
      已登录的组织：{{domains.length}} 个
      <el-button :key="item.organizationId" v-for="item in domains" @click="changeDomain(item)">
        {{item.organizationName}}
      </el-button>
    </el-footer>
  </el-container>
</template>
<script>
  import {CHANGE_DOMAIN, LOAD_ORGAN} from '@/libs/mutation.types';
  import {OrganizationApi} from './api';
  import {Assert} from '@/libs/util';
  import {mapGetters} from 'vuex';

  export default {
    props: {},
    data() {
      return {
        domain: null,
      };
    },
    created() {
      this.domain = this.$store.getters.domain;
    },
    computed: {
      ...mapGetters(['domains'])
    },
    methods: {
      changeDomain(organ) {
        this.$store.commit(CHANGE_DOMAIN, organ.domain);
        this.$router.push('/login');
      },
      loadDomain() {
        if (!Assert.isEmpty(this.domain)) {
          OrganizationApi.getByDomain(this.domain).then(data => {
            if (!Assert.isBlank(data)) {
              this.$store.dispatch(LOAD_ORGAN, data);
            } else {
              this.$message.error('未找到此组织，请确认输入的域名是否正确！');
            }
          });
        } else {
          this.$message.warning('请输入公司域名');
        }
      }
    }
  };
</script>