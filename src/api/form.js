import request from '@/utils/request'
export function getFormList(applicantId, reviewerId, pageNum, pageSize) {
  return request({
    url:'form/getFormList',
    data: {
      applicantId,
      reviewerId,
      pageNum,
      pageSize
    },
    method:'post'
  })
}
