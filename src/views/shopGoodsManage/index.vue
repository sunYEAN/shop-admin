<template>
  <div class="app-container">

    <search-bar :catalogs="filterLevelCatalogs" @onSearchChange="handleSearchChange">
      <el-button type="primary" size="small" @click="handleAddGood">新增</el-button>
    </search-bar>

    <el-table :data="goods" border v-loading="options.loading">

      <el-table-column align="center" label="ID" prop="id"/>

      <el-table-column align="center" label="商品详情" width="360">
        <template slot-scope="{row}">
          <el-card :body-style="{padding: '10px'}">
            <div class="card_container">
              <img alt=""
                   class="card_cover"
                   :src="row.primary_pic_url"
                   @click="handlePreviewImg({url: row.primary_pic_url})">
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
            :value="row.on_sale"
            style="display: block;"
            @change="(status) => {handleStatusChange(row, status)}"
            active-color="#13ce66"
            inactive-color="#d0d0d0">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button size="small" @click="showUpdateCard(row)" type="primary">编辑</el-button>
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


    <template v-if="visible_update">
      <el-dialog :visible="visible_update" :before-close="hideUpdateCard">
        <template slot="title">
          <span>编辑<span class="light">{{good.name}}</span></span>
        </template>

        <el-form ref="form" class="good-form" :model="good" size="small">
          <div class="good-info">
            <h3>商品详情：</h3>
            <div class="info">

              <el-form-item>
                <el-upload
                  class="avatar-uploader"
                  name="image"
                  action="/admin/admin/upload/image"
                  list-type="picture-card"
                  :headers="uploadHeader"
                  :show-file-list="false">
                  <div @click.stop v-if="good.primary_pic_url" class="wrap">
                    <img :src="good.primary_pic_url" class="avatar" alt=""/>
                    <i class="zoom el-icon-zoom-in" @click="handlePreviewImg({url: good.primary_pic_url})"></i>
                    <i class="delete el-icon-delete"></i>
                    <span class="check"><i class="el-icon-check"></i></span>
                  </div>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

              <div class="desc">
                <el-form-item>
                  <el-input class="name" clearable v-model="good.name" placeholder="商品名称"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-input class="brief" clearable v-model="good.goods_brief" type="textarea"
                            placeholder="商品简介"></el-input>
                </el-form-item>
              </div>

              <div class="number">
                <el-form-item class="form-item">
                  库存：
                  <el-input-number :min="1" v-model="good.goods_number"></el-input-number>
                </el-form-item>
                <el-form-item class="form-item">
                  销量：
                  <el-input-number v-model="good.sell_volume"></el-input-number>
                </el-form-item>
                <el-form-item class="form-item">
                  价格：
                  <el-input-number :min="1" v-model="good.retail_price" :precision="2"></el-input-number>
                </el-form-item>
                <el-form-item class="unit form-item">
                  单位：
                  <el-input v-model="good.goods_unit"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>

          <el-form-item label="商品相册：">
            <a>查看相册</a>
          </el-form-item>

          <el-form-item label="商品规格：">
            <a>查看规格</a>
          </el-form-item>

          <el-form-item label="商品参数：">
            <a>查看参数</a>
          </el-form-item>

          <el-form-item label="商品详情：">
            <a>查看详情</a>
          </el-form-item>

          <el-form-item label="商品分类：">
            <el-select v-model="good.category_id">
              <el-option v-for="cate in filterLevelCatalogs" :key="cate.id" :value="cate.id"
                         :label="cate.name"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="新品标志：">
            <el-radio v-model="good.is_new" :label="0">否</el-radio>
            <el-radio v-model="good.is_new" :label="1">是</el-radio>
          </el-form-item>

          <el-form-item label="热门标志：">
            <el-radio v-model="good.is_hot" :label="0">否</el-radio>
            <el-radio v-model="good.is_hot" :label="1">是</el-radio>
          </el-form-item>

          <el-form-item label="是否在售：">
            <el-radio v-model="good.is_on_sale" :label="0">否</el-radio>
            <el-radio v-model="good.is_on_sale" :label="1">是</el-radio>
          </el-form-item>


        </el-form>
      </el-dialog>
    </template>

    <preview-image ref="view"/>
  </div>
</template>

<script>
    import {getToken} from '../../utils/auth';
    import {mapActions, mapState} from 'vuex';
    import SearchBar from '../../components/SearchBar';
    import PreviewImage from '../../components/PreviewImage';

    export default {
        data() {
            return {
                uploadHeader: {
                    'x-token': getToken()
                },
                visible_update: false,
                good: {},
            }
        },
        components: {
            PreviewImage,
            SearchBar
        },
        computed: {
            ...mapState('goods', {
                goods: state => state.goods,
                catalogs: state => state.catalogs,
                options: state => state.goodsOptions,
            }),
            filterLevelCatalogs() {
                return this.catalogs.filter(item => item.level == 2);
            }
        },
        methods: {
            ...mapActions('goods', [
                'getGoods',
                'handleApiMethods',
                'setGoodsOptions',
                'getGoodsCatalogs',
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
            handleAddGood() {
                this.$router.push('edit');
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
                }).then(action => {
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

            handlePreviewImg(file) {
                console.log(this.$refs)
                this.$refs.view.preview(file.url);
            },
            handleRemove() {},

            handleSuccess (type, res, file) {
                switch (type) {
                    case 'b': // banner
                }
            },

            showUpdateCard(good) {
                console.log(good.id)
                this.handleApiMethods({
                    method: 'getGoodById',
                    payload: {
                        id: good.id
                    }
                }).then(res => {
                    res.data.gallery.forEach(banner => {
                        banner.url = banner.img_url;
                        banner.name = banner.img_desc;
                    });
                    this.good = res.data;
                    this.visible_update = true;
                });
            },
            hideUpdateCard() {
                this.good = {};
                this.visible_update = false;
            }

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
</style>
<style scoped lang="less">
  a{
    color: #409EFF;
  }
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

    .app-container {
      .pagination {
        margin-top: 16px;
      }
    }
  }

  .wrap {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    position: relative;
    align-items: center;
    justify-content: center;

    > .check {
      top: 0;
      right: -24px;
      width: 50px;
      height: 20px;
      display: flex;
      position: absolute;
      transform: rotate(45deg);
      align-items: flex-end;
      justify-content: center;
      background-color: #13ce66;
      transform-origin: center top;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

      > i {
        color: #fff;
        font-size: 10px;
        transform: rotate(-45deg);
      }
    }

    .avatar {
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      display: block;
    }

    .delete, .zoom {
      color: #fff;
      right: 10px;
      bottom: 10px;
      z-index: 100;
      position: absolute;
      font-size: 16px;
    }

    .delete, .zoom {
      display: none;
    }

    .zoom {
      right: 36px;
    }

    &:before {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      content: "";
      position: absolute;
      transition: all 0.2s ease-in-out;
    }

    &:hover {
      &:before {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .zoom, .delete {
        display: block;
      }
    }


  }

  .good-form {
    .good-info {
      display: flex;
      h3 {
        width: 80px;
        font-size: 14px;
      }

      .info {
        flex: 1;
        display: flex;
        padding: 16px;
        border-radius: 4px;
        margin-bottom: 20px;
        background-color: #f9f9f9;

        .desc {
          flex: 1;
          display: flex;
          overflow: hidden;
          margin-left: 20px;
          margin-right: 20px;
          flex-direction: column;

          .name {
            font-size: 14px;
            font-weight: bold;
          }

          .brief {
            flex: 1;
            overflow: auto;
          }

          .number {
            display: flex;
            padding: 0 15px;
            margin-top: auto;

            .form-item {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }

</style>

