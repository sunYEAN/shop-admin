<template>
  <el-upload
    class="upload"
    name="image"
    action="/admin/admin/upload/image"
    :headers="uploadHeader"
    :show-file-list="false"
    :on-success="handleUploaded">

    <template v-if="url">
      <img :src="url" class="avatar" alt=""/>
      <span class="check">
        <i class="el-icon-check"></i>
      </span>
      <div @click.stop class="wrap">
        <i class="el-icon-zoom-in" @click="$preview(url)"></i>
        <i class="el-icon-delete" @click="remove"></i>
      </div>
    </template>

    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
    import {getToken} from '../../utils/auth';

    export default {
        name: "UploadImage",
        props: {
            url: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: 'image'
            }
        },
        data() {
            return {
                uploadHeader: {
                    'x-token': getToken()
                }
            }
        },
        methods: {
            /**
             * 上传成功之后
             */
            handleUploaded (response) {
                this.$emit('update:url', response.data.url)
            },

            remove () {
                this.$emit('update:url', '')
            }
        }
    }
</script>

<style scoped lang="less">
  .upload{
    width: 100px;
    height: 100px;
    position: relative;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }
  .wrap {
    color: #ffffff;
    width: 100%;
    height: 100%;
    opacity: 0;
    display: flex;
    overflow: hidden;
    position: absolute;
    transition: all 0.1s linear;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
    &:hover{
      opacity: 1;
    }
    i{
      margin: 0 4px;
      &:hover{
        color: #409EFF;
      }
    }
  }
  .check{
    top: 0px;
    right: -15px;
    color: #ffffff;
    width: 40px;
    height: 16px;
    display: block;
    z-index: 10;
    position: absolute;
    font-size: 12px;
    transform: rotate(45deg);
    line-height: 20px;
    background-color: #00ff80;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    .el-icon-check{
      transform: rotate(-45deg);
    }
  }
</style>
