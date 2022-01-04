import request from '@/utils/request'
export function getAllType() {
  return request({
    url: 'project/getAllType',
    method: 'post'
  })
}

export function deleteType(typeId) {
  return request({
    url: 'project/deleteType',
    method: 'post',
    data: {
      typeId
    }
  })
}

export function addType(typeName, awardLevel) {
  return request({
    url: 'project/addType',
    method: 'post',
    data: {
      typeName,
      awardLevel
    }
  })
}

export function updateRule(typeId, awardLevel, points) {
  return request({
    url: 'project/updateRule',
    method: 'post',
    data: {
      typeId,
      awardLevel,
      points
    }
  })
}

export function getRuleByTypeName(typeName, pageNum, pageSize) {
  return request({
    url: 'project/getRuleByTypeName',
    method: 'post',
    data: {
      typeName,
      pageNum,
      pageSize
    }
  })
}
