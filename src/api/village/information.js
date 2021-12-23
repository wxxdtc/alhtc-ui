import request from '@/utils/request'

 // 查询信息列表
 export function listInformation(query) {
   return request({
     url: '/village/information/list',
     method: 'get',
     params: query
   })
 }

 // 查询信息详细
 export function getInformation(informationId) {
   return request({
     url: '/village/information/' + informationId,
     method: 'get'
   })
 }

 // 新增信息
 export function addInformation(data) {
   return request({
     url: '/village/information',
     method: 'post',
     data: data
   })
 }

 // 修改信息
 export function updateInformation(data) {
   return request({
     url: '/village/information',
     method: 'put',
     data: data
   })
 }

 // 删除信息
 export function delInformation(informationId) {
   return request({
     url: '/village/information/' + informationId,
     method: 'delete'
   })
 } 