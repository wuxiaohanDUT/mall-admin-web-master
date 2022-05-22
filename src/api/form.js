import request from '@/utils/request'
export function getFormList(applicantId, reviewerId, pageNum, pageSize, isProject, isPaper, isChecking, isPassed, isFailed) {
  return request({
    url:'form/getFormList',
    data: {
      applicantId,
      reviewerId,
      pageNum,
      pageSize,
      isProject,
      isPaper,
      isChecking,
      isPassed,
      isFailed
    },
    method:'post'
  })
}

export function rejectForm(formId, userId) {
  return request({
    url:'form/rejectForm',
    data: {
      formId,
      userId
    },
    method:'post'
  })
}

export function agreeForm(formId, userId) {
  return request({
    url:'form/agreeForm',
    data: {
      formId,
      userId
    },
    method:'post'
  })
}

export function deleteForm(formId, userId) {
  return request({
    url:'form/deleteForm',
    data: {
      formId,
      userId
    },
    method:'post'
  })
}

export function getUserScoreRecords(userId, begin, end, pageNum, pageSize) {
  return request({
    url:'score/getUserScoreRecords',
    data: {
      userId,
      begin,
      end,
      pageNum,
      pageSize
    },
    method:'post'
  })
}

export function getUserPoints(begin, end, year, college) {
  return request({
    url:'score/getUserPoints',
    data: {
      begin,
      end,
      year,
      college
    },
    method:'post'
  })
}

export function exportUserPointsExcel(begin, end, year, college) {
  return request({
    url:'score/exportUserPointsExcel',
    data: {
      begin,
      end,
      year,
      college
    },
    method:'post'
  })
}
