export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义SKU对象的TS类型
export interface Attr {
  id?: number
  attrId: string | number
  valueId: string | number
  valueName?: string
}
export interface saleArr {
  id?: number
  saleAttrId: string | number
  saleAttrValueId: string | number
  saleAttrValueName?: string
}
export interface SaleAttrImg {
  createTime: string
  id: number
  imgName: string
  imgUrl: string
  isDefault: string
  skuId: number
  spuImgId: number
  updateTime: string
}
export interface SkuData {
  category3Id?: string | number
  spuId?: string | number
  tmId?: string | number
  skuName?: string
  price?: string | number
  weight?: string | number
  skuDesc?: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuImageList?: SaleAttrImg[]
  skuDefaultImg?: string
  isSale?: number
  id?: number
}

// 获取SKU接口返回的数据TS类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取SKU商品详情接口的TS类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
