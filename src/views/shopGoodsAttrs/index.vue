<template>
  <div class="attributes-container">

    <div class="container category_wrap br">
      <ul class="category_list">
        <li class="category_item" @click="current_category = index" :class="{active: current_category === index}"
            v-for="(i, index) in attributeCategory" :key="i.id">{{i.name}}
        </li>
      </ul>
    </div>

    <span class="add" @click="handleAddCategory(true)">
      <i class="icon el-icon-plus"></i>
    </span>

    <div class="container category_info">
      <p>分类详情：</p>
      <el-form :rules="rule" ref="form" :model="currentCategory">
        <el-form-item label="开启:"
                      label-width="60px"
                      required>
          <el-switch v-model="currentCategory.cate_enabled"
                     @change="updateCategoryAttribute"></el-switch>
        </el-form-item>
        <el-form-item prop="name"
                      label="名称:"
                      label-width="60px">
          <el-input size="small"
                    clearable
                    placeholder="名称"
                    v-model="currentCategory.name"
                    @change="updateCategoryAttribute"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="collapse_line"></div>

    <div class="container attribute_wrap">
      <el-table class="table" stripe :data="attributes" border v-loading="options.loading">
        <el-table-column align="center" label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column align="center" label="参数名(name)" prop="name"></el-table-column>
        <el-table-column align="center" label="开启状态" width="200px">
          <template slot-scope="{row}">
            <el-switch v-model="row.attr_enabled" @change="updateAttributeSwitch(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属分类">
          <template slot-scope="{row}">{{`${row.attribute_category_name}(${row.attribute_category_id})`}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="{row}">
            <a class="action edit" @click="handleAction(row, 'view')" title="查看">查看</a>
            <a class="action edit" @click="handleAction(row, 'edit')" title="编辑">编辑</a>
            <a class="action delete" @click="handleAction(row, 'delete')" title="删除">删除</a>
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

    <div v-show="" class="container attribute_info">
      <p>参数详情</p>

    </div>

    <!--增加一个参数分类--->
    <el-dialog title="新增参数分类" :visible.sync="showAddAttributeCategory">
      <el-form ref="cate" :model="formAddCate">
        <el-form-item prop="name" label="分类名称:" label-width="85px" required>
          <el-input size="small" ref="input" v-model="formAddCate.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="text-align: right">
            <el-button size="small" type="default" @click="handleAddCategory(false)">取消</el-button>
            <el-button size="small" type="primary" @click="addAttributeCategory">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <attribute-form-card
      @save="updateAttributeSwitch"
      :visible.sync="attribute.visible"
      :category="attributeCategory"
      :attribute="attribute.params"></attribute-form-card>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import SearchBar from '../../components/SearchBar';
  import {AttributeFormCard} from "./components";

  export default {
    data() {
      return {
        current_category: 0,
        currentCategory: {}, // 当前选中的参数分类项
        currentAttribute: {}, // 当前选中的参数
        showAddAttributeCategory: false, // 打开新增参数分类弹窗
        formAddCate: {
          name: '',
        },
        rule: {
          name: [
            {
              required: true,
              message: '请填写一个名称...',
              trigger: 'blur'
            }
          ]
        },

        attribute: {
          visible: false,
          params: {}
        }
      }
    },
    components: {
      AttributeFormCard,
      SearchBar,
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
          this.currentCategory = Object.assign({}, nVal);
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

      notify(message) {
        this.$notify({
          type: 'success',
          title: '提示',
          message: message
        })
      },

      resetPage() {
        this.current_category = 0;
        this.getAttributeCategory({reset: true});
      },

      setAttributeCard(row) {
        this.attribute = {
          visible: true,
          params: row
        }
      },

      /**
       * 新增一项分类
       */
      addAttributeCategory() {
        return new Promise((resolve, reject) => {
          this.$refs.cate.validate(async valid => {
            if (valid) {
              await this.handleAttributeApi({
                method: 'storeCategory',
                payload: this.formAddCate
              });
              this.$refs['cate'].resetFields();
              this.resetPage(); // 重置页面数据
              this.handleAddCategory(false); // 切换到
              this.notify('成功修改一条数据');
            } else reject();
          })
        });
      },
      /**
       * 更新参数分类
       */
      async updateCategoryAttribute() {
        if (this.currentCategory.id) {
          this.$refs.form.validate(async valid => {
            if (valid) {
              const params = Object.assign({}, this.currentCategory);
              params.enabled = params.cate_enabled ? 1 : 0;
              delete params.cate_enabled;
              await this.handleAttributeApi({
                method: 'storeCategory',
                payload: params
              });
              this.getAttributeCategory({reset: true});
              this.notify('成功修改一条数据');
            }
          });
        }
      },

      /**
       * 更新参数
       * @param row
       */
      async updateAttributeSwitch(row) {
        let {id, name, sort_order, attribute_category_id} = row,
          enabled = row.enabled || row.attr_enabled;

        enabled = enabled ? 1 : 0;
        await this.handleAttributeApi({
          method: 'storeAttribute',
          payload: {id, name, enabled, sort_order, attribute_category_id}
        });
        this.getAttributes({id: this.currentCategoryId});
        this.notify('成功修改一条数据');
      },

      /**
       * event handler 开启、关闭新增分类弹窗
       * @param status
       */
      handleAddCategory(status) {
        this.showAddAttributeCategory = status;
      },

      /**
       * event handler 页面切换
       * @param page
       */
      handlePageChange(page) {
        this.setAttributeOptions({page});
        this.getAttributes({id: this.currentCategoryId});
      },

      /**
       * event handler 参数中的actions
       * @param row
       * @param type
       */
      handleAction(row, type) {
        switch (type) {
          case 'view':
            this.setAttributeCard({...row, id: '',});
            break;
          case 'edit':
            this.setAttributeCard(row);
            break;
          case 'delete':
            this.handleAttributeApi({
              method: 'deleteAttribute',
              payload: {
                id: row.id
              }
            }).then(() => {
              this.getAttributes({id: this.currentCategoryId});
              this.notify('成功删除一条数据');
            });
            break;
        }
      },
    },
    mounted() {
      this.resetPage();
    }
  }
</script>

<style scoped>
  >>> .el-table {
    border-top: none;
    border-left: none;
  }

  .category_info >>> .el-form-item {
    margin-bottom: 0;
  }
</style>
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

  .br {
    border-right: 1px solid #e9e9e9;
  }

  .attributes-container {
    color: #343434;
    height: 100%;
    display: flex;
    position: relative;
    font-size: 14px;

    .add {
      left: 100px;
      color: #ffffff;
      width: 40px;
      height: 40px;
      bottom: 10px;
      display: flex;
      position: absolute;
      font-size: 20px;
      align-items: center;
      border-radius: 50%;
      justify-content: center;
      background-color: #409EFF;
    }

    .collapse_line {
      top: 0;
      left: 240px;
      width: 10px;
      height: 100%;
      position: absolute;
    }

    .container {
      height: 100%;
      overflow: auto;

      .edit {
        color: #409EFF;
      }

      .delete {
        color: #d4207c;
      }

      &.category_wrap {
        width: 240px;
        padding: 0;
        position: relative;

        .category_list {
          padding-bottom: 70px;

          .category_item {
            height: 50px;
            display: flex;
            align-items: center;
            margin-left: 16px;
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
      }

      &.category_info {
        width: 240px;
        padding: 0 15px 0 10px;

        p {
          padding-left: 7px;
        }
      }

      &.attribute_wrap {
        flex: 1;
        padding: 0;
        border-left: 1px solid #EBEEF5;

        .table {
          min-height: calc(100% - 50px);

          .action {
            margin: 0 5px;
            font-size: 13px;
          }
        }

        .pagination {
          margin-top: 10px;
        }
      }

    }
  }
</style>

