<template>
  <div class="good-update container">
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
              <div @click.stop v-if="good.list_pic_url" class="wrap">
                <img :src="good.list_pic_url" class="avatar" alt=""/>
                <i class="zoom el-icon-zoom-in" @click="handlePreviewImg({url: good.list_pic_url})"></i>
                <i class="delete el-icon-delete"></i>
                <span class="check"><i class="el-icon-check"></i></span>
              </div>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

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

          <div class="desc">
            <el-form-item>
              <el-input class="name"
                        clearable
                        v-model="good.name"
                        placeholder="商品名称"></el-input>
            </el-form-item>

            <el-form-item>
              <el-input class="brief"
                        clearable
                        v-model="good.goods_brief"
                        type="textarea"
                        placeholder="商品简介"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>

      <el-form-item label="商品相册：">
        <a @click="handleMethod('album')">查看相册</a>
      </el-form-item>

      <el-form-item label="商品规格：">
        <a @click="handleMethod('skus')">查看规格</a>
      </el-form-item>

      <el-form-item label="商品参数：">
        <a @click="handleMethod('attrs')">查看参数</a>
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
    <good-album :good-id="good.id"
                :on-upload-success="handleUploadSuccess"
                :visible.sync="showAlbum"
                :images="good.gallery" @update="getGoodInfo"/>

    <!-- 商品参数 -->
    <good-attr :good-id="good.id"
               :visible.sync="showAttrs"
               :attributes="good.attributes"></good-attr>
  </div>
</template>

<script>
  import {getToken} from '../../utils/auth';
  import {mapState, mapActions} from 'vuex';
  import {GoodAlbum, GoodAttr} from '../../components/GoodUpdate';

  export default {
    name: "GoodUpdate",
    components: {
      GoodAlbum,
      GoodAttr
    },
    data() {
      return {
        uploadHeader: {
          'x-token': getToken()
        },
        showAlbum: false,
        showAttrs: false,
        good: {},
      }
    },
    computed: {
      ...mapState('goods', {
        catalogs: state => state.catalogs,
      }),
      filterLevelCatalogs() {
        return this.catalogs.filter(item => item.level === 2);
      }
    },
    methods: {
      ...mapActions('goods', [
        'getGoodsCatalogs',
        'handleApiMethods',
      ]),

      handleMethod(type) {
        switch (type) {
          case 'album':
            this.showAlbum = true;
            break;
          case 'attrs':
            this.showAttrs = true;
            break;
        }
      },

      getGoodDetail(id) {
        return this.handleApiMethods({
          method: 'getGoodById',
          payload: {
            id
          }
        })
      },
      // 相册上传成功
      handleUploadSuccess(data) {
        this.handleApiMethods({
          method: 'addGallery',
          payload: {}
        })
      },


      getGoodInfo() {
        const {id} = this.$route.query;
        this.getGoodDetail(id).then(res => {
          this.good = res.data;
        })
      },
    },

    created() {
      this.getGoodInfo();
      this.getGoodsCatalogs();
    }
  }
</script>

<style scoped>
  .good-update >>> .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
  }

  .good-update .number >>> .el-input {
    width: 200px;
  }

  .good-update .info >>> .el-form-item {
    margin-bottom: 0px;
  }

  .good-update .desc >>> .el-form-item {
    margin-bottom: 6px;
  }

  .good-update .number >>> .el-form-item {
    margin-bottom: 6px;
  }

  .good-update >>> .el-dialog {
    min-width: 825px;
  }

  .good-update >>> .el-textarea__inner {
    min-height: 110px !important;
  }

  .good-update >>> .el-input-number--small {
    width: 200px;
  }
</style>
<style scoped lang="less">
  a {
    color: #409EFF;
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

        .number {
          margin-left: 20px;
        }

        .desc {
          flex: 1;
          display: flex;
          overflow: hidden;
          margin-left: 20px;
          flex-direction: column;

          .name {
            font-size: 14px;
            font-weight: bold;
          }

          .brief {
            flex: 1;
            overflow: auto;
          }
        }
      }
    }
  }

</style>
