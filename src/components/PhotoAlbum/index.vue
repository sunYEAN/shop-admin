<template>
  <!-- 相册 -->
  <transition name="album">
    <div v-if="visible" class="photo-album" @click="handleClose">
      <div class="album" @click.stop>
        <el-button class="album-add" size="small" type="primary">新增</el-button>
        <el-card class="album-card">
          <div class="header" slot="header">
            <span>商品相册</span>
            <i class="close" @click="handleClose"></i>
          </div>
          <ul class="album-list" v-if="images.length">
            <li class="album-item" v-for="img in images" :key="img.id">
              <img :src="img.img_url" alt="" @click="handlePreview(img)">
            </li>
          </ul>

          <empty class="album-list" v-else/>
        </el-card>
      </div>
    </div>
  </transition>
</template>

<script>

  import Empty from "../Empty/index";
  export default {
    name: "PhotoAlbum",
    components: {Empty},
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      images: {
        type: Array,
        default () {
          return []
        }
      },
      onPreview: {
        type: Function,
        default: () => {}
      }
    },
    methods: {
      previewImage (url) {
        this.onPreview(url);
      },
      handleClose () {
        this.$emit('update:visible', false);
      },
      handlePreview (img) {
        this.preview(img.img_url);
      }
    }
  }
</script>

<style scoped lang="less">
  .album-enter-active,.album-leave-active{
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }
  .album-enter,.album-leave-to{
    opacity: 0;
  }
  .photo-album{
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2500;
    overflow: auto;
    position: fixed;
    background-color: rgba(0,0,0,0.5);
    .album{
      width: 40%;
      margin: 14vh auto 20px;
      position: relative;
      min-width: 600px;
      .album-card{
        height: 100%;
        .header{
          .close{
            width: 18px;
            float: right;
            height: 18px;
            cursor: pointer;
            display: block;
            background: url("./close.png")no-repeat center center;
            background-size: contain;
          }
          span{
            overflow: auto;
          }
        }
        .album-list{
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          min-height: 400px;
          list-style: none;
          .album-item{
            width: 33.33%;
            height: 200px;
            padding: 0 2px;
            margin-bottom: 10px;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 4px;
            }
          }
        }
      }
      .album-add{
        top: 55px;
        right: 0;
        position: absolute;
        transform: translateX(110%);
      }
    }
  }

</style>
