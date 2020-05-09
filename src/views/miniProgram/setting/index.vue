<template>
  <div class="container setting-container">
    <div class="container form">
      <el-form ref="form" class="form-wrap" :model="form" :rules="rule">
        <p class="title">小程序配置</p>
        <el-form-item prop="appId" label="AppID 小程序ID：" label-width="300px">
          <el-input v-model="form.appId" size="small" placeholder="请输入AppId"></el-input>
        </el-form-item>
        <el-form-item prop="appSecret" label="AppSecret 小程序密钥：" label-width="300px">
          <el-input v-model="form.appSecret" size="small" placeholder="请输入AppSecret"></el-input>
        </el-form-item>

        <p class="title">微信支付配置</p>
        <el-form-item prop="mchId" label="微信支付商户号 MCHID：" label-width="300px">
          <el-input v-model="form.mchId" size="small" placeholder="请输入微信商户号"></el-input>
        </el-form-item>
        <el-form-item prop="apiKey" label="微信支付密钥 APIKEY：" label-width="300px">
          <el-input v-model="form.apiKey" size="small" placeholder="请输入微信支付密钥"></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MiniSetting",
    data() {
      return {
        form: {
          appId: '',
          appSecret: '',
          mchId: '',
          apiKey: ''
        },
        rule: {
          appId: {
            required: true,
            message: '请输入小程序的AppID',
            trigger: 'blur'
          },
          appSecret: {
            required: true,
            message: '请输入小程序的AppSecret',
            trigger: 'blur'
          }
        }
      }
    },
    methods: {
      submit () {
        this.$refs.form.validate(valid => {
          if (valid) {
            alert('提交');
          }
        })
      }
    }
  }
</script>

<style scoped>
  >>> .el-input__inner {
    border: none;
    border-bottom: 1px solid #e9e9e9;
  }
</style>
<style scoped lang="less">
  @borderColor: #e9e9e9;
  .container {
    padding: 10px;
  }

  .setting-container {
    height: 100%;
    border-radius: 4px;
    background-color: #f3f5f7;

    .form {
      height: 100%;
      padding: 30px;
      display: flex;
      box-sizing: border-box;
      align-items: flex-end;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;

      .form-wrap {
        width: 100%;
      }

      .title {
        padding: 16px 0;
        margin-top: 0;
        margin-bottom: 30px;
        border-bottom: 1px solid @borderColor;

        &:before {
          width: 4px;
          height: 20px;
          content: "";
          display: inline-block;
          margin-right: 10px;
          vertical-align: -4px;
          background-color: #409EFF;
        }
      }

      .submit {

      }
    }
  }
</style>
