import request from '../utils/request'

export const getGoodsCatalogs = () => {
  return request.get('/admin/category/index', {});
};


export const getGoods = (params) => {
  return request.get('/admin/goods/index', {
    params
  });
};
