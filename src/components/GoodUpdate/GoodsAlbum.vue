<template>
  <!-- 相册 -->
  <div class="album" @click.stop>
    <el-card class="album-card">
      <div class="header" slot="header">
        <span>商品相册</span>
        <i class="close" @click="handleClose"></i>
      </div>

      <!--  内容  -->
      <div class="main">
        <draggable @change="handleSortChange" v-if="gallery.length" class="main-list" v-model="gallery">
          <div class="main-item" v-for="i in gallery" :key="i.id">
            <img :src="i.img_url" :alt="i.img_desc" @click="handlePreview(i)">
          </div>
        </draggable>

        <empty class="album-list" v-else/>

        <div class="upload-wrap">
          <el-form :model="form" :rules="rule" ref="form">
            <el-form-item prop="img_url">
              <el-upload
                action="/admin/admin/upload/image"
                name="image"
                :headers="uploadHeader"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :show-file-list="false">
                <div v-if="!form.img_url" class="mt">+</div>
                <div v-else class="bt">
                  <img :src="form.img_url" class="img" alt="">
                  <span class="success">
                <i class="el-icon-check"></i>
              </span>
                </div>
              </el-upload>
            </el-form-item>

            <el-form-item prop="img_desc">
              <el-input size="small" v-model="form.img_desc" placeholder="图片描述"></el-input>
            </el-form-item>
          </el-form>

          <el-button class="submit" size="small" type="primary" @click="submit">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
    import Empty from "../Empty";
    import {getToken} from '../../utils/auth'
    import {addGallery, sortGallery} from '../../api/goods';
    import draggable from 'vuedraggable';

    export default {
        name: "PhotoAlbum",
        components: {Empty, draggable},
        data() {
            return {
                uploadHeader: {
                    'x-token': getToken()
                },
                gallery: [],
                form: {
                    img_desc: '',
                    img_url: ''
                },
                rule: {
                    img_url: [
                        {required: true, message: '请先上传一张图片', trigger: 'change'}
                    ]
                }
            }
        },
        props: {
            goodId: {
                type: Number,
                default: 0
            },
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
        },
        watch: {
            images: {
                handler (nVal) {
                    this.gallery = nVal || [];
                },
                immediate: true
            }
        },
        methods: {
            handleClose() {
                this.$emit('update:visible', false);
            },
            handleRemove() {
            },
            handlePreview(img) {
                this.$preview(img.img_url);
            },
            handleSuccess(response) {
                const {data} = response;
                this.form.img_url = data.url;
            },

            handleSortChange(res) {
                console.log(res)
            },

            /**
             * method
             */
            submit() {
                const params = Object.assign({}, this.form, {
                    goods_id: this.goodId
                });
                const form = this.$refs.form;

                form.validate(valid => {
                    if (valid) {
                        addGallery(params).then(() => {
                            this.$message({
                                type: 'success',
                                message: '上传成功'
                            });
                            form.resetFields();

                            this.$emit('update');
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>
  >>> .el-upload {
    width: 100%;
    margin: 0 auto;
  }
  >>> .el-form-item__content{
    line-height: normal;
  }
</style>
<style scoped lang="less">

  ul {
    margin: 0;
    padding: 0;

    li {
      padding: 4px;
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
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          padding-right: 20px;

          .main-item {
            width: 33.33%;
            height: 0;
            position: relative;
            padding-bottom: 33.33%;

            img {
              top: 4px;
              left: 4px;
              width: calc(100% - 8px);
              height: calc(100% - 8px);
              display: block;
              position: absolute;
              border-radius: 4px;
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

        .upload-wrap {
          width: 200px;
          flex-shrink: 0;
          border-left: 1px solid #EBEEF5;
          padding-left: 20px;
          position: relative;

          .submit {
            width: 100%;
          }

          .mt {
            width: 100%;
            height: 180px;
            border: 1px solid #EBEEF5;
            display: flex;
            font-size: 20px;
            align-items: center;
            justify-content: center;
          }

          .bt {
            width: 100%;
            height: 180px;
            overflow: hidden;
            position: relative;

            > .img {
              width: 100%;
              height: 100%;
              border: 1px solid #EBEEF5;
              display: block;
              object-fit: cover;
            }

            > .success {
              top: -4px;
              right: -18px;
              width: 50px;
              color: #fff;
              height: 20px;
              display: block;
              position: absolute;
              transform: rotate(45deg);
              background: #4ce78e;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

              i {
                font-size: 10px;
                transform: rotate(-45deg);
                margin-top: 7px;
              }
            }
          }
        }
      }
    }
  }

</style>
