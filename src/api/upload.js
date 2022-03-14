import request from '@/utils/request'
export function addFormImg(data) {
  return request({
    url:'form/addFormImg',
    data:data,
    method:'post'
  })
}

export function getFormImg(formId) {
  return request({
    url:'form/getFormImg',
    data:{
      formId
    },
    method:'post'
  })
}

export function addProjectForm(applicantId, projectTypeId, awardLevel, participantIds, instructorNames, achieveTime, formType, contentDescription) {
  return request({
    url: 'form/addProjectForm',
    data: {
      applicantId,
      projectTypeId,
      awardLevel,
      participantIds,
      instructorNames,
      achieveTime,
      formType,
      contentDescription
    },
    method: 'post'
  })
}

export function addPaperForm(applicantId, participantIds, publicationTime, formType, contentDescription, publicationPeriodical, paperName, collection) {
  return request({
    url: 'form/addPaperForm',
    data: {
      applicantId,
      participantIds,
      publicationTime,
      formType,
      contentDescription,
      publicationPeriodical,
      paperName,
      collection
  },
    method: 'post'
  })
}
