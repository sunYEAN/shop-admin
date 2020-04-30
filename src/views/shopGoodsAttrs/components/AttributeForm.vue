<template>
  <div class="card" @click.stop>
    <h3>
      <span v-if="is_edit">编辑</span>{{attribute.name}}
      <i @click="$emit('update:visible', false)" class="el-icon-close" style="float:right;"></i>
    </h3>
    <el-form ref="form" :model="form" :rules="rule" class="form" :disabled="!is_edit">
      <el-form-item label="名称:" prop="name" label-width="80px">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="权重:" label-width="80px">
        <el-input v-model="form.sort_order" type="number"></el-input>
      </el-form-item>
      <el-form-item label="所属类别:" label-width="80px">
        <el-select v-model="form.attribute_category_id">
          <el-option v-for="i in category" :key="i.id" :value="i.id" :label="i.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用:" label-width="80px">
        <el-switch v-model="form.attr_enabled"></el-switch>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item v-if="is_edit" style="margin-bottom: 0;">
        <div style="text-align: right;">
          <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
          <el-button size="small" type="primary" @click="handleSave">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "AttributeForm",
    props: {
      attribute: {
        type: Object,
        default: () => ({})
      },
      category: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        form: {},
        rule: {
          name: [
            {
              required: true,
              message: '请输入名字',
              trigger: 'change'
            }
          ]
        }
      }
    },
    watch: {
      attribute: {
        handler (nVal) {
          if (nVal.id) {
            this.form = {...nVal};
          } else {
            this.form = {
              name: nVal.name,
              sort_order: nVal.sort_order,
              attr_enabled: nVal.attr_enabled,
              attribute_category_id: nVal.attribute_category_id,
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      is_edit () {
        return !!this.attribute.id;
      }
    },
    methods: {
      handleSave () {
        this.$refs.form.validate(valid => {
          if (valid) {
            const params = {...this.form};
            params.enabled = params.attr_enabled;
            delete params.attr_enabled;
            this.$emit('save', this.form);
            this.$emit('update:visible', false);
          }
        })
      }
    }
  }
</script>


<style scoped lang="less">
  .card{
    width: 700px;
    margin: 15vh auto 20px;
    overflow: auto;
    border-radius: 4px;
    background-color: #fff;
    h3{
      margin: 0;
      padding: 16px;
      border-bottom: 1px solid #efefef;
    }
    .form{
      padding: 16px;
    }
  }
</style>
