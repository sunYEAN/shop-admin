<template>
  <div class="container">
    <el-steps :active="step" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品相册"></el-step>
      <el-step title="商品详情"></el-step>
      <el-step title="上架信息"></el-step>
    </el-steps>

    <el-form v-show="step === 0"
             ref="step0"
             class="form"
             label-width="140px"
             :model="step0"
             :rules="rule0">
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="step0.name"></el-input>
      </el-form-item>
      <el-form-item label="商品简介：" prop="desc">
        <el-input v-model="step0.desc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="分类：" prop="cate">
        <el-select v-model="step0.cate">
          <el-option value="1">1</el-option>
          <el-option value="2">2</el-option>
          <el-option value="3">3</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置新品标志：" prop="is_new">
        <el-radio v-model="step0.is_new" :label="0">否</el-radio>
        <el-radio v-model="step0.is_new" :label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="设置HOT标志：" prop="is_hot">
        <el-radio v-model="step0.is_hot" :label="0">否</el-radio>
        <el-radio v-model="step0.is_hot" :label="1">是</el-radio>
      </el-form-item>
    </el-form>


    <el-form v-show="step === 1"
             ref="step1"
             class="form"
             label-width="140px"
             :model="step1"
             :rules="rule1">
      <el-form-item label="商品缩略图：" prop="mini_img">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :show-file-list="false"
          :on-success="(res, file) => handleSuccess('m', res, file)">
          <div @click.stop v-if="step1.mini_img" class="wrap">
            <img :src="step1.mini_img" class="avatar">
            <i class="zoom el-icon-zoom-in" @click.stop="handlePreviewImg({url: step1.mini_img})"></i>
            <i class="delete el-icon-delete" @click.stop="removeMiniAvatar"></i>
            <span class="check"><i class="el-icon-check"></i></span>
          </div>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>


      </el-form-item>
      <el-form-item label="商品相册：" prop="banner">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-success="(res, file) => handleSuccess('b', res, file)"
          :on-preview="handlePreviewImg"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="提示：">
        <i>（图片越小，加载越快）</i>
      </el-form-item>
    </el-form>


    <el-form v-show="step === 2" ref="step2" class="form" label-width="140px">

    </el-form>


    <el-form v-show="step === 3" ref="step3" class="form" label-width="140px">

    </el-form>


    <el-button @click="handleStep('increment')">上一步</el-button>
    <el-button @click="handleStep('add')">下一步</el-button>


    <el-dialog :visible.sync="preview">
      <img width="100%" :src="previewImg" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "GoodEdit",
    props: {
      goodId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        step: 1,

        step0: {
          name: '',
          desc: '',
          cate: '',
          is_new: 1, // 新品
          is_hot: 1, // 热门
        },
        rule0: {
          name: {
            trigger: 'blur',
            required: true,
            message: '请填写商品名称'
          },
          desc: {
            trigger: 'blur',
            required: true,
            message: '请填写商品简介'
          },
          cate: {
            trigger: 'change',
            required: true,
            message: '请选择一个分类'
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
          mini_img: '',
          banners: []
        },
        rule1: {
          mini_img: {
            trigger: 'blur',
            required: true,
            message: '请传入商品缩略图以方便展示...'
          },
          banner: {
            trigger: 'blur',
            required: true,
            message: '请传入商品banner...'
          }
        },
        preview: false,
        previewImg: '',

        step2: {},
        step3: {}
      }
    },
    methods: {
      handleStep(type) {
        if (type === 'add') {
          if (this.checkFormStep(this.step)) {
            this.step++;
          }
        } else this.step--;
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
      removeMiniAvatar () {
        this.step1.mini_img = '';
      },

      /**
       * event handler 上传图片完毕
       */
      handleSuccess (type, res, file) {
        switch (type) {
          case 'm': // mini
            this.step1.mini_img = res.url || URL.createObjectURL(file.raw);
            break;
          case 'b': // banner
            this.step1.banners.push(res.url || URL.createObjectURL(file.raw));
            break;
        }

        console.log(this.step1)
      },

      /**
       * event handler 拦截图片上传
       */
      handleBeforeUpload (file) {
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
      handlePreviewImg (file) {
        this.preview = true;
        this.previewImg = file.url;
      },

      handleRemove () {

      }
    }
  }
</script>

<style scoped>
  .container >>> .el-step__title {
    font-size: 14px;
  }

  .container >>> .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
</style>

<style scoped lang="less">
  .form {
    margin: 20px 0;
  }

  .wrap{
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    position: relative;
    align-items: center;
    justify-content: center;
    >.check{
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
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      >i{
        color: #fff;
        font-size: 10px;
        transform: rotate(-45deg);
      }
    }
    .avatar{
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      display: block;
    }
    .delete,.zoom{
      color: #fff;
      right: 10px;
      bottom: 10px;
      z-index: 100;
      position: absolute;
      font-size: 16px;
    }
    .delete,.zoom{
      display: none;
    }
    .zoom{
      right: 36px;
    }
    &:before{
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      content: "";
      position: absolute;
      transition: all 0.2s ease-in-out;
    }
    &:hover{
      &:before{
        background-color: rgba(0,0,0,0.5);
      }
      .zoom, .delete{
        display: block;
      }
    }


  }
</style>
