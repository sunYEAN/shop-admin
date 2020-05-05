<template>
  <div class="good-update container">
    <el-form ref="form" class="good-form" :model="good" size="small">

      <el-form-item label="商品名称：" required label-width="120px">
        <el-input class="name" v-model="good.name" placeholder="商品名称" @change="updateGood"></el-input>
      </el-form-item>

      <el-form-item label="商品展示图：" required label-width="120px">
        <upload-image @success="updateGood" :url.sync="good.list_pic_url"/>
      </el-form-item>

      <el-form-item label="商品简介：" label-width="120px">
        <el-input class="brief" v-model="good.goods_brief" type="textarea" placeholder="商品简介" @change="updateGood"></el-input>
      </el-form-item>

      <el-form-item label="库存：" label-width="120px">
        <el-input-number class="number" :min="0" v-model="good.goods_number"></el-input-number>
      </el-form-item>
      <el-form-item label="销量：" label-width="120px">
        <el-input-number class="number" :min="0" v-model="good.sell_volume"></el-input-number>
      </el-form-item>
      <el-form-item label="价格：" required label-width="120px">
        <el-input-number class="number" :min="0.01" v-model="good.retail_price" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item label="单位：" required label-width="120px">
        <el-input v-model="good.goods_unit"></el-input>
      </el-form-item>

      <el-form-item label="商品相册：" label-width="120px">
        <a @click="handleMethod('album')">查看相册</a>
      </el-form-item>

      <el-form-item label="商品规格：" label-width="120px">
        <a @click="handleMethod('skus')">查看规格</a>
      </el-form-item>

      <el-form-item label="商品参数：" label-width="120px">
        <a @click="handleMethod('attrs')">查看参数</a>
      </el-form-item>

      <el-form-item label="商品详情：" label-width="120px">
        <a @click="handleMethod('detail')">查看详情</a>
      </el-form-item>

      <el-form-item label="商品分类：" required label-width="120px">
        <el-select class="number" :value="good.category_id" @change="handleCateChange">
          <el-option v-for="cate in filterLevelCatalogs" :key="cate.id" :value="cate.id" :label="cate.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="新品标志：" required label-width="120px">
        <el-radio-group v-model="good.is_new" @change="updateGood">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="热门标志：" required label-width="120px">
        <el-radio-group v-model="good.is_hot" @change="updateGood">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否在售：" required label-width="120px">
        <el-radio-group v-model="good.is_on_sale" @change="updateGood">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!--  商品轮播图  -->
    <good-album :good-id="good.id"
                :on-upload-success="handleUploadSuccess"
                :visible.sync="showAlbum"
                :images="good.gallery" @update="getGoodInfo"/>

    <!-- 商品参数 -->
    <good-attr :good-id="good.id"
               :visible.sync="showAttrs"
               :attributes="good.attributes"></good-attr>

    <!-- 商品详情 -->
    <good-detail-editor :initialValue="good.goods_desc"
                        @success="handleEditDetail"
               :visible.sync="showDetail"></good-detail-editor>
  </div>
</template>

<script>
    import {getToken} from '../../utils/auth';
    import {mapState, mapActions} from 'vuex';
    import {GoodAlbum, GoodAttr, GoodDetailEditor} from '../../components/GoodUpdate';
    import UploadImage from '../../components/UploadImage';

    export default {
        name: "GoodUpdate",
        components: {
            GoodAlbum,
            GoodAttr,
            UploadImage,
            GoodDetailEditor
        },
        data() {
            return {
                uploadHeader: {
                    'x-token': getToken()
                },
                showAlbum: false,
                showAttrs: false,
                showDetail: false,
                good: {},
            }
        },
        computed: {
            ...mapState('goods', {
                catalogs: state => state.catalogs,
            }),
            filterLevelCatalogs() {
                return this.catalogs.filter(item => item.level === 2);
            }
        },
        methods: {
            ...mapActions('goods', [
                'getGoodsCatalogs',
                'handleApiMethods',
            ]),

            handleMethod(type) {
                switch (type) {
                    case 'album':
                        this.showAlbum = true;
                        break;
                    case 'attrs':
                        this.showAttrs = true;
                        break;
                    case 'detail':
                        this.showDetail = true;
                        break;
                }
            },

            updateGood () {
                this.handleApiMethods({
                    method: 'addGood',
                    payload: this.good
                }).then(res => {
                    this.$notify({
                        type: 'success',
                        message: '修改成功'
                    })
                }).catch(err => {
                    this.$message({
                        type: 'danger',
                        message: err.message
                    })
                })
            },

            getGoodDetail(id) {
                return this.handleApiMethods({
                    method: 'getGoodById',
                    payload: {
                        id
                    }
                })
            },
            // 相册上传成功
            handleUploadSuccess(data) {
                this.handleApiMethods({
                    method: 'addGallery',
                    payload: {}
                })
            },


            getGoodInfo() {
                const {id} = this.$route.query;
                this.getGoodDetail(id).then(res => {
                    const {data} = res;
                    this.good = {
                        id: data.id,
                        name: data.name,
                        category_id: data.category_id, // 分类id
                        counter_price: data.counter_price, // 专柜价格
                        extra_price: data.extra_price, // 附加价格
                        goods_brief: data.goods_brief, // 商品简介
                        goods_desc: data.goods_desc, // 商品详情
                        goods_number: data.goods_number, // 商品库存
                        goods_sn: data.goods_sn, //
                        goods_unit: data.goods_unit, // 商品单位
                        is_hot: data.is_hot, // 是否热门
                        is_limited: data.is_limited, //
                        is_new: data.is_new, // 是否新品
                        is_on_sale: data.is_on_sale, // 是否在售卖
                        keywords: data.keywords, // 关键词
                        list_pic_url: data.list_pic_url,
                        primary_pic_url: data.primary_pic_url, //
                        primary_product_id: data.primary_product_id, //
                        promotion_desc: data.promotion_desc, //
                        promotion_tag: data.promotion_tag, //
                        retail_price: data.retail_price, // 价格
                        sell_volume: data.sell_volume, // 卖出数量
                        sort_order: data.sort_order, // 排序权重
                        unit_price: data.unit_price,
                    };
                })
            },

            handleCateChange (category_id) {
                this.good.category_id = category_id;
                this.updateGood();
            },
            handleEditDetail (value) {
                this.good.goods_desc = value;
                this.updateGood();
                this.showDetail = false;
            }
        },

        created() {
            this.getGoodInfo();
            this.getGoodsCatalogs();
        }
    }
</script>

<style scoped>
  .good-update >>> .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
  }


  >>> .el-input__inner{
    border: none;
    border-bottom: 1px dashed #e0e0e0;
  }
  >>> .el-input__inner:focus {
    border-color: #409EFF;
  }

  .number >>> .el-input__inner{
    border: 1px solid #e0e0e0;
  }
</style>
<style scoped lang="less">
  a {
    color: #409EFF;
  }

  .good-update{
    padding: 40px 10%;
  }
</style>
