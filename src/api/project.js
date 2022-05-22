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

export function getProjectDetailByProjectId(projectId) {
  return request({
    url:'project/getProjectDetailByProjectId',
    data: {
      projectId
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

export function getPapersByUserId(userId, pageNum, pageSize) {
  return request({
    url:'project/getPapersByUserId',
    data: {
      userId,
      pageNum,
      pageSize
    },
    method:'post'
  })
}
