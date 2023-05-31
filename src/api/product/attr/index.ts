// 属性相关的 API 文件
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'
// 属性管理模块的地址接口
enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取一级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  // 获取三级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  // 获取分类下已有的属性和属性值接口地址
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加或者修改已有的属性接口
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  // 删除某一个已有的属性
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

/**
 * 获取一级级分类接口方法
 * @returns 一级分类的数据
 */
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)

/**
 *  获取二级级分类接口方法
 * @param category1Id 一级分类的id
 * @returns 根据一级分类的ID，返回二级分类数据
 */
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + category1Id)

/**
 * 获取三级级分类接口方法
 * @param category2Id 二级分类的id
 * @returns 根据二级分类的ID，返回三级分类数据
 */
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + category2Id)

/**
 * 获取分类下已有的属性和属性值方法
 * @param category1Id 一级分类的id
 * @param category2Id 二级分类的id
 * @param category3Id 三级分类的id
 * @returns 获取分类下已有的属性和属性值方法
 */
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

/**
 * 新增或者修改已有属性接口
 * @param data 需要添加或者修改的参数
 * @returns 添加或修改是否成功
 */
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)

/**
 * 删除某一个已有的属性接口
 * @param attrId 需要删除属性的id
 * @returns 是否删除成功
 */
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
