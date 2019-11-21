import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/account/login',
    method: 'post',
    data
  })
}

export function enterCorp(data) {
  return request({
    url: '/account/enter-corp',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/account/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/account/logout',
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
