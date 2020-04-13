/**
 * 支付相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 判断用户是否登录
 */
function payOrder(data) {
  return new Promise(function (resolve, reject) {
    util.myrequest("balance_change", data, "POST").then(res => {
        console.log(res) // 等后台接口
      }, err => {
        console.log(err)
      })
  })
}

module.exports = {
  payOrder,
};

