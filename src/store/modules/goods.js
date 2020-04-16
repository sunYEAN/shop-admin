import {getGoodsCatalogs, getGoods} from '../../api/goods';

const state = {
  goods: [],
  goodsOptions: {
    page: 1,
    size: 15,
    name: '',
    cate: '',
    onSale: 0,
    loading: false,
    totalCount: 0,
    totalPages: 1,
  },
  catalogs: [],
};

const getters = {};

// 加载状态
let loading = false;


const actions = {

  setGoodsOptions({commit}, options) {
    commit('SET_PAGE_OPTIONS', options);
  },

  /**
   * 获取商品分类
   * @param commit
   * @param state
   * @param params
   * @returns {Q.Promise<any> | Q.Promise<T | never> | PromiseLike<T | never> | Promise<T | never>}
   */
  getGoodsCatalogs({commit, state}, params = {}) {
    if (!state.catalogs.length || params.reset) {
      return getGoodsCatalogs().then(res => {
        const {data} = res;
        commit('SET_CATELOGS', data);
      })
    }
  },

  getGoods({commit, state}) {
    const {name, page, size, cate, onSale, loading} = state.goodsOptions;
    commit('SET_PAGE_OPTIONS', {loading: true});

    if (loading) return;

    return getGoods({page, size, name, cate, onSale}).then(res => {
      res.data.data.forEach(good => {
        good.on_sale = !!good.is_on_sale;
      });
      commit('SET_GOODS_LIST', res.data);
    }).finally(() => {
      commit('SET_PAGE_OPTIONS', {loading: false});
    })
  }
};

const mutations = {
  ['SET_CATELOGS'](state, data) {
    state.catalogs = data;
  },
  ['SET_PAGE_OPTIONS'](state, options) {
    state.goodsOptions = Object.assign(state.goodsOptions, options);
  },
  ['SET_GOODS_LIST'](state, res) {
    const {data, count, totalPages} = res;
    console.log(totalPages);
    state.goods = data;
    state.goodsOptions.totalCount = count;
    state.goodsOptions.totalPages = totalPages;
  }
};


export default {
  state,
  actions,
  getters,
  mutations,
}
