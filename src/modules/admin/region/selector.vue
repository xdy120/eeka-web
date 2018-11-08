<template>
  <el-cascader placeholder="请选择地区"
               v-model="selected"
               :options="list"
               :props="listProps"
               @active-item-change="handleItemChange"
               @change="onSelected"></el-cascader>
</template>
<script>

  import api from './api';

  let listPromises = new Map();

  export default {
    name: 'DistrictSelector',
    props: {
      countryId: {
        required: false,
      },
      provinceId: {
        required: false,
      },
      cityId: {
        required: false,
      },
      districtId: {
        required: false,
      },
      countryName: {
        required: false,
      },
      provinceName: {
        required: false,
      },
      cityName: {
        required: false,
      },
      districtName: {
        required: false,
      }
    },
    data() {
      return {
        listProps: {
          label: 'regionName',
          value: '_self',
          children: 'children',
        },
        list: [],
        selected: [],
      };
    },
    watch: {
      countryId(val) {
        val ? this.reload() : this.cleanup();
      },
      provinceId(val) {
        val ? this.reload() : this.cleanup();
      },
      cityId(val) {
        val ? this.reload() : this.cleanup();
      },
      districtId(val) {
        val ? this.reload() : this.cleanup();
      },
    },
    methods: {
      cleanup() {
        this.selected = [];
      },
      fetchList(parentId) {
        let p = listPromises.get(parentId);
        if (!p) {
          p = new Promise((resolve, reject) => {
            api.list({parentId: parentId}).then(r => {
              for (let i of r) {
                i._self = i;
                if (i.level < 4) {
                  i.children = [];
                }
              }
              resolve(r);
            }).catch(e => reject(e));
          });
          listPromises.set(parentId, p);
        }
        return p;
      },
      fetchChildren(parent) {
        parent && this.fetchList(parent.regionId).then(r => {
          parent.children = r;
        });
      },
      handleItemChange(item) {
        let last = item[item.length - 1];
        this.fetchChildren(last);
      },
      onSelected(selected) {
        this.$emit('confirm', selected);
        this.$emit('update:countryId', selected[0].regionId);
        this.$emit('update:provinceId', selected[1].regionId);
        this.$emit('update:cityId', selected[2].regionId);
        this.$emit('update:districtId', selected[3].regionId);
        this.$emit('update:countryName', selected[0].regionName);
        this.$emit('update:provinceName', selected[1].regionName);
        this.$emit('update:cityName', selected[2].regionName);
        this.$emit('update:districtName', selected[3].regionName);
      },
      reload() {
        this.fetchList(0).then(regions => {
          let cRegion;
          for (let r of regions) {
            if (r.regionId === this.countryId) {
              cRegion = r;
              break;
            }
          }
          this.list = regions;
          this.$set(this.selected, 0, cRegion);
          this.countryId && this.fetchList(this.countryId).then(provinces => {
            let cProvince;
            for (let p of provinces) {
              if (p.regionId === this.provinceId) {
                cProvince = p;
                break;
              }
            }
            cRegion && (cRegion.children = provinces);
            this.$set(this.selected, 1, cProvince);
            this.provinceId && this.fetchList(this.provinceId).then(cities => {

              let cCity;

              for (let c of cities) {
                if (c.regionId === this.cityId) {
                  cCity = c;
                  break;
                }
              }

              cProvince && (cProvince.children = cities);
              this.$set(this.selected, 2, cCity);

              this.cityId && this.fetchList(this.cityId).then(counties => {

                let cCounty;
                for (let c of counties) {
                  if (c.regionId === this.districtId) {
                    cCounty = c;
                    break;
                  }
                }

                cCity && (cCity.children = counties);
                this.$set(this.selected, 3, cCounty);

              });

            });
          });
        });
      }
    },
    created() {
      this.reload();
    }
  };
</script>
