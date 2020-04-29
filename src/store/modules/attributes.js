import * as attributesApi from '../../api/attributes';

const state = {
  attributes: [],
  attributesOptions: {
    page: 1,
    size: 30,
    loading: false,
    totalCount: 0,
    totalPages: 1,
  },
  attributeCategory: [],
};

const actions = {

  /**
   * 设置查询条件
   * @param commit
   * @param options
   */
  setAttributeOptions({commit}, options) {
    commit('SET_ATTRIBUTE_OPTIONS', options);
  },

  /**
   * 获取商品参数的分类列表
   * @param commit
   * @param state
   * @param params
   * @returns {*}
   */
  getAttributeCategory({commit, state}, params = {}) {
    if (!state.attributeCategory.length || params.reset) {
      return attributesApi.getAttributeCategory().then(res => {
        const {data} = res;
        data.forEach(i => {
          i.cate_enabled = !!i.cate_enabled;
        });
        commit('SET_ATTRIBUTE_CATEGORY', data);
      })
    }
  },

  /**
   * 获取指定分类的参数列表
   * @param commit
   * @param state
   * @param params
   */
  getAttributes({commit, state}, params) {
    const {page, size, loading} = state.attributesOptions;
    commit('SET_ATTRIBUTE_OPTIONS', {loading: true});

    if (loading) return;

    return attributesApi.getAttributes({page, size, id: params.id}).then(res => {
      commit('SET_ATTRIBUTES', res.data);
    }).finally(() => {
      commit('SET_ATTRIBUTE_OPTIONS', {loading: false});
    })
  },

  handleAttributeApi({}, {
    method,
    payload
  }) {
    if (!method) return;
    return attributesApi[method](payload);
  }
};

const mutations = {
  ['SET_ATTRIBUTES'](state, res) {
    const {data, count, totalPages} = res;
    data.forEach(i => {
      i.attr_enabled = !!i.attr_enabled;
      i.cate_enabled = !!i.cate_enabled;
    });
    state.attributes = data;
    state.attributesOptions.totalCount = count;
    state.attributesOptions.totalPages = totalPages;
  },
  ['SET_ATTRIBUTE_OPTIONS'](state, options) {
    state.attributesOptions = Object.assign(state.attributesOptions, options);
  },
  ['SET_ATTRIBUTE_CATEGORY'](state, category) {
    state.attributeCategory = category;
  }
};


export default {
  state,
  actions,
  mutations,
}
