import request from '../utils/request'

export const getGoodsCatalogs = () => request.get('/admin/category/index', {});

export const getGoods = (params) => request.get('/admin/goods/index', {params});

export const getGoodById = (params) => request.get('/admin/goods/info', {params});

export const getGoodGallery = (params) => request.get('/admin/gallery/index', {params});


/**
 * 新增商品
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const addGood = (params) => request.post('/admin/goods/store', params);

/**
 * 新增商品轮播图
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const addGallery = (params) => request.post('/admin/gallery/store', params);

/**
 * 商品轮播图排序
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const sortGallery = (params) => request.post('/admin/gallery/sort', params);


/**
 * 新增商品分类
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const storeGoodCategory = (params) => request.post('/admin/category/store', params);

/**
 * 删除一个分类
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const deleteGoodCategory = (params) => request.post('/admin/category/delete', params);



export const deleteGood = (params) => request.post('/admin/goods/delete', params);
