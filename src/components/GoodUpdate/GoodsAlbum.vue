<template>
  <!-- 相册 -->
  <div class="album" @click.stop>
    <el-card class="album-card">
      <div class="header" slot="header">
        <span>商品相册</span>
        <i class="close" @click="handleClose"></i>
      </div>

      <div class="main">
        <ul class="main-list" v-if="images.length">
          <li class="main-item" v-for="i in images" :key="i.id">
            <img :src="i.url" alt="">
          </li>
        </ul>

        <empty class="album-list" v-else/>

        <div class="upload-wrap">
          <el-input v-model="form.img_desc"></el-input>
          <el-upload
            v-if="images.length"
            action="/admin/admin/upload/image"
            list-type="picture-card"
            name="image"
            :headers="uploadHeader"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {getToken} from '../../utils/auth'
  import Empty from "../Empty";

  export default {
    name: "PhotoAlbum",
    components: {Empty},
    data() {
      return {
        uploadHeader: {
          'x-token': getToken()
        },
        form: {
          img_desc: '',
        },

      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      images: {
        type: Array,
        default() {
          return []
        }
      },

      onPreview: {
        type: Function,
        default: () => {
        }
      },
      onUploadSuccess: {
        type: Function,
        default: () => {
        }
      },

    },
    methods: {
      previewImage(url) {
        this.onPreview(url);
      },
      handleClose() {
        this.$emit('update:visible', false);
      },
      handleRemove() {
      },
      handlePreview(img) {
        this.onPreview(img.img_url);
      },
      handleSuccess(response) {
        const {data} = response;
        const params = Object.assign({}, this.form, {img_url: data.url});
        this.onUploadSuccess(params);
      }
    }
  }
</script>

<style scoped lang="less">

  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
    }
  }

  .album {
    width: 60%;
    margin: 14vh auto 20px;
    position: relative;
    min-width: 600px;

    .album-card {
      height: 100%;

      .header {
        .close {
          width: 18px;
          float: right;
          height: 18px;
          cursor: pointer;
          display: block;
          background: url("../GoodUpdate/close.png") no-repeat center center;
          background-size: contain;
        }

        span {
          overflow: auto;
        }
      }

      .main {
        display: flex;

        .main-list {
          display: flex;
          flex-wrap: wrap;
          padding-right: 20px;

          .main-item {
            width: 33.33%;

            img {
              width: 100%;
            }
          }
        }

        .album-list {
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          min-height: 400px;
          list-style: none;

          .album-item {
            width: 33.33%;
            height: 200px;
            padding: 0 2px;
            margin-bottom: 10px;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 4px;
            }
          }
        }
        .upload-wrap{
          width: 220px;
          border-left: 1px solid #EBEEF5;
          padding-left: 20px;
        }
      }
    }
  }

</style>
