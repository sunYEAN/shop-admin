import * as usersApi from '../../api/user';
import {parseTime} from '../../utils'

const state = {
  users: [],
  usersOptions: {
    page: 1,
    size: 15,
    name: '',
    loading: false,
    totalCount: 0,
    totalPages: 1
  },
};


const actions = {

  /**
   * 设置查询条件
   * @param commit
   * @param options
   */
  setUsersOptions({commit}, options) {
    commit('SET_PAGE_OPTIONS', options);
  },


  /**
   * 获取用户列表
   * @param commit
   * @param state
   * @returns {Q.Promise<any>}
   */
  getUsers({commit, state}) {
    const {page, size, name, loading} = state.usersOptions;
    commit('SET_PAGE_OPTIONS', {loading: true});

    if (loading) return;

    return usersApi.getUsers({page, size, name}).then(res => {
      const {data} = res;
      data.data.forEach(item => {
        item.register_time = parseTime(item.register_time, '{y}-{m}-{d}');
        item.last_login_time = parseTime(item.last_login_time, '{y}-{m}-{d}');
      });
      commit('SET_USERS_LIST', res.data);
    }).finally(() => {
      commit('SET_PAGE_OPTIONS', {loading: false});
    })
  },


  /**
   * 单纯的接口
   * @param commie
   * @param method
   * @param payload
   * @returns {*}
   */
  handleApiMethods ({commie}, {method, payload}) {
    return usersApi[method](payload);
  },
};

const mutations = {
  ['SET_PAGE_OPTIONS'](state, options) {
    state.usersOptions = Object.assign(state.usersOptions, options);
  },
  ['SET_USERS_LIST'](state, res) {
    const {data, count, totalPages} = res;
    state.users = data;
    state.usersOptions.totalCount = count;
    state.usersOptions.totalPages = totalPages;
  }
};


export default {
  state,
  actions,
  mutations,
}
