// 用户管理模块的接口
import request from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from './type'
// 枚举地址
enum API {
  // 获取全部的已有的账号信息
  ALLUSER_URL = '/admin/acl/user/',
  // 添加一个新的用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新已有的用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部职位，以及当前账号用户职位的接口
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  // 给已有的用户分配角色的接口
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 批量删除的地址
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

/**
 * 获取用户账号信息的接口
 * @param page 获取的页数
 * @param limit 一页的条数
 * @returns 账号信息
 */
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
  )

/**
 * 添加用户与更新已有用户的接口
 * @param data 新增或修改的数据
 * @returns 是否修改或新增成功
 */
export const reqAddOrUpdateUser = (data: User) => {
  // 携带的参数有id: 更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    // 携带的参数没有id: 添加
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

/**
 * 获取全部的职位以及包含用户已有的职位的数据
 * @param userId 用户id
 * @returns 返回全部的职位以及包含用户已有的职位的数据
 */
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)

/**
 * 分配职位
 * @param data 分配的参数
 * @returns 是否分配成功
 */
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)

/**
 * 删除某一个账号
 * @param userId 需要删除的用户ID
 * @returns 是否删除成功
 */
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

// 批量删除
export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
