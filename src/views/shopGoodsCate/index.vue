<template>
  <div class="category-container">

    <div class="category_sup">
      <ul class="sup_list scroller">
        <li class="category_title">
          (顶级分类，权重越小越靠前)
          <i class="el-icon-check success bold"></i>开启
          <i class="el-icon-close light bold"></i>关闭
        </li>
        <li class="category_item"
            @click="setCurrentCatalog(i)"
            :class="{active: current.id === i.id}"
            v-for="i in computedSup" :key="i.id">
          <span>
            <i v-if="i.is_show" class="el-icon-check success bold"></i>
            <i v-else class="el-icon-close light bold"></i>
            {{i.name}}
            <i style="color: #999;font-style: normal;">（权重：{{i.sort_order}}）</i>
          </span>
          <span class="icons">
            <i class="icon el-icon-edit"
               title="编辑"
               @click.stop="setToast(i)"></i>
            <i class="icon el-icon-delete light"
               title="删除"
               @click.stop="removeOne(i)"></i>
          </span>
        </li>
      </ul>

      <span class="sup_add">
        <i class="icon el-icon-plus" @click="setToast()"></i>
      </span>

    </div>

    <div class="category_sub">
      <div class="header">
        <div class="word">
          <p>当前顶级分类：</p>
          <img :src="current.icon_url" alt="">
          <span>{{current.name}}</span>
        </div>
        <el-button class="sub_add" @click="setToast({parent_id: current.id})" type="primary" size="small">新增</el-button>
      </div>
      <el-table class="sub_table" stripe
                :data="currentSubs" border>
        <el-table-column align="center" prop="id" label="id"></el-table-column>
        <el-table-column align="center" prop="name" label="参数名(name)"></el-table-column>


        <el-table-column align="center" prop="wap_banner_url" width="150px" label="wap_banner_url">
          <template slot-scope="{row}">
            <img class="wap_img" :src="row.wap_banner_url" alt="">
          </template>
        </el-table-column>

        <el-table-column align="center" prop="parent_id" label="父类(parent_id)">
          <template slot-scope="{row}">
            {{current.name}}-{{row.parent_id}}
          </template>
        </el-table-column>

        <!--          <el-table-column align="center" prop="icon_url"           label="图标(icon_url)"></el-table-column>-->
        <!--          <el-table-column align="center" prop="img_url"            label="图片(img_url)"></el-table-column>-->
        <el-table-column align="center" prop="type" label="类型(type)"></el-table-column>

        <el-table-column align="center" width="100px" label="开启状态">
          <template slot-scope="{row}">
            <el-switch v-model="row.is_show" @change="handleChangeAttrEnabled(row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="front_name" label="名称(front_name)"></el-table-column>
        <el-table-column align="center" prop="front_desc" label="描述(front_desc)"></el-table-column>


        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="{row}">
            <a class="action edit" title="编辑" @click="setToast(row)">编辑</a>
            <a class="action delete" title="删除" @click="removeOne(row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!--  编辑分类  -->
    <v-category :visible.sync="form.show"
                :data="form.data"
                :categories="computedSup"
                @submit="handleSubmit"></v-category>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import SearchBar from '../../components/SearchBar';
  import {VCategory} from './components';


  export default {
    data() {
      return {
        rule: {
          name: [
            {
              required: true,
              message: '请填写一个名称...',
              trigger: 'change'
            }
          ]
        },

        // 分类
        form: {
          show: false,
          data: {}
        },
      }
    },
    components: {
      VCategory,
      SearchBar,
    },
    computed: {
      ...mapState('goods', {
        current: state => state.currentCatalog,
        catalogs: state => state.catalogs,
      }),
      computedSup() {
        return this.catalogs.filter(cate => cate.level === 1) || [];
      },

      computedSub() {
        return this.catalogs.filter(cate => cate.level === 2) || [];
      },

      currentSubs() {
        return this.computedSub.filter(c => c.parent_id === this.current.id) || [];
      },
    },
    watch: {
      catalogs(nVal) {
        this.setCurrentCatalog(nVal[0] || {});
      }
    },
    methods: {
      ...mapActions('goods', [
        'getGoodsCatalogs',
        'handleApiMethods',
        'setCurrentCatalog'
      ]),

      /**
       * method 设置编辑弹窗的值
       */
      setToast(data) {
        this.form = {
          show: true,
          data: (data || {})
        }
      },

      /**
       * method 关闭编辑分类弹窗
       */
      clearToast() {
        this.form = {
          show: false,
          data: {}
        }
      },

      removeOne(payload) {
        const h = this.$createElement;
        const {name, id} = payload;
        this.$msgbox({
          title: '温馨提示',
          message: h('p', null, [
            h('span', null, '确认删除'),
            h('b', {style: 'color: #d40f33;margin: 0 4px'}, name),
            '吗?'
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.handleApiMethods({
            method: 'deleteGoodCategory',
            payload: {id}
          }).then(() => {
            this.$notify({
              type: "success",
              message: '删除成功',
            });
            this.getGoodsCatalogs({reset: true});
          })
        }).catch(err => {
          console.log(err);
        })

      },

      /**
       * event handler 监听编辑分类弹窗提交
       * @param form
       */
      handleSubmit(form) {
        let payload = Object.assign({}, form);
        payload.is_show = payload.is_show ? 1 : 0;
        this.handleApiMethods({
          method: 'storeGoodCategory',
          payload
        }).then((res) => {
          this.$notify({
            type: "success",
            message: (payload.id ? '编辑' : '新增') + '成功',
          });

          this.clearToast();
          this.getGoodsCatalogs({reset: true});
        })
      },

      handleChangeAttrEnabled(row) {
        this.handleSubmit(row);
      },
    },
    mounted() {
      this.getGoodsCatalogs();
    }
  }
</script>

<style scoped>
  >>> .el-form-item {
    margin-bottom: 0;
  }

  >>> .el-table {
    border-top: none;
  }
</style>
<style scoped lang="less">
  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      color: #565656;
      cursor: pointer;
      height: 50px;
      padding: 0;
      box-sizing: border-box;
      padding-left: 10px;

      &.active {
        font-weight: bold;
        background-color: #f3f5f7;
      }

      &:hover {
        font-weight: bold;
        background-color: #f3f5f7;
      }
    }
  }

  .edit {
    color: #409EFF;
  }

  .delete {
    color: #d40f33;
  }

  .scroller {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .category-container {
    color: #343434;
    height: 100%;
    display: flex;
    font-size: 14px;
    background-color: #f3f5f7;

    .category_sup {
      width: 300px;
      position: relative;
      flex-shrink: 0;
      border-right: 1px solid #e9e9e9;
      background-color: #ffffff;

      .sup_add {
        left: 50%;
        border: none !important;
        bottom: 10px;
        margin: 0;
        padding: 0;
        position: absolute;

        &:hover {
          background-color: transparent;

          .icon {
            box-shadow: none;
          }
        }

        .icon {
          width: 40px;
          color: #ffffff;
          height: 40px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          border-radius: 50%;
          justify-content: center;
          background-color: #409EFF;
          transition: box-shadow 0.1s ease-in-out;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
        }
      }

      .sup_list {
        padding-bottom: 70px;

        .category_title {
          color: #565656;
          font-size: 12px;
          text-align: left;
          line-height: 50px;
          padding-left: 26px;
          padding-right: 20px;

          &:hover {
            font-weight: normal;
            background-color: transparent;
          }

          span {
            font-size: 10px;
          }
        }

        .category_item {
          height: 50px;
          display: flex;
          align-items: center;
          margin-left: 16px;
          justify-content: space-between;

          .icons {
            display: none;

            .icon {
              font-size: 16px;
              margin-right: 10px;

              &:hover {
                color: #409EFF;
              }
            }
          }

          &:hover {
            .icons {
              display: flex;
            }
          }
        }

        .category_item ~ .category_item {
          border-top: 1px solid #f0f0f0;
        }

      }
    }

    .category_sub {
      flex: 1;
      border: 1px solid #EBEEF5;
      overflow: auto;
      margin-left: 6px;
      padding-right: 10px;
      background-color: #ffffff;

      .header {
        display: flex;
        padding: 0 10px;
        align-items: center;
        justify-content: space-between;

        .word {
          color: #999;
          display: flex;
          align-items: center;

          > img {
            width: 16px;
            height: 16px;
            display: block;
            margin-right: 10px;
          }
        }
      }

      .sub_add {
        margin-top: 16px;
        margin-right: 35px;
        margin-bottom: 16px;
      }

      .sub_table {
        border: none;
        border-top: 1px solid #EBEEF5;
      }
    }
  }


  .wap_img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: block;
  }

  .action {
    margin: 0 6px;
  }
</style>

