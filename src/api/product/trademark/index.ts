// 品牌管理接口
import request from '@/utils/request'
import type { TrademarkResponseData, Trademark } from './type'
// 品牌管理模块接口地址
enum API {
  // 获取已有的品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌
  UPDTATRANDEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

/**
 * 获取已有的品牌的接口方法
 * @param page 获取第几页的数据
 * @param limit 获取几个已有品牌的数据
 * @returns 返回
 */
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

/**
 * 添加与修改已有品牌接口方法
 * @param data
 * @returns
 */
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  // 修改已有品牌的数据
  if (data.id) {
    return request.put<any, any>(API.UPDTATRANDEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除已有品牌的数据
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
