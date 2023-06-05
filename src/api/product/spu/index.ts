// SPU管理模块
import request from '@/utils/request'
import type { HasSpuResponseData } from './type'
enum API {
  // 获取已有的SPU的数据地址
  HASSPU_URL = '/admin/product/',
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
