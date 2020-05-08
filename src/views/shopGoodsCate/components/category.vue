<template>
  <div class="category_form" @click.stop>
    <div class="form_header">
      <h3>参数分类</h3>
      <i class="icon close" @click="handleClose"></i>
    </div>

    <el-form class="form_main" ref="cate" :model="form">

      <el-form-item prop="sort_order" required label="父级分类名称：" label-width="120px">
        <el-select :value="form.parent_id" @change="handleParentChange">
          <el-option label="顶级分类" :value="0"></el-option>
          <el-option v-for="i in filterSelf" :key="i.id + 'edit'" :label="i.name" :value="i.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="name" required label="分类名称：" label-width="100px">
        <el-input ref="input" size="small" v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item prop="name" label="前端名称：" label-width="100px">
        <el-input ref="input" size="small" v-model="form.front_name" placeholder="请输入front_name"></el-input>
      </el-form-item>

      <el-form-item prop="name" label="前端描述：" label-width="100px">
        <el-input type="textarea" ref="input" size="small" v-model="form.front_desc" placeholder="请输入front_desc"></el-input>
      </el-form-item>

      <!--   upload   -->
      <el-form-item v-if="!form.parent_id" prop="img_url" label="img_url：" label-width="100px">
        <image-upload :url.sync="form.img_url"></image-upload>
      </el-form-item>

      <el-form-item v-if="!form.parent_id" prop="icon_url" label="icon_url：" label-width="100px">
        <image-upload :url.sync="form.icon_url"></image-upload>
      </el-form-item>

      <el-form-item prop="wap_banner_url" label="wap_url：" label-width="100px">
        <image-upload :url.sync="form.wap_banner_url"></image-upload>
      </el-form-item>

      <el-form-item prop="banner_url" label="banner：" label-width="100px">
        <image-upload :url.sync="form.banner_url"></image-upload>
      </el-form-item>

      <!--   upload end   -->

      <el-form-item prop="name" label="关键词：" label-width="100px">
        <el-input ref="input" size="small" v-model="form.keywords" clearable placeholder="请输入关键词"></el-input>
      </el-form-item>

      <el-form-item class="number" prop="sort_order" label="排序权重：" label-width="100px">
        <el-input-number :min="0" size="small" v-model="form.sort_order"></el-input-number>
      </el-form-item>

      <el-form-item prop="enabled" label="是否开启：" label-width="100px">
        <el-switch size="small" v-model="form.is_show"></el-switch>
      </el-form-item>

      <el-form-item>
        <div class="action">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button size="small" type="primary" @click="submit">{{title}}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import {getToken} from '../../../utils/auth';
    import ImageUpload from '../../../components/UploadImage';


    export default {
        name: "AttributeCategory",
        components: {ImageUpload},
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            categories: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            data: {
                handler(nVal) {
                    if (nVal.id) {
                        this.form = Object.assign({}, nVal);
                    } else {
                        this.form = {
                            type: 0,
                            name: '',
                            front_name: '',
                            front_desc: '',
                            keywords: '',
                            is_show: true,
                            parent_id: nVal.parent_id || 0,
                            sort_order: 0,
                            img_url: '',
                            icon_url: '',
                            banner_url: '',
                            wap_banner_url: '',
                        }
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                uploadHeader: {
                    'x-token': getToken()
                },
                form: {
                    type: 0,
                    name: '',
                    front_name: '',
                    front_desc: '',
                    keywords: '',
                    is_show: true,
                    parent_id: 0,
                    sort_order: 0,
                    img_url: '',
                    icon_url: '',
                    banner_url: '',
                    wap_banner_url: '',
                }
            }
        },

        computed: {
            title() {
                return this.data.id ? '修改' : '新增';
            },
            is_edit () {
                return !!this.data.id;
            },
            filterSelf () {
                return this.categories.filter(item => item.id !== this.form.id) || [];
            }
        },

        methods: {
            ...mapActions('attributes', [
                'handleAttributeApi'
            ]),
            submit() {
                this.$refs.cate.validate(async valid => {
                    if (valid) {
                        this.$emit('submit', {
                            ...this.form,
                        })
                    }
                })
            },
            handleUploaded (a, b, c) {
                console.log(a, b, c);
            },
            handleClose() {
                this.$emit('update:visible', false);
            },
            handleParentChange(parent_id) {
                this.form.parent_id = parent_id;
            }
        }
    }
</script>

<style scoped>
  >>> .el-form-item {
    margin-top: 14px;
  }
  >>>.el-input__inner,>>>.el-textarea__inner{
    border: none;
    border-bottom: 1px dashed #e0e0e0;
  }
  >>>.el-input__inner:focus,>>>.el-textarea__inner:focus{
    border-color: #409EFF;
  }
  .number >>> .el-input__inner {
    border: 1px solid #e0e0e0;
  }
</style>
<style scoped lang="less">
  h3 {
    margin: 0;
  }

  .category_form {
    width: 60%;
    margin: 15vh auto 20px;
    border-radius: 4px;
    background-color: #ffffff;

    .form_header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e9e9e9;
      justify-content: space-between;

      .icon {
        width: 16px;
        height: 16px;
        cursor: pointer;
        display: block;
        background: url("../close.png") no-repeat center center;
        background-size: 70%;
      }
    }

    .form_main {
      padding: 16px 20px 16px 16px;
    }
  }

  .action {
    text-align: right;
  }
</style>
