import request from '@/utils/request'



export function login(data) {return request({url:'/account/login',method: 'post',data})}
export function enterCorp(data) {return request({url: '/account/enter-corp',method: 'post',data})}
export function getInfo() {return request({url: '/account/info',method: 'post'})}
export function logout() {return request({url: '/account/logout', method: 'post'})}

export function accountListAll() {return request({url: '/sys-account/list-all', method: 'post'})}
export function accountList(data) {return request({url: '/sys-account/list', method: 'post', data})}
export function accountGet(data) {return request({url: '/sys-account/get', method: 'post', data})}
export function accountSave(data) {return request({url: '/sys-account/save', method: 'post', data})}
export function accountDel(data) {return request({url: '/sys-account/del', method: 'post', data})}

export function departListAll() {return request({url: '/depart/list-all', method: 'post'})}
export function departList(data) {return request({url: '/depart/list', method: 'post', data})}
export function departGet(data) {return request({url: '/depart/get', method: 'post', data})}
export function departSave(data) {return request({url: '/depart/save', method: 'post', data})}
export function departDel(data) {return request({url: '/depart/del', method: 'post', data})}

export function dictListAll() {return request({url: '/dict/list-all', method: 'post'})}
export function dictListChildren(data) {return request({url: '/dict/list-children', method: 'post', data})}
export function dictList(data) {return request({url: '/dict/list', method: 'post', data})}
export function dictGet(data) {return request({url: '/dict/get', method: 'post', data})}
export function dictSave(data) {return request({url: '/dict/save', method: 'post', data})}
export function dictDel(data) {return request({url: '/dict/del', method: 'post', data})}

export function barberListAll() {return request({url: '/barber/list-all', method: 'post'})}
export function barberList(data) {return request({url: '/barber/list', method: 'post', data})}
export function barberGet(data) {return request({url: '/barber/get', method: 'post', data})}
export function barberSave(data) {return request({url: '/barber/save', method: 'post', data})}
export function barberDel(data) {return request({url: '/barber/del', method: 'post', data})}

export function customerListAll() {return request({url: '/customer/list-all', method: 'post'})}
export function customerList(data) {return request({url: '/customer/list', method: 'post', data})}
export function customerGet(data) {return request({url: '/customer/get', method: 'post', data})}
export function customerSave(data) {return request({url: '/customer/save', method: 'post', data})}
export function customerDel(data) {return request({url: '/customer/del', method: 'post', data})}

export function vbarberListAll() {return request({url: '/v-barber/list-all', method: 'post'})}
export function vbarberList(data) {return request({url: '/v-barber/list', method: 'post', data})}
export function vbarberGet(data) {return request({url: '/v-barber/get', method: 'post', data})}
export function vbarberSave(data) {return request({url: '/v-barber/save', method: 'post', data})}
export function vbarberDel(data) {return request({url: '/v-barber/del', method: 'post', data})}

export function vcustomerListAll() {return request({url: '/v-customer/list-all', method: 'post'})}
export function vcustomerList(data) {return request({url: '/v-customer/list', method: 'post', data})}
export function vcustomerGet(data) {return request({url: '/v-customer/get', method: 'post', data})}
export function vcustomerSave(data) {return request({url: '/v-customer/save', method: 'post', data})}
export function vcustomerDel(data) {return request({url: '/v-customer/del', method: 'post', data})}
