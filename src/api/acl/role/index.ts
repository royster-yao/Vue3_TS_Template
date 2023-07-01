// 角色管理模块的接口
import request from '@/utils/request'
import type { MenuResponseData, RoleData, RoleResponseData } from './type'
// 枚举地址
enum API {
  // 获取全部职位的接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增岗位的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新已有的职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部的菜单与按钮的数据
  ALLPERMISSION = '/admin/acl/permission/toAssign/',
  // 给相应的职位分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  // 删除已有的职位
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}

/**
 * 获取全部的角色
 * @param page 页码
 * @param limit 一页的条数
 * @param roleName 关键字
 * @returns 根据条件获取的角色数据
 */
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

/**
 * 添加职位与更新已有的职位
 * @param data 添加或更新的参数
 * @returns 是否跟新或添加成功
 */
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

/**
 * 获取全部菜单与按钮权限的数据
 * @param roleId 根据id获取相应的是否拥有权限
 * @returns 返回获取到的数据
 */
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION + roleId)

/**
 * 给相应的职位下发权限
 * @param roleId 职位Id
 * @param permissionId 权限Id的数组
 * @returns 是否下发权限成功
 */
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )

/**
 * 删除已有的职位
 * @param roleId 需要删除职位的ID
 * @returns 是否删除成功
 */
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)
