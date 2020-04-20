<template>
  <div class="container">
    <el-steps :active="step" finish-status="success" simple>
      <el-step title="基本信息"></el-step>
      <el-step title="商品详情"></el-step>
      <el-step title="上架信息"></el-step>
    </el-steps>

    <el-form v-show="step === 0"
             ref="step0"
             class="form"
             label-width="130px"
             :model="step0"
             :rules="rule0">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="step0.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品简介" prop="goods_brief">
        <el-input v-model="step0.goods_brief" placeholder="请输入商品简介" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="category_id">
        <el-select v-model="step0.category_id" placeholder="请选择一项分类">
          <el-option :value="cate.id" :label="cate.name" v-for="cate in subCatalogs" :key="cate.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品缩略图" prop="list_pic_url">
        <el-upload
          class="avatar-uploader"
          name="image"
          action="/admin/admin/upload/image"
          list-type="picture-card"
          :headers="uploadHeader"
          :show-file-list="false"
          :on-success="handleSuccess">
          <div @click.stop v-if="step0.list_pic_url" class="wrap">
            <img :src="step0.list_pic_url" class="avatar" alt=""/>
            <i class="zoom el-icon-zoom-in" @click.stop="handlePreviewImg({url: step0.list_pic_url})"></i>
            <i class="delete el-icon-delete" @click.stop="removeMiniAvatar"></i>
            <span class="check"><i class="el-icon-check"></i></span>
          </div>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="设置新品标志" prop="is_new">
        <el-radio v-model="step0.is_new" :label="0">否</el-radio>
        <el-radio v-model="step0.is_new" :label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="设置HOT标志" prop="is_hot">
        <el-radio v-model="step0.is_hot" :label="0">否</el-radio>
        <el-radio v-model="step0.is_hot" :label="1">是</el-radio>
      </el-form-item>
    </el-form>


<!--    <el-form v-show="step === 1"
             ref="step1"
             class="form"
             label-width="140px"
             :model="step1"
             :rules="rule1">
      <el-form-item label="商品相册"   prop="gallery">
        <el-upload
          name="image"
          action="/admin/admin/upload/image"
          list-type="picture-card"
          :headers="uploadHeader"
          :on-success="(res, file) => handleSuccess('b', res, file)"
          :on-preview="handlePreviewImg"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="提示">
        <i>（图片越小，加载越快）</i>
      </el-form-item>
    </el-form>-->


    <el-form v-show="step === 1"
             ref="step1"
             class="form"
             :model="step1"
             :rules="rule1">
        <el-form-item prop="goods_desc">
          <tiny-editor v-model="step1.goods_desc"></tiny-editor>
        </el-form-item>

    </el-form>


    <el-form v-show="step === 2"
             ref="step2"
             class="form"
             :model="step2"
             :rules="rule2"
             label-width="120px">
      <el-form-item label="商品库存" prop="goods_number">
        <el-input-number :min="0" v-model="step2.goods_number"></el-input-number>
      </el-form-item>
      <el-form-item label="商品价格" prop="retail_price">
        <el-input-number :min="0" :precision="2" v-model="step2.retail_price"></el-input-number>
      </el-form-item>
      <el-form-item label="销售量" prop="sell_volume">
        <el-input-number :min="0" v-model="step2.sell_volume"></el-input-number>
      </el-form-item>
      <el-form-item label="商品单位" prop="goods_unit">
        <el-input v-model="step2.goods_unit"></el-input>
      </el-form-item>
      <el-form-item label="销售状态" prop="is_on_sale">
        <el-radio v-model="step2.is_on_sale" :label="0">下架</el-radio>
        <el-radio v-model="step2.is_on_sale" :label="1">在售</el-radio>
      </el-form-item>

    </el-form>


    <div class="buttons">
      <el-button @click="handleStep('increment')">上一步</el-button>
      <el-button v-if="step === 2" @click="submit" type="primary">提交</el-button>
      <el-button v-else @click="handleStep('add')">下一步</el-button>
    </div>

  </div>
</template>

<script>
    import {getToken} from '../../utils/auth';
    import {mapActions, mapGetters} from 'vuex';
    import TinyEditor from '../../components/TinyEditor';
    import PreviewImage from "../../components/PreviewImage";
    export default {
        name: "GoodEdit",
        props: {
            goodId: {
                type: String,
                default: ''
            }
        },
        components: {
            PreviewImage,
            TinyEditor
        },
        data() {
            return {
                uploadHeader: {
                    'x-token': getToken()
                },
                step: 0,

                step0: {
                    name: '',
                    is_new: 1, // 新品
                    is_hot: 1, // 热门
                    category_id: '',
                    goods_brief: '',
                    list_pic_url: ''
                },
                rule0: {
                    name: {
                        trigger: 'blur',
                        required: true,
                        message: '请填写商品名称'
                    },
                    goods_brief: {
                        trigger: 'blur',
                        required: true,
                        message: '请填写商品简介'
                    },
                    category_id: {
                        trigger: 'change',
                        message: '请给该商品选择一个分类',
                        required: true,
                    },
                    list_pic_url: {
                        trigger: 'change',
                        required: true,
                        message: '请上传一张该商品的主图'
                    },
                    is_new: {
                        trigger: 'change',
                        required: true,
                    },
                    is_hot: {
                        trigger: 'change',
                        required: true,
                    }
                },


                step1: {
                    goods_desc: ''
                },
                rule1: {
                    goods_desc: [
                        {required: true, message: '请添加商品详情内容', trigger: 'change'}
                    ]
                },

                step2: {
                    is_on_sale: 1, // 在售
                    goods_unit: '件', // 单位
                    sell_volume: 0, // 销售量
                    goods_number: 0, // 库存
                    retail_price: 0, // 零售价格
                },
                rule2: {
                    // 库存
                    goods_number: {
                        pattern: /^\+?[1-9]\d*$/,
                        trigger: 'change',
                        message: '(商品库存必须是一个正整数)',
                        required: true,
                    },
                    // 价格
                    retail_price: {
                        trigger: 'change',
                        required: true,
                        validator (rule, value, callback) {
                            if (value > 0) {
                                callback();
                            } else {
                                callback(new Error('(商品价格必须是一个大于0的数字)'))
                            }
                        }
                    },
                    // 销售量
                    sell_volume: {
                        required: true,
                        message: '销售量必须是一个正整数',
                        trigger: 'change'
                    },
                    is_on_sale: {
                        required: true,
                        message: '请选择商品销售状态',
                        trigger: 'change'
                    },
                    goods_unit: {
                        required: true,
                        message: '请填写商品的单位',
                        trigger: 'change'
                    },
                }
            }
        },
        computed: {
            ...mapGetters('goods', [
                'subCatalogs'
            ])
        },
        methods: {
            ...mapActions('goods', [
                'handleApiMethods',
                'getGoodsCatalogs'
            ]),
            /**
             * event handler 上一步 下一步
             */
            handleStep(type) {
                if (type === 'add') {
                    if (this.checkFormStep(this.step)) {
                        this.step++;
                    }
                } else this.step--;
            },

            /*
            * method 验证所有的表单是否通过校验
            */
            validateForm () {
                const step1 = this.checkFormStep(0);
                const step2 = this.checkFormStep(1);
                const step3 = this.checkFormStep(2);
                // 全部通过验证
                return step1 && step2 && step3;
            },

            /**
             * event handler 提交表单
             */
            submit () {
                if (this.validateForm()) {
                    const form = Object.assign({}, this.step0, this.step1, this.step2);
                    this.handleApiMethods({
                      method: 'addGood',
                      payload: form
                    }).then(res => {
                        this.$router.push('/shop/goods-manage');
                    });
                } else return this.$message({
                    message: '必须参数没有填写，请仔细检查',
                    type: 'warning'
                });
            },

            /**
             * method 检查每个step要提交的内容是否满足条件
             */
            checkFormStep(step) {
                let valid;
                this.$refs['step' + step].validate(v => {
                    valid = v;
                });
                return valid;
            },

            /**
             * method 删除已上传的图片
             */
            removeMiniAvatar() {
                this.step0.list_pic_url = '';
            },

            /**
             * event handler 上传图片完毕
             */
            handleSuccess(res, file) {
                this.step0.list_pic_url = res.data.url || URL.createObjectURL(file.raw);
            },

            /**
             * event handler 拦截图片上传
             */
            handleBeforeUpload(file) {
                console.log(file);
                //
                const isJPG = ['image/jpeg', 'image/png', 'image/jpg', 'image/JPEG'].includes(file.type);
                const isLt2M = file.size / 1024 < 50;

                if (!isJPG) {
                    this.$message.error('上传商品小图只能是 JPG、PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 50kb');
                }
                return isJPG && isLt2M;
            },

            /**
             * event handler 查看图片
             */
            handlePreviewImg(file) {
              this.$store.dispatch('app/previewImage', file.url);
            },

        },
        mounted() {
            this.getGoodsCatalogs();
        }
    }
</script>

<style scoped>
  .container >>> .el-step__title {
    font-size: 14px;
  }
</style>

<style scoped lang="less">
  .container{
    height: 100%;
    display: flex;
    padding: 0;
    overflow: auto;
    flex-direction: column;
    .buttons{
      margin: 20px 0;
      padding: 0 20px;
      text-align: right;
    }
  }
  .form {
    flex: 1;
    margin: 20px 0;
    padding: 20px;
    margin-bottom: 0;
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
      object-fit: cover;
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
</style>
