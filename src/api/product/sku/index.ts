// SKU模块接口管理
import request from '@/utils/request'
import { SkuResponseData, SkuInfoData } from './type'
// 枚举地址
enum API {
  // 获取已有的商品的数据 -SKU
  SKU_URL = '/admin/product/list/',
  // 上架
  SALE_URL = '/admin/product/onSale/',
  // 下架
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情的接口地址
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除已有的商品
  DELETESKU_URL = '/admin/product/deleteSku/',
}

/**
 * 获取商品的SKU的接口
 * @param page 获取哪一页的页码
 * @param limit 获取多少条数据
 * @returns 根据条件获取的数据
 */
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

/**
 * 已有商品上架的请求
 * @param SkuId 需要上架商品的ID
 * @returns 是否上架成功
 */
export const reqSaleSku = (SkuId: number) =>
  request.get<any, any>(API.SALE_URL + SkuId)

/**
 * 已有商品下架的请求
 * @param SkuId 需要下架商品的ID
 * @returns 是否下架成功
 */
export const reqCancelSale = (SkuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + SkuId)

/**
 * 获取商品详情的接口
 * @param skuId 需要查看商品的id
 * @returns 数据详情
 */
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

/**
 * 删除某一个已有的商品
 * @param skuId 需要删除商品的ID
 * @returns 是否删除成功
 */
export const reqRemoveSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
