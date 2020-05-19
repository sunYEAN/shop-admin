import {getAdminList} from '../../api/admin';
const state = {
  list: [],
  options: {
    loading: false
  }
};
const getters = {};
const actions = {
  async getSystemUsers ({commit}, params = {reset: false}) {
    if (state.list.length && !reset) return;
    if (state.options.loading) return;
    commit('UPDATE_OPTIONS', {loading: true});
    return getAdminList().then(res => {
      console.log(res);
    })
  }
};
const mutations = {
  ['UPDATE_OPTIONS'] (state, payload) {
    state.options = Object.assign({}, state.options, payload);
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
