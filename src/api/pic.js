import request from '@/utils/request'
export function getPics() {
  return request({
    url:'/getPics',
    method:'post'
  })
}
