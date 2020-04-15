import request from '../utils/request'

export function login(data) {
  const {username, password} = data;
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/auth/adminInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  })
}
