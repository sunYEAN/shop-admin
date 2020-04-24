import request from '../utils/request'


export const getAttributes = (params) => request.get('/admin/attribute/attribute', {params});
export const getAttributeCategory = (params) => request.get('/admin/attribute/category', {params});

export const updateAttribute = (params) => request.post('/admin/attribute/update', params);
