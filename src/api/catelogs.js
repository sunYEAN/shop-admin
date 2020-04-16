import request from '../utils/request'


export const getGoods = (params) => {
  return request.get('/admin/goods/index', {
    params
  });
};
