<template>
  <div class="container">
    <el-header class="header">
      <el-button type="primary" size="small" icon="el-icon-edit">新增</el-button>
    </el-header>
    <el-container class="main">
      <tree :data="calculateCatalogs"></tree>
    </el-container>
  </div>
</template>

<script>
import Tree from '../../components/Tree';
import {mapActions, mapState} from 'vuex';
export default {
  data() {
    return {
      form: {
      }
    }
  },
  components: {
    Tree
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
    }
  },
  methods: {
    ...mapActions('goods', [
      'getGoodsCatalogs'
    ])
  },
  mounted() {
    this.getGoodsCatalogs();
  }
}
</script>

<style scoped lang="less">
  .line{
    text-align: center;
  }
  .container {
    padding: 0 20px;
    .header{
      display: flex;
      padding: 10px 20px;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>

