<template>
  <div class="cate_container">

    <div class="container sup">
      <div class="sup_list">
        <ul class="">
          <li v-for="sup in calculateCatalogs" :key="sup.id">
            {{sup.name}}
          </li>
        </ul>
      </div>

      <div class="sup_info">

      </div>
    </div>
    <div class="container sub"></div>

  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default {
  data() {
    return {
      current_cate: 0,
      currentSupCate: {},
      form: {
        name: '',
        front_name: '',
        front_desc: '',
        parent_id: '',
        sort_order: 0,
        show_index: 0,
        is_show: 1,
        banner_url: '',
        icon_url: '',
        img_ur: '',
        wap_banner_url: '',
        level: 'L1',
        type: '',
      },
      edit: false,
    }
  },
  computed: {
    ...mapState('goods', {
      catalogs: state => state.catalogs
    }),
    calculateCatalogs () {
      const catalogs = this.catalogs;
      const temp = {};

      catalogs.forEach(item => {
        item.children = [];
        if (!item.parent_id) {
          temp[item.id] = item;
        } else {
          if (!temp[item.parent_id]) {
            temp[item.parent_id] = {
              children: []
            }
          } else {
            temp[item.parent_id].children.push(item);
          }
        }
      });

      return temp;
    },
    supCate () {
      return this.calculateCatalogs()
    }
  },
  methods: {
    ...mapActions('goods', [
      'getGoodsCatalogs'
    ]),
  },
  mounted() {
    this.getGoodsCatalogs();
  }
}
</script>

<style scoped lang="less">

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      cursor: pointer;
      height: 50px;
      padding: 0;
      box-sizing: border-box;
      padding-left: 10px;

      &.active {
        color: #409EFF;
        font-weight: bold;
        background-color: #f3f5f7;
      }

      &:hover {
        color: #409EFF;
        background-color: #f3f5f7;
      }
    }
  }
  .cate_container{
    font-size: 14px;
    .container{
      &.sup{
        .sup_list{
          width: 200px;
          ul{
            li{
              display: flex;
              align-items: center;
            }
          }
        }
      }
      &.sub{}
    }
  }
</style>

