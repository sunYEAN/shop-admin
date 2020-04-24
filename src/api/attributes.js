import request from '../utils/request'


export const getAttributes = (params) => request.get('/admin/attribute/attribute', {params});
export const getAttributeCategory = (params) => request.get('/admin/attribute/category', {params});

export const storeAttribute = (params) => {
  console.log(params);
  return request.post('/admin/attribute/store', params)
};
