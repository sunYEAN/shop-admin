import request from '../utils/request'

export const getUsers = (params) => request.get('/admin/user/index', {params});
