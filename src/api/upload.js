import request from '@/utils/request'
export function uploadForm(data) {
  return request({
    url:'/uploadForm',
    data:data,
    method:'post'
  })
}
