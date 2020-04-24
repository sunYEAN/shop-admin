<template>
  <div class="attributes-container">

    <div class="container category_wrap br">
      <ul class="category_list">
        <li class="category_item" @click="current_category = index" :class="{active: current_category === index}"
            v-for="(i, index) in attributeCategory" :key="i.id">{{i.name}}
        </li>
      </ul>
    </div>
    <div class="container category-info">
      <p>分类详情：</p>
      <el-form :rules="rule" ref="form" :model="currentCategory">
        <el-form-item label="开启:" label-width="60px" required>
          <el-switch v-model="currentCategory.enabled" @change="updateCategoryAttribute"></el-switch>
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
            <el-switch v-model="row.attribute_category_enabled"></el-switch>
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
        currentCategory: {},
        rule: {
          name: [
            {
              required: true,
              message: '请填写一个名称...',
              trigger: 'change'
            }
          ]
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
              const params = this.currentCategory;
              params.enabled = params.enabled ? 1 : 0;
              await this.handleAttributeApi({
                method: 'updateAttribute',
                payload: params
              });
              this.getAttributeCategory({reset: true});
            }
          });
        }
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
      box-sizing: border-box;

      &.active {
        color: #409EFF;
        font-size: 16px;
        font-weight: bold;
        background-color: #f3f5f7;
      }

      &:hover {
        color: #409EFF;
        font-size: 16px;
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

        .category_list {
          .category_item {
            padding: 16px 20px;
          }

          .category_item ~ .category_item {
            border-top: 1px solid #f0f0f0;
          }
        }
      }

      &.category-info {
        width: 240px;
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

