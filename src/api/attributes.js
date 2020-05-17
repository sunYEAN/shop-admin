import request from '../utils/request'


export const getAttributes = (params) => request.get('/admin/attribute/index', {params});
export const getAttributeCategory = (params) => request.get('/admin/attribute/category', {params});

export const remove = (params) => request.post('/admin/attribute/remove', params);

export const edit = (params) => request.post('/admin/attribute/store', params);
