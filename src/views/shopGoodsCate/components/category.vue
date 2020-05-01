<template>
  <div class="category_form" @click.stop>
    <div class="form_header">
      <h3>参数分类</h3>
      <i class="icon close" @click="handleClose"></i>
    </div>
    <el-form class="form_main" ref="cate" :model="form">
      <el-form-item prop="name"
                    required
                    label="分类名称"
                    label-width="80px">
        <el-input ref="input"
                  size="small"
                  v-model="form.name"
                  clearable
                  placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item prop="enabled"
                    label="是否开启"
                    label-width="80px">
        <el-switch size="small"
                   v-model="form.enabled"></el-switch>
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

    export default {
        name: "AttributeCategory",
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        watch: {
            data: {
                handler(nVal) {
                    if (nVal.id) {
                        const {id, name, cate_enabled} = nVal;
                        this.form = {id, name, enabled: cate_enabled};
                    } else {
                        this.form = {
                            name: '',
                            enabled: true
                        }
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                form: {
                    name: '',
                    enabled: true,
                }
            }
        },

        computed: {
            title() {
                return this.data.id ? '修改' : '新增';
            }
        },

        methods: {
            ...mapActions('attributes', [
                'handleAttributeApi'
            ]),
            submit() {
                this.$refs.cate.validate(async valid => {
                    if (valid) {
                        const {id, name, enabled} = this.form;

                        // 值没变
                        if (name === this.data.name && enabled === this.data.cate_enabled) return;
                        this.$emit('submit', {
                            id,
                            text: this.title,
                            model: 'category',
                            name: name,
                            enabled: enabled ? 1 : 0
                        })
                    }
                })
            },
            handleClose() {
                this.$emit('update:visible', false);
            }
        }
    }
</script>

<style scoped>
  >>> .el-form-item {
    margin-top: 14px;
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
