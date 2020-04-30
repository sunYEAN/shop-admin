<template>
  <div class="container">
    <el-header class="header">
      <el-button type="primary" size="small" icon="el-icon-edit" @click="handleAddCate">新增</el-button>
    </el-header>
    <el-container class="main">
      <!--      <tree :data="calculateCatalogs"></tree>-->
      <ul>
        <li v-for="i in catalogs" :key="i.id">{{i.name}}</li>
      </ul>

      <el-table :>
        <el-table-column></el-table-column>
      </el-table>

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
                current_sup: ''
            }
        },
        components: {
            Tree
        },
        computed: {
            ...mapState('goods', {
                catalogs: state => state.catalogs
            }),
        },
        methods: {
            ...mapActions('goods', [
                'getGoodsCatalogs'
            ]),
            handleAddCate() {
                this.edit = true;
            }
        },
        mounted() {
            this.getGoodsCatalogs();
        }
    }
</script>

<style scoped lang="less">
  .line {
    text-align: center;
  }

  .container {
    padding: 0 20px;

    .header {
      display: flex;
      padding: 10px 20px;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>

