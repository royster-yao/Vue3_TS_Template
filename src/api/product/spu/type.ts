// 服务器全部接口返回的数据类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImage[]
}
// 数组：元素都是已有的SPU数据类型
export type Records = SpuData[]

// 获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所以品牌数据的TS类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据的类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}
// 商品图片的TS类型
export interface SpuImage {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}

// 已有Spu照片墙返回的数据的类型
export interface SpuHasImg extends ResponseData {
  data: SpuImage[]
}

// 已有的销售属性对象的TS类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有的销售属性值数组的类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象的TS类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
  saleIdAndValueId?: string
}

// SPU已有的销售属性接口返回数据TS类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部Spu的返回数据的TS类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: string | number
  valueId: string | number
}

export interface saleArr {
  saleAttrId: string | number
  saleAttrValueId: string | number
}
export interface SkuData {
  category3Id: string | number
  spuId: string | number
  tmId: string | number
  skuName: string
  price: string | number
  weight: string | number
  skuDesc: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string
}

// 获取SKU数据接口的TS类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
