<template>
  <el-collapse class="collapse" accordion>
    <el-collapse-item v-for="parent in data" :key="parent.id">
      <template slot="title">
        <span class="bold">{{parent.name}}</span>
      </template>
      <ul class="collapse-subs">
        <li v-for="i in parent.children" :key="i.id">
          <span>{{i.name}}</span>
            <i class="editor el-icon-edit"></i>
            <i class="delete el-icon-delete"></i>
        </li>
      </ul>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
  export default {
    name: "Tree",
    props: {
      data: {
        type: [Array, Object],
        default: {}
      }
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>
  .collapse >>> .el-collapse-item__header{
    color: #333;
    padding: 0 0 0 10px;
  }
  .collapse >>> .el-collapse-item__content{
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
<style scoped lang="less">
  .collapse {
    width: 100%;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
  }
  .collapse-subs{
    position: relative;
    &:after{
      top: 0;
      left: -4px;
      width: 4px;
      height: 100%;
      content: "";
      position: absolute;
      background-color: #409EFF;
    }
    li{
      display: flex;
      align-items: center;
      span{
        margin-right: auto;
      }
      i{
        opacity: 0;
        overflow: hidden;
        font-weight: bold;
        margin-left: 10px;
        &.editor{
          color: #409EFF;
        }
        &.delete{
          color: red;
        }
      }
      &:hover{
        cursor: pointer;
        background-color: #f3f5f7;
        i{
          opacity: 1;
        }
      }
    }
  }
</style>
