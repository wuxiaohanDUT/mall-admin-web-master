import request from '@/utils/request'
export function getProjectDetail(formId) {
  return request({
    url:'project/getProjectDetail',
    data: {
      formId
    },
    method:'post'
  })
}

export function getPaperDetail(formId) {
  return request({
    url:'project/getPaperDetail',
    data: {
      formId
    },
    method:'post'
  })
}
