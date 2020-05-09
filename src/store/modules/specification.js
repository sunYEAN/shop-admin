import * as Api from '../../api/specification';

const state = {
  specifications: [], // 父级规格 （id, name）
  compoundSpecifications: [], //
  options: {
    specification_id: '',
    loading: false,
  },
};

const actions = {
  setPageOptions({commit}, options) {
    commit('SET_PAGE_OPTIONS', options);
  },

  getCompoundSpecifications({commit, state}, params = {}) {
    if (params.reset || !state.compoundSpecifications.length) {

      if (state.options.loading) return;
      commit('SET_PAGE_OPTIONS', {loading: true});

      const {specification_id} = state.options;
      return Api.getCompoundSpecifications({specification_id})
        .then(res => {
          commit('SET_COMPOUND_SPECIFICATIONS', res.data);
          commit('SET_PAGE_OPTIONS', {loading: false});
        }).catch(err => {
          console.log(err);
          commit('SET_PAGE_OPTIONS', {loading: false});
        })
    }
  },

  getSpecifications({commit, state}, params = {}) {
    if (params.reset || !state.specifications.length) {
      return Api.getSpecifications(params).then(res => {
        commit('SET_SPECIFICATIONS', res.data);
      }).catch(err => {
        console.log(err);
      })
    }
  }
};

const mutations = {
  ['SET_PAGE_OPTIONS'](state, options) {
    console.log(options);
    state.options = Object.assign(state.options, options);
  },
  ['SET_SPECIFICATIONS'](state, list) {
    state.specifications = list;
  },
  ['SET_COMPOUND_SPECIFICATIONS'](state, list) {
    state.compoundSpecifications = list;
  }
};


export default {
  state,
  actions,
  mutations,
}
