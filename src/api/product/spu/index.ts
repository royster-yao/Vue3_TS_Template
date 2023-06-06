// SPU管理模块
import request from '@/utils/request'
import type {
  AllTradeMark,
  HasSaleAttrResponseData,
  HasSpuResponseData,
  SaleAttrResponseData,
  SpuHasImg,
} from './type'
enum API {
  // 获取已有的SPU的数据地址
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某一个SPU下的全部的售卖商品图片的数据
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某一个SPU下的全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色，版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
}

/**
 * 获取某一个三级分类下已有的SPU数据
 * @param page 获取哪一页的数据
 * @param limit 一页有多少条数据
 * @param category3Id 获取的是哪个三级分类
 * @returns 三级分类的数据
 */
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

/**
 * 获取全部的SPU的品牌的数据
 * @returns 返回所有SPU
 */
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)

/**
 * 获取某一个已有的SPU下的全部的商品的图片地址
 * @param spuId 需要获取的spuID
 * @returns 图片地址
 */
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

/**
 * 获取某一个已有的SPU拥有多少个销售属性
 * @param spuId 需要获取的spuID
 * @returns 销售属性
 */
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
