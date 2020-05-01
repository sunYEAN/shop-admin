<template>
  <div class="category_form" @click.stop>
    <div class="form_header">
      <h3>参数详情</h3>
      <i class="icon close" @click="handleClose"></i>
    </div>
    <el-form class="form_main" ref="cate" :model="form">
      <el-form-item prop="name"
                    required
                    label="参数名称"
                    label-width="80px">
        <el-input ref="input"
                  size="small"
                  v-model="form.name"
                  clearable
                  placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item prop="name"
                    required
                    label="所属分类"
                    label-width="80px">
        <el-select size="small"
                   v-model="form.attribute_category_id"
                   placeholder="请选择">
          <el-option v-for="i in categories" :key="i.id" :value="i.id" :label="i.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权重" label-width="80px" required>
        <el-input-number v-model="form.sort_order" :min="0"></el-input-number>
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
                        const {id, name, values, attr_enabled, sort_order, attribute_category_id} = nVal;
                        this.form = {
                            id,
                            name,
                            values,
                            sort_order,
                            enabled: attr_enabled,
                            attribute_category_id
                        };
                    } else {
                        this.form = {
                            id: '',
                            name: '',
                            values: '',
                            enabled: true,
                            sort_order: 0,
                            attribute_category_id: '',
                        }
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    values: '',
                    enabled: true,
                    sort_order: 0,
                    attribute_category_id: '',
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
                        const {id, name, enabled, values, sort_order, attribute_category_id} = this.form;

                        this.$emit('submit', {
                            id,
                            name,
                            model: 'attribute',
                            text: this.title,
                            values,
                            sort_order,
                            attribute_category_id,
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
        background: url("../../shopGoodsCate/close.png") no-repeat center center;
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
