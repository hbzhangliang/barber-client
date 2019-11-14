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
export function departList(data) {
  return request({
    url: '/depart/list',
    method: 'post',
    data
  })
}
export function departGet(data) {
  return request({
    url: '/depart/get',
    method: 'post',
    data
  })
}
export function departSave(data) {
  return request({
    url: '/depart/save',
    method: 'post',
    data
  })
}
export function departDel(data) {
  return request({
    url: '/depart/del',
    method: 'post',
    data
  })
}
