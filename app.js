//app.js
const util = require('./utils/util.js');  
App({
  onLaunch: function () {

    var that = this
    wx.clearStorage()

  },

  makeUrl: function(operation){
    let url = operation
    url = "https://www.google.com.hk/" // 不翻墙的情况下，测试
    return url
  },
  
  makeName: function(operation){
    let name = operation
    name = "get_post_list" // 测试
    return name
  },
  
  myrequest: function(operation, data={}, method="GET") {
    // 向法商楼发送一个不管死活的请求
    // operation是个字符串，代表你想干的操作
    // makeUrl把operation变成url
    // makeName把operation变成云函数名称
    util.request(this.makeUrl(operation), data, method).then(res => {
      console.log("法商楼ok")
      console.log(res)
    }).catch(err => {
      console.log("法商楼gg")
      console.log(err)
    })
    return new Promise((res, rej) => {
      wx.cloud.callFunction({
        name: this.makeName(operation)
      }).then(r => res(r)).catch(r => rej(r))
    })
  },

  globalData: {
    userInfo: "StorageUserInfo",
    wechatNickName: '',
    wechatAvatarUrl: ''
  }
})