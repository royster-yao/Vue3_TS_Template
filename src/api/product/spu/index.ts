// SPU管理模块
import request from '@/utils/request'
import type {
  AllTradeMark,
  HasSaleAttrResponseData,
  HasSpuResponseData,
  SaleAttrResponseData,
  SkuData,
  SkuInfoData,
  SpuData,
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
  // 追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有的SPU下的全部的售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSku/',
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
 * @param {number} spuId 需要获取的spuID
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

/**
 * 获取全部的销售属性
 * @returns 全部的销售属性
 */
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

/**
 * 添加一个新的SPU的接口|更新已有的SPU的接口
 * @param data 新增的SPU|或者已有的SPU对象
 * @returns 若有ID则为修改，没有就是新增
 */
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果SPU对象拥有ID，更新已有的SPU
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

/**
 * 添加SKU的请求
 * @param {SkuData} data 需要带给服务器的参数
 */
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

/**
 * 获取SKU的数据
 * @param skuId 需要查询的SPUid
 * @returns 查询的结果
 */
export const reqSkuList = (skuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

/**
 * 删除已有的SPU
 * @param spuId 需要删除SPU的ID
 * @returns 是否删除成功
 */
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
