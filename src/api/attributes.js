import request from '../utils/request'


export const getAttributes = (params) => request.get('/admin/attribute/attribute', {params});

export const getAttributeCategory = (params) => request.get('/admin/attribute/category', {params});

export const storeCategory = (params) => request.post('/admin/attribute/storeCategory', params);

export const storeAttribute = (params) => request.post('/admin/attribute/store', params);

export const deleteAttribute = (params) => request.post('/admin/attribute/deleteAttribute', params);
