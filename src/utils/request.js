import axios from 'axios'
import store from '../store'
import {getToken} from '../utils/auth'
import {MessageBox, Message} from 'element-ui'

const service = axios.create({
  baseURL: '/admin', // url = base url + request url
});

// request interceptor
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken();
    config.headers['wxapp_id'] = store.getters.userInfo.wxapp_id || '';
  }
  return config
}, error => {
  return Promise.reject(error)
});

// response interceptor
service.interceptors.response.use(response => {
  const res = response.data;
  if (!res.errno) return res;

  Message({
    message: res.errmsg || 'error',
    type: 'error',
    duration: 5 * 1000
  });

  // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //   // to re-login
    //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //     confirmButtonText: 'Re-Login',
    //     cancelButtonText: 'Cancel',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('user/resetToken').then(() => {
    //       location.reload()
    //     })
    //   })
    // }
  return Promise.reject(new Error(res.message || 'Error'))
}, error => {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  });
  return Promise.reject(error)
});


export default service;
