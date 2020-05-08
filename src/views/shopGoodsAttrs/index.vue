<template>
  <div class="attributes-container">

    <div class="attributes_sup">

      <ul class="sup_list scroller">
        <li class="category_title">
          <i class="el-icon-check success bold"></i>开启
          <i class="el-icon-close light bold"></i>关闭
          (参数类别，权重越小越靠前)
        </li>
        <li class="category_item"
            @click="setCurrentCategory(i)"
            :class="{active: category.id === i.id}"
            v-for="i in categories" :key="i.id">
          <span>
            <i v-if="i.enabled" class="el-icon-check success bold"></i>
            <i v-else class="el-icon-close light bold"></i>
            {{i.name}}
          </span>
          <span class="icons">
            <i class="icon el-icon-edit"
               title="编辑"
               @click.stop="setToast('category', i)"></i>
            <i class="icon el-icon-delete light"
               title="删除"
               @click.stop="handleRemove('category', i)"></i>
          </span>
        </li>
      </ul>

      <span class="sup_add">
        <i class="icon el-icon-plus" @click="setToast('category', {})"></i>
      </span>

    </div>

    <!--    <div class="collapse_line"></div>-->
    <div class="attributes_sub">
      <div class="header">
        <div class="word">
          <p>当前分类：</p>
          <span>{{`${category.name}(${category.id})`}}</span>
        </div>
        <el-button class="sub_add" @click="setToast('attribute', {})" type="primary" size="small">新增</el-button>
      </div>
      <el-table class="sub_table"
                stripe
                :data="attributes"
                border
                v-loading="options.loading">
        <el-table-column align="center" prop="id" width="100px" label="ID"></el-table-column>
        <el-table-column align="center" prop="attribute_category_name" label="所属分类"></el-table-column>
        <el-table-column align="center" prop="name" label="参数名(name)"></el-table-column>
        <el-table-column align="center" label="操作" width="120px" fixed="right">
          <template slot-scope="{row}">
            <a class="edit" title="编辑" @click="setToast('attribute', row)"><i class="el-icon-edit"></i></a>
            <a class="delete" title="删除"><i class="el-icon-delete" @click="handleRemove('attribute',row)"></i></a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        @current-change="handlePageChange"
        :page-size="options.size"
        :total="options.totalCount">
      </el-pagination>
    </div>

    <!--  编辑分类  -->
    <v-category :visible.sync="form_category.show"
                :data="form_category.data"
                @submit="handleSubmit"></v-category>

    <!--  编辑参数  -->
    <v-attribute :visible.sync="form_attribute.show"
                 :data="form_attribute.data"
                 :categories="categories"
                 @submit="handleSubmit"></v-attribute>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import SearchBar from '../../components/SearchBar';
  import {VAttribute, VCategory} from './components';

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
        form_category: {
          show: false,
          data: {}
        },

        // 参数
        form_attribute: {
          show: false,
          data: {}
        }
      }
    },
    components: {
      VCategory,
      SearchBar,
      VAttribute
    },
    computed: {
      ...mapState('attributes', {
        options: state => state.attributesOptions,
        category: state => state.currentCategory,
        attributes: state => state.attributes,
        categories: state => state.attributeCategory,
      })
    },
    watch: {
      // 当分类改变的时候
      categories(nVal) {
        this.setCurrentCategory(nVal[0] || {});
      },
      ['category.id'](nVal) {
        this.setAttributeOptions({page: 1});
        this.getAttributes({id: nVal});
      }
    },
    methods: {
      ...mapActions('attributes', [
        'getAttributes',
        'setCurrentCategory',
        'handleAttributeApi',
        'setAttributeOptions',
        'getAttributeCategory',
      ]),

      handlePageChange(page) {
        this.setAttributeOptions({page});
        this.getAttributes({id: this.category.id});
      },

      /**
       * method 设置编辑弹窗的值
       */
      setToast(model, data) {
        this['form_' + model] = {
          show: true,
          data: (data || {})
        }
      },

      /**
       * method 关闭编辑分类弹窗
       */
      clearToast(model) {
        this['form_' + model] = {
          show: false,
          data: {}
        }
      },

      removeOne(payload) {
        const h = this.$createElement;
        const {model, name, id} = payload;
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
          this.handleAttributeApi({
            method: 'remove',
            payload: {id, model}
          }).then(() => {
            this.$notify({
              type: "success",
              message: '删除成功',
            });
            if (model === 'category') this.getAttributeCategory({reset: true});
            else this.getAttributes({id: this.category.id})
          })
        }).catch(err => {
          console.log(err);
        })

      },

      handleRemove(model, i) {
        this.removeOne({
          ...i,
          model
        })
      },

      /**
       * event handler 监听编辑分类弹窗提交
       * @param form
       */
      async handleSubmit(form) {
        let payload = Object.assign({}, form);
        let {text, model} = payload;

        delete payload.text;

        // 修改类别
        await this.handleAttributeApi({method: 'edit', payload});
        this.$notify({
          type: "success",
          message: text + '成功',
        });
        if (model === 'category') { // 新增后，初始化currentCategory
          this.getAttributeCategory({reset: true});
        } else this.getAttributes({id: this.category.id});
        this.clearToast(model);
      },

      handleChangeAttrEnabled(row) {
        this.handleSubmit({
          id: row.id,
          text: '修改',
          model: 'attribute',
        });
      },
    },
    mounted() {
      this.getAttributeCategory();
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

  .attributes-container {
    color: #343434;
    height: 100%;
    display: flex;
    font-size: 14px;
    background-color: #f3f5f7;

    .attributes_sup {
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
          text-align: center;
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

    .attributes_sub {
      flex: 1;
      overflow: auto;
      position: relative;
      margin-left: 6px;
      background-color: #ffffff;
      border: 1px solid #EBEEF5;

      .header {
        display: flex;
        padding: 0 10px;
        align-items: center;
        justify-content: space-between;

        .word {
          color: #999;
          display: flex;
          align-items: center;
        }
      }

      .sub_add {
        float: right;
        margin-top: 16px;
        margin-right: 35px;
        margin-bottom: 16px;
      }

      .sub_table {
        border: none;
        min-height: 100%;
        border-top: 1px solid #EBEEF5;
      }

      .pagination {
        padding: 10px 0;
        text-align: right;
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

