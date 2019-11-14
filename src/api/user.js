import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function departListAll() {
  return request({
    url: '/depart/list-all',
    method: 'post'
  })
}
export function departList(pageParams) {
  return request({
    url: '/depart/list',
    method: 'post',
    pageParams
  })
}
export function departGet(params) {
  return request({
    url: '/depart/get',
    method: 'post',
    params
  })
}
export function departSave(bean) {
  return request({
    url: '/depart/save',
    method: 'post',
    bean
  })
}
export function departDel(params) {
  return request({
    url: '/depart/del',
    method: 'post',
    params
  })
}
