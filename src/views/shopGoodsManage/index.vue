<template>
  <div class="app-container">
    <el-table :data="goods" border v-loading="options.loading">

      <el-table-column align="center" label="ID" prop="id" width="200"/>

      <el-table-column align="center" label="商品详情" width="340">
        <template slot-scope="{row}">
          <el-card :body-style="{padding: '10px'}">
            <div class="card_container">
              <img class="card_cover" :src="row.primary_pic_url" alt="">
              <div class="card_info">
                <p class="p lines line1 t">{{row.name}}</p>
                <p class="p lines line1 d">{{row.goods_brief}}</p>
                <p class="p c">
                  <a>库存: <span>{{row.goods_number}} </span>件</a>
                  <a>卖出: <span>{{row.sell_volume}} </span>件</a>
                  <span>￥{{row.retail_price}}</span>
                </p>
              </div>
            </div>
          </el-card>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上架" width="120">
        <template slot-scope="{row}">
          <el-switch
            :value="row.on_sale"
            style="display: block;"
            @change="(status) => {handleStatusChange(row, status)}"
            active-color="#13ce66"
            inactive-color="#d0d0d0">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="推荐" width="120">
        <template slot-scope="{row}">
          <el-tag v-if="row.is_hot" type="success">推荐</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">编辑</el-button>
          <el-button size="mini">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      class="pagination"
      layout="prev, pager, next"
      @current-change="handlePageChange"
      :page-size="options.size"
      :total="options.totalCount">
    </el-pagination>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
export default {
  data() {
    return {
      params: {
      }
    }
  },
  computed: {
    ...mapState('goods', {
      goods: state => state.goods,
      options: state => state.goodsOptions,
    })
  },
  methods: {
    ...mapActions('goods', [
      'getGoods',
      'setGoodsOptions'
    ]),

    handleStatusChange (item, status) {
      item.on_sale = status;
    },

    handlePageChange (page) {
      this.setGoodsOptions({page});
      this.getGoods();
    }
  },
  mounted() {
    this.getGoods();
  }
}
</script>

<style scoped lang="less">
  .line{
    text-align: center;
  }
  .card_container{
    display: flex;
    .card_cover{
      width: 90px;
      height: 90px;
      display: block;
      object-fit: cover;
    }
    .card_info{
      display: flex;
      flex-direction: column;
      .p{
        width: 100%;
        margin: 0;
        box-sizing: border-box;
        padding-left: 10px;
        &.t{
          font-size: 15px;
        }
        &.d{
          color: #999;
          font-size: 12px;
        }
        &.c{
          color: #999;
          display: flex;
          font-size: 12px;
          margin-top: auto;
          justify-content: flex-start;
          span{
            color: #de1e43;
          }
          a{
            margin-right: 10px;
          }
        }
      }
    }
  }

  .app-container{
    .pagination{
      margin-top: 16px;
    }
  }
</style>

