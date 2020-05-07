import { login, logout, getUserInfo } from '../../api/admin'
import { getToken, setToken, removeToken } from '../../utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
  }
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER_INFO: (state, info) => {
    state.userInfo = info;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response;
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUserInfo({ commit, state }, params = {}) {
    return new Promise((resolve, reject) => {

      // 用户不存在或者重置
      if (!state.userInfo.id || params.reset) {
        return getUserInfo(state.token).then(response => {
          const { data } = response;
          if (!data) {
            reject('验证失败，请重新登录。')
          }
          commit('SET_USER_INFO', data);
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
      return state.userInfo || {};
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve()
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

