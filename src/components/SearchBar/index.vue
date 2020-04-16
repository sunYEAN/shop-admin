<template>
  <div class="search-bar">
    <el-form class="form" :inline="true">

      <el-form-item>
        <el-input clearable placeholder="商品名称" v-model="form.name" @change="handleSearchSubmit"></el-input>
      </el-form-item>

      <el-form-item>
        <el-select v-model="form.cate" placeholder="分类"  @change="handleSearchSubmit">
          <el-option label="全部" value=""/>
          <el-option v-for="cate in catalogs" :key="cate.id" :label="cate.name" :value="cate.id"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="form.onSale" placeholder="上架状态"  @change="handleSearchSubmit">
          <el-option label="全部" :value="0"/>
          <el-option label="已上架" :value="1"/>
          <el-option label="已下架" :value="2"/>
        </el-select>      </el-form-item>

      <el-button size="small" type="primary" @click="handleSearchSubmit">搜索</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "SearchBar",
    props: {
      catalogs: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        form: {
          cate: '', // 分类Id
          name: '', // 商品名称
          onSale: 0,
        }
      }
    },
    methods: {
      handleSearchSubmit () {
        this.$emit('onSearchChange', this.form);
      },
    }
  }
</script>

<style scoped>
  .search-bar >>> .el-input__inner{
    height: 34px;
    line-height: 34px;
  }
  .search-bar >>> .el-form-item{
    margin-bottom: 0;
  }
</style>
<style scoped lang="less">
  .search-bar {
    width: 100%;
    height: 50px;
    display: flex;
    margin-bottom: 10px;
    justify-content: flex-end;
  }
  .form{
    display: flex;
    align-items: center;
  }
</style>
