import request from '../utils/request'

export const upload = (params) => {
  return request.post('/admin/upload/image', params);
};
