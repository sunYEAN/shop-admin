<template>
  <!-- 规格管理 -->
  <div class="container skus-container">
    <div class="header">
      <p></p>
      <el-form>
        <el-form-item>
          <el-select size="small" v-model="form.specification_id" @change="handleChangeSelect">
            <el-option :value="0" label="全部"></el-option>
            <el-option v-for="s in specifications" :value="s.id" :label="s.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button class="h_add" size="small" type="primary">新增</el-button>
    </div>

    <el-table size="small" v-loading="options.loading" border stripe :data="compoundSpecifications">
      <el-table-column align="center" label="商品规格ID" prop="id"></el-table-column>
      <el-table-column align="center" label="规格名称" prop="name"></el-table-column>
      <el-table-column align="center" label="规格内容" prop="value"></el-table-column>
      <el-table-column align="center" label="商品ID" prop="goods_id"></el-table-column>
      <el-table-column align="center" label="规格ID(specification_id)" prop="specification_id"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  export default {
    name: "GoodSkus",
    data() {
      return {
        form: {
          specification_id: 0
        }
      }
    },
    computed: {
      ...mapState('specification', [
        'options',
        'specifications',
        'compoundSpecifications'
      ])
    },
    methods: {
      ...mapActions('specification', [
        'setPageOptions',
        'getSpecifications',
        'getCompoundSpecifications'
      ]),
      handleChangeSelect (specification_id) {
        this.setPageOptions({
          specification_id
        });
        this.getCompoundSpecifications({reset: true});
      }
    },
    mounted() {
      this.getCompoundSpecifications();
      this.getSpecifications();
    }
  }
</script>

<style scoped>
  >>>.el-form-item{
    margin-bottom: 0;
  }
</style>
<style scoped lang="less">
  .skus-container{
    .header{
      display: flex;
      padding: 10px 0;
      align-items: center;
      justify-content: flex-end;
      .h_add{
        margin-left: 16px;
      }
    }
  }
</style>
