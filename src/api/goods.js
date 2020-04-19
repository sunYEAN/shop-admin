import request from '../utils/request'

export const getGoodsCatalogs = () => request.get('/admin/category/index', {});

export const getGoods = (params) => request.get('/admin/goods/index', {params});

export const getGoodById = (params) => request.get('/admin/goods/info', {params});

export const addGood = (params) => request.post('/admin/goods/store', params);


export const deleteGood = (params) => request.post('/admin/goods/delete', params);
