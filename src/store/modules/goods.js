import {getGoodsCateLogs, getGoods} from '../../api/goods';

const state = {
  goods: [],
  goodsOptions: {
    page: 1,
    size: 15,
    name: '',
    loading: false,
    totalCount: 0,
    totalPages: 1,
  },
  catelogs: [],

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
  getGoodsCateLogs({commit, state}, params = {}) {
    if (!state.catelogs.length || params.reset) {
      return getGoodsCateLogs().then(res => {
        const {data} = res;
        commit('SET_CATELOGS', data);
      })
    }
  },

  getGoods({commit, state}) {
    const {name, page, size, loading} = state.goodsOptions;
    commit('SET_PAGE_OPTIONS', {loading: true});

    if (loading) return;

    return getGoods({page, size, name}).then(res => {
      res.data.data.forEach(good => {
        good.on_sale = !!good.is_on_sale;
        good.on_hot = !!good.is_hot;
      });
      commit('SET_GOODS_LIST', res.data);
    }).finally(() => {
      commit('SET_PAGE_OPTIONS', {loading: false});
    })
  }
};

const mutations = {
  ['SET_CATELOGS'](state, data) {
    state.catelogs = data;
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
