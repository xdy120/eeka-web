<style scoped lang="less">
  @import "../../styles/login.less";
</style>
<template>
  <div>
    <div id="login">
      <el-row type="flex" justify="center" align="middle" style="position: relative;z-index: 3"
              @keyup.enter.native="login">
        <el-col :span="7">
          <h1>
            <img src="../../assets/images/logo.png" class="img-logo">
          </h1>
          <el-form :model="domain" :rules="rules" ref="loginForm" label-width="0px">
            <!--<el-form-item>-->
            <!--<el-select size="large" placeholder="公司域名" v-model="organDomain" @change="changeDomain">-->
            <!--<el-option v-for="item in domains" :key="item.domain" :label="item.organizationName" :value="item.domain"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item prop="loginName">
              <el-input size="large" placeholder="请输入用户名" v-model="domain.loginName">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="domain.loginPassword" placeholder="请输入2-20位密码"
                        size="large"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="large" style="width:100%" @click="login">登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div id="div3D"></div>
    <div v-if="config.copyright"
         style="position: absolute;bottom: 10px;z-index: 101;width: 100%;text-align: center;height:48px">
      <div style="height:48px; line-height: 48px;display: inline-block">
        <span class="info"><a :href="config.copyrightUrl" target="_blank"><span class="info">{{config.copyrightNo}}</span></a> {{config.copyrightTitle}}</span>
      </div>
      <div style="line-height: 48px;display: inline-block">
        <a :href="config.govUrl" target="_blank"><img
            src="../../assets/images/gov.png" height="48"/></a>
      </div>
    </div>
  </div>
</template>
<script>
  import {CHANGE_DOMAIN, USER_LOGIN} from '@/libs/mutation.types';
  import THREE from '@/libs/three/three';
  import {AuthApi} from './api';
  import {mapGetters} from 'vuex';
  import {JSEncrypt} from 'jsencrypt';
  import config from '@/config/config';

  export default {
    data() {
      return {
        domain: {},
        config,
        organDomain: null,
        rules: {
          loginName: [
            {required: true, message: '请输入登录名', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
          ],
          loginPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符'}
          ]
        },
      };
    },
    computed: {
      ...mapGetters(['domains', 'loginName'])
    },
    created() {
      // if (Assert.isEmpty(this.domains) || this.domains.length === 0) {
      //     this.$router.push('/organization');
      //     return;
      // }
      // this.organDomain = this.$store.getters.domain;
      this.domain.loginName = this.$store.getters.loginName;
    },
    methods: {
      changeDomain(domain) {
        this.$store.commit(CHANGE_DOMAIN, domain);
      },
      div3DInit() {
        let SCREEN_WIDTH = window.innerWidth;
        let SCREEN_HEIGHT = window.innerHeight;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        let SEPARATION = 90, AMOUNTX = 50, AMOUNTY = 50;
        let container, particles, particle, count, camera, scene, renderer, mouseX = 0, mouseY = 0;

        init();
        this.interval = setInterval(loop, 25);

        function init() {
          container = document.createElement('div');
          container.style.position = 'relative';
          container.style.top = '300px';
          document.getElementById('div3D').appendChild(container);
          camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
          camera.position.z = 1000;
          scene = new THREE.Scene();
          renderer = new THREE.CanvasRenderer();
          renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
          particles = new Array();
          var i = 0;
          var material = new THREE.ParticleCircleMaterial(0x0099FF, 1);
          for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
              particle = particles[i++] = new THREE.Particle(material);
              particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
              particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
              scene.add(particle);
            }
          }
          count = 0;
          container.appendChild(renderer.domElement);
          document.addEventListener('mousemove', onDocumentMouseMove, false);
        }

        function onDocumentMouseMove(event) {
          mouseX = event.clientX - windowHalfX;
          mouseY = event.clientY - windowHalfY;
        }

        function loop() {
          camera.position.x += (mouseX - camera.position.x) * .05;
          camera.position.y = 364;
          var i = 0;
          for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
              particle = particles[i++];
              particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count)
                * 0.5) * 50);
              particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2
                + (Math.sin((iy + count) * 0.5) + 1) * 2;
            }
          }
          renderer.render(scene, camera);
          count += 0.1;
        }
      },
      login() {
        this.$refs.loginForm.validate().then(() => {
          let jsEncrypt = new JSEncrypt();
          let publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgoNOa2WFhFzMtOKzEfG8+r9fw
z7C7TDmQztUp5M0bayRtjBeu1hIYJg45N+0Jl+SoVmNp48KgXD+7MxTSNZgdgttM
dVLC7J5NmfFAfmVgYfzed8mnIh3n4pCRUYwozOn6GfLoBHoHopNE74PF9KrzTEmP
BoLfOxqf0t2L2rzYfQIDAQAB
-----END PUBLIC KEY-----
`;
          jsEncrypt.setPublicKey(publicKey);
          let loginRequest = {
            loginName: jsEncrypt.encrypt(this.domain.loginName),
            loginPassword: jsEncrypt.encrypt(this.domain.loginPassword),
          };
          AuthApi.login(loginRequest).then(response => {
            this.$store.dispatch(USER_LOGIN, response);
          }).catch(e => {
            this.$message.error('用户名或密码错！');
          });
        });
      }
    },
    mounted() {
      this.div3DInit();
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  };
</script>
