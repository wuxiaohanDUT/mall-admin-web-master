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

