<template>
  <div class="container">
    <el-header class="header">
      <el-button type="primary" size="small" icon="el-icon-edit" @click="handleAddCate">新增</el-button>
    </el-header>
    <el-container class="main">
      <tree :data="calculateCatalogs"></tree>
    </el-container>

    <el-dialog title="新增分类" :visible.sync="edit">
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.front_name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.front_desc"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Tree from '../../components/Tree';
import {mapActions, mapState} from 'vuex';
export default {
  data() {
    return {
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
    ]),
    handleAddCate () {
      this.edit = true;
    }
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

