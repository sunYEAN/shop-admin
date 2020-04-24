<template>
  <div class="attributes-container">

    <div class="container category_wrap br">

      <ul class="category_list">
        <li class="category_item" @click="current_category = index" :class="{active: current_category === index}"
            v-for="(i, index) in attributeCategory" :key="i.id">{{i.name}}
        </li>
        <li v-if="showAddAttributeCategory" class="category_add">
          <el-form ref="cate" :model="formAddCate">
            <el-form-item required>
              <el-input v-model="formAddCate.name" placeholder="请输入名称" @change="addAttributeCategory" @blur="handleAddCategory(false)"></el-input>
            </el-form-item>
          </el-form>
        </li>
      </ul>

      <span v-if="!showAddAttributeCategory" class="add">
        <i class="icon el-icon-plus" @click="handleAddCategory(true)"></i>
      </span>

    </div>
    <div class="container category-info">
      <p>分类详情：</p>
      <el-form :rules="rule" ref="form" :model="currentCategory">
        <el-form-item label="开启:" label-width="60px" required>
          <el-switch v-model="currentCategory.cate_enabled" @change="updateCategoryAttribute"></el-switch>
        </el-form-item>
        <el-form-item label="名称:" label-width="60px" prop="name">
          <el-input clearable v-model="currentCategory.name" size="small" placeholder="名称"
                    @change="updateCategoryAttribute"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="container attribute_wrap">
      <el-table class="table" stripe :data="attributes" border v-loading="options.loading">
        <el-table-column align="center" prop="id" label="ID"></el-table-column>
        <el-table-column align="center" label="所属分类">
          <template slot-scope="{row}">{{`${row.attribute_category_name}(${row.attribute_category_id})`}}</template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="参数名(name)"></el-table-column>
        <el-table-column align="center" label="开启状态">
          <template slot-scope="{row}">
            <el-switch v-model="row.attr_enabled"></el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" circle></el-button>
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
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import SearchBar from '../../components/SearchBar';

  export default {
    data() {
      return {
        current_category: 0,
        currentCategory: {}, // 当前选中的参数分类项
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
        formAddCate: {
          name: '',
        }
      }
    },
    components: {
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
      currentCategoryId () {
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

      handlePageChange(page) {
        this.setAttributeOptions({page});
        this.getAttributes({id: this.currentCategoryId});
      },

      /**
       * 更新参数
       */
      updateCategoryAttribute() {
        if (this.currentCategory.id) {
          this.$refs.form.validate(async valid => {
            if (valid) {
              const params = Object.assign({}, this.currentCategory);
              params.enabled = params.cate_enabled ? 1 : 0;
              delete params.cate_enabled;
              await this.handleAttributeApi({
                method: 'storeAttribute',
                payload: params
              });
              this.getAttributeCategory({reset: true});
            }
          });
        }
      },

      addAttributeCategory () {
        this.$refs.cate.validate(async valid => {
          if (valid) {
            await this.handleAttributeApi({
              method: 'storeAttribute',
              payload: this.formAddCate
            });
            // this.
            this.getAttributeCategory({reset: true});
          }
        })
      },

      // handleDeleteGood(good) {
      //   const h = this.$createElement;
      //   this.$msgbox({
      //     title: '提示',
      //     message: h('p', null, [
      //       h('span', null, '此操作将删除商品'),
      //       h('span', {style: 'color: #ca2230'}, `${good.name}`)
      //     ]),
      //     showCancelButton: true,
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //   }).then(() => {
      //     return this.handleApiMethods({
      //       method: 'deleteGood',
      //       payload: {
      //         id: good.id
      //       }
      //     })
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     });
      //     return this.getGoods();
      //   }).catch(err => {
      //     this.$message({
      //       type: 'success',
      //       message: '取消成功'
      //     });
      //   });
      // },

      handleAddCategory (status) {
        this.showAddAttributeCategory = status;
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
  >>> .el-table{
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
    font-size: 14px;

    .container {
      height: 100%;
      overflow: auto;

      &.category_wrap {
        width: 200px;
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
          .category_add{
            display: flex;
            border-top: 1px solid #f0f0f0;
            align-items: center;
            justify-content: center;
            background-color: #409EFF;
          }

        }

        .add{
          left: 50%;
          border: none!important;
          bottom: 10px;
          margin: 0;
          padding: 0;
          position: absolute;
          &:hover{
            background-color: transparent;
            .icon{
              box-shadow: none;
            }
          }
          .icon{
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
            box-shadow: 0 -4px 16px rgba(0,0,0,0.2);
          }
        }
      }

      &.category-info {
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
        .table{
          min-height: calc(100% - 50px);
        }
        .pagination{
          margin-top: 10px;
        }
      }
    }
  }
</style>

