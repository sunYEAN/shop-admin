<template>
  <div class="app-container">

    <search-bar :catalogs="filterLevelCatalogs" @onSearchChange="handleSearchChange">
      <el-button type="primary" size="small" @click="navigateTo('edit')">新增</el-button>
    </search-bar>

    <el-table class="table" :data="goods" border v-loading="options.loading">

      <el-table-column align="center" label="ID" prop="id"/>

      <el-table-column align="center" label="商品详情" width="360">
        <template slot-scope="{row}">
          <el-card :body-style="{padding: '10px'}">
            <div class="card_container">
              <img alt=""
                   class="card_cover"
                   :src="row.list_pic_url"
                   @click="$preview(row.list_pic_url)">
              <div class="card_info">
                <p class="p lines line1 t">{{row.name}}</p>
                <p class="p lines line1 d">{{row.goods_brief}}</p>
                <p class="p c">
                  <a>库存: <span>{{row.goods_number}} </span>件</a>
                  <a>卖出: <span>{{row.sell_volume}} </span>件</a>
                  <span>￥{{row.retail_price}}</span>
                </p>
              </div>
            </div>
          </el-card>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类别">
        <template slot-scope="{row}">
          <el-tag type="primary">{{row.cate_info.name}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="热门">
        <template slot="header">
          <span class="icon sup">热门</span>
        </template>
        <template slot-scope="{row}">
          <img class="hot" v-if="row.is_hot" src="../../icons/hot.png" alt="">
        </template>
      </el-table-column>

      <el-table-column align="center" label="新品推荐">
        <template slot-scope="{row}">
          <el-tag v-if="row.is_new" type="success">推荐</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上架">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.on_sale"
            style="display: block;"
            @change="updateGood(row)"
            active-color="#13ce66"
            inactive-color="#d0d0d0">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button size="small" @click="navigateTo('update?id=' + row.id)" type="primary">编辑</el-button>
          <el-button size="small" @click="handleDeleteGood(row)">删除</el-button>
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
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import SearchBar from '../../components/SearchBar';

    export default {
        data() {
            return {}
        },
        components: {
            SearchBar,

        },
        computed: {
            ...mapState('goods', {
                goods: state => state.goods,
                catalogs: state => state.catalogs,
                options: state => state.goodsOptions,
            }),
            filterLevelCatalogs() {
                return this.catalogs.filter(item => item.level === 2);
            }
        },
        methods: {
            ...mapActions('goods', [
                'getGoods',
                'handleApiMethods',
                'setGoodsOptions',
                'getGoodsCatalogs'
            ]),

            handleStatusChange(item, status) {
                item.on_sale = status;
            },

            handlePageChange(page) {
                this.setGoodsOptions({page});
                this.getGoods();
            },

            /**
             * event handler 搜索条件改变
             */
            handleSearchChange(form) {
                this.setGoodsOptions({
                    page: 1,
                    name: form.name,
                    cate: form.cate,
                    onSale: form.onSale
                });
                this.getGoods();
            },

            /**
             * event handler 新增商品
             */
            navigateTo(path, params) {
                this.$router.push({path, params});
            },

            /**
             * event handler 删除一个商品
             * @param good
             */
            handleDeleteGood(good) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '此操作将删除商品'),
                        h('span', {style: 'color: #ca2230'}, `${good.name}`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    return this.handleApiMethods({
                        method: 'deleteGood',
                        payload: {
                            id: good.id
                        }
                    })
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    return this.getGoods();
                }).catch(err => {
                    this.$message({
                        type: 'success',
                        message: '取消成功'
                    });
                });
            },

            updateGood(row) {
                this.handleApiMethods({
                    method: 'addGood',
                    payload: {
                        id: row.id,
                        is_on_sale: row.on_sale ? 1 : 0
                    }
                }).then(res => {
                    this.$notify({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.getGoods({reset: true});
                }).catch(err => {
                    this.$message({
                        type: 'danger',
                        message: err.message
                    })
                })
            },
        },
        mounted() {
            this.getGoods();
            this.getGoodsCatalogs();
        }
    }
</script>

<style scoped>
  .app-container >>> .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
  }

  .app-container .number >>> .el-input {
    width: 130px;
  }

  .app-container .info >>> .el-form-item {
    margin-bottom: 0px;
  }

  .app-container .desc >>> .el-form-item {
    margin-bottom: 6px;
  }

  .app-container .number >>> .el-form-item {
    margin-bottom: 6px;
  }

  .app-container >>> .el-dialog {
    min-width: 825px;
  }

  .app-container >>> .el-textarea__inner {
    min-height: 110px !important;
  }
</style>
<style scoped lang="less">

  .line {
    text-align: center;
  }

  .icon {
    color: #ca2230;
    display: inline-block;
    position: relative;

    &:after {
      top: 42%;
      left: 26px;
      width: 20px;
      height: 20px;
      display: block;
      content: "";
      z-index: 10;
      position: absolute;
      transform: translateY(-50%);
      background: url('../../icons/hot.png') no-repeat center center;
      background-size: contain;
    }
  }

  .card_container {
    display: flex;

    .card_cover {
      width: 90px;
      height: 90px;
      display: block;
      object-fit: cover;
    }

    .card_info {
      display: flex;
      flex-direction: column;

      .p {
        width: 100%;
        margin: 0;
        text-align: left;
        box-sizing: border-box;
        padding-left: 10px;

        &.t {
          font-size: 15px;
        }

        &.d {
          color: #999;
          font-size: 12px;
        }

        &.c {
          color: #999;
          display: flex;
          font-size: 12px;
          margin-top: auto;
          justify-content: flex-start;

          span {
            color: #de1e43;
          }

          a {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .app-container {
    position: relative;
    padding-bottom: 60px;
    .pagination {
      left: 20px;
      width: calc(100% - 40px);
      bottom: 15px;
      position: absolute;
      text-align: right;
    }
  }

</style>

