import request from '@/utils/request'

 // 查询信息列表
 export function listInfo(query) {
   return request({
     url: '/village/info/list',
     method: 'get',
     params: query
   })
 }

 // 查询信息详细
 export function getInfo(infoId) {
   return request({
     url: '/village/info/' + infoId,
     method: 'get'
   })
 }

 // 新增信息
 export function addInfo(data) {
   return request({
     url: '/village/info',
     method: 'post',
     data: data
   })
 }

 // 修改信息
 export function updateInfo(data) {
   return request({
     url: '/village/info',
     method: 'put',
     data: data
   })
 }

 // 删除信息
 export function delInfo(infoId) {
   return request({
     url: '/village/info/' + infoId,
     method: 'delete'
   })
 } 