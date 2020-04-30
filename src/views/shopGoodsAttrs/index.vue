<template>
  <div class="attributes-container">

    <div class="container category_wrap br">

      <ul class="category_list">
        <li class="category_title">
          <i class="el-icon-check success bold"></i>开启
          <i class="el-icon-close light bold"></i>关闭
          (参数类别)
        </li>
        <li class="category_item"
            @click="current_category = index"
            :class="{active: current_category === index}"
            v-for="(i, index) in attributeCategory" :key="i.id">
          <span>
            <i v-if="i.cate_enabled" class="el-icon-check success bold"></i>
            <i v-else class="el-icon-close light bold"></i>
            {{i.name}}</span>
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

      <span v-if="!showAddAttributeCategory" class="add">
        <i class="icon el-icon-plus" @click="setToast('category', {})"></i>
      </span>

    </div>

<!--    <div class="collapse_line"></div>-->
    <div class="container attribute_wrap">
      <el-table class="table"
                height="300"
                stripe
                :data="attributes" border v-loading="options.loading">
        <el-table-column align="center" prop="id"   width="100px" label="ID"></el-table-column>
        <el-table-column align="center" prop="name"               label="参数名(name)"></el-table-column>
        <el-table-column align="center"             width="200px" label="开启状态">
          <template slot-scope="{row}">
            <el-switch v-model="row.attr_enabled" @change="handleChangeAttrEnabled(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属分类">
          <template slot-scope="{row}">{{`${row.attribute_category_name}(${row.attribute_category_id})`}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
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
               :categories="attributeCategory"
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
                current_category: 0,
                showAddAttributeCategory: false, // 打开新增参数分类弹窗
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
                attributes: state => state.attributes,
                attributeCategory: state => state.attributeCategory,
            }),
            computedCurrentCategory() {
                return this.attributeCategory[this.current_category] || {};
            },
            currentCategoryId() {
                return this.computedCurrentCategory.id || '';
            }
        },
        watch: {
            computedCurrentCategory: {
                handler(nVal) {
                    this.setAttributeOptions({page: 1});
                    this.getAttributes({id: nVal.id});
                }
            }
        },
        methods: {
            ...mapActions('attributes', [
                'getAttributes',
                'handleAttributeApi',
                'setAttributeOptions',
                'getAttributeCategory',
            ]),

            handlePageChange(page) {
                this.setAttributeOptions({page});
                this.getAttributes({id: this.currentCategoryId});
            },

            /**
             * method 设置编辑弹窗的值
             */
            setToast (model, data) {
                console.log(model, data)
                this['form_' + model] = {
                    show: true,
                    data: (data || {})
                }
            },

            /**
             * method 关闭编辑分类弹窗
             */
            clearToast (model) {
                this['form_' + model] = {
                    show: false,
                    data: {}
                }
            },

            handleRemove (model, i) {
                this.removeOne({
                    ...i,
                    model
                })
            },

            removeOne (payload) {
                const h = this.$createElement;
                const {model, name, id} = payload;
                console.log(id, model)
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
                        else this.getAttributes({id: this.currentCategoryId})
                    })
                }).catch(err => {
                    console.log(err);
                })

            },


            /**
             * event handler 监听编辑分类弹窗提交
             * @param form
             */
            handleSubmit (form) {
                let payload = Object.assign({}, form),
                    {text, model} = payload;

                delete payload.text;

                this.handleAttributeApi({
                    method: 'edit',
                    payload
                }).then(() => {
                    this.$notify({
                        type: "success",
                        message: text + '成功',
                    });

                    this.clearToast(model);
                    if (model === 'category') this.getAttributeCategory({reset: true});
                    else this.getAttributes({id: this.currentCategoryId});
                })
            },


            handleChangeAttrEnabled (row) {
                this.handleSubmit({
                    id: row.id,
                    text: '修改',
                    model: 'attribute',
                    enabled: row.attr_enabled ? 1 : 0
                });
            }

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
    border-left: none;
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

  .br {
    border-right: 1px solid #e9e9e9;
  }

  .attributes-container {
    color: #343434;
    height: 100%;
    display: flex;
    font-size: 14px;

    .collapse_line{
      top: 0;
      left: 240px;
      width: 10px;
      height: 100%;
      position: absolute;
      box-shadow: 10px 0 0px rgba(0,0,0,0.2);
      background: linear-gradient(rgba(0,0,0,0), #409EFF, rgba(0,0,0,0));
    }

    .container {
      height: 100%;
      overflow: auto;

      .edit{
        color: #409EFF;
      }
      .delete{
        color: #d40f33;
      }

      &.category_wrap {
        width: 240px;
        padding: 0;
        position: relative;
        border-right: 8px solid #f3f5f7;

        .category_list {
          padding-bottom: 70px;

          .category_title{
            color: #565656;
            font-size: 12px;
            text-align: center;
            line-height: 50px;
            padding-left: 26px;
            padding-right: 20px;
            &:hover{
              font-weight: normal;
              background-color: transparent;
            }
            span{
              font-size: 10px;
            }
          }

          .category_item {
            height: 50px;
            display: flex;
            align-items: center;
            margin-left: 16px;
            justify-content: space-between;
            .icons{
              display: none;
              .icon{
                font-size: 16px;
                margin-right: 10px;
                &:hover{
                  color: #409EFF;
                }
              }
            }
            &:hover{
              .icons{
                display: flex;
              }
            }
          }

          .category_item ~ .category_item {
            border-top: 1px solid #f0f0f0;
          }

          .category_add {
            display: flex;
            border-top: 1px solid #f0f0f0;
            align-items: center;
            justify-content: center;
            background-color: #409EFF;
          }

        }

        .add {
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
      }

      &.attribute_wrap {
        flex: 1;
        padding: 0;
        border-left: 1px solid #EBEEF5;
        background-color: #f3f5f7;

        .table {
          min-height: calc(100% - 50px);
        }

        .pagination {
          margin-top: 10px;
        }
      }

      &.attribute_info {
        width: 400px;
      }
    }
  }
</style>

