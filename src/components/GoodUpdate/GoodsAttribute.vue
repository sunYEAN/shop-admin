<template>
  <div class="attrs" @click.stop>
    <el-card class="attrs-card">
      <div class="header" slot="header">
        <span>商品-参数编辑</span>
        <i class="close" @click="handleClose"></i>
      </div>

      <el-table :data="attrs" border >
        <el-table-column prop="id"    align="center" label="id" width="80px"></el-table-column>
        <el-table-column prop="name"  align="center" label="类型名称"></el-table-column>
        <el-table-column prop="value" align="center" label="类型值"></el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
        </el-table-column>
      </el-table>

      <el-button type="primary" size="small">新增</el-button>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "GoodAttribute",
        props: {
            attributes: {
                type: Array,
                default: () => []
            },
            goodId: {
                type: [String, Number],
                default: ''
            },
        },
        watch: {
            attributes: {
                handler (nVal) {
                    this.attrs = nVal;
                },
                immediate: true
            }
        },
        data () {
            return {
                attrs: []
            }
        },
        methods: {
            handleClose() {
                this.$emit('update:visible', false);
            },
        }
    }
</script>

<style scoped lang="less">
  ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .attrs{
    width: 700px;
    margin: 15vh auto 20px;
    position: relative;
    border-radius: 4px;
    background-color: #ffffff;
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
  }
</style>
