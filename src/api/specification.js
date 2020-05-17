import request from '../utils/request'

/**
 * 合并之后的规格列表
 * @param params
 * @returns {*}
 */
export const getCompoundSpecifications = (params) => request.get('/admin/specification/index', {params});

export const getSpecifications = (params) => request.get('/admin/specification/specifications', {params});
