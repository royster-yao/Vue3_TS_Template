export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有品牌的 ts 数据类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含全部品牌数据的 ts 类型
export type Records = Trademark[]

// 获取的已有所有品牌数据的 ts 类型
export interface TrademarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
