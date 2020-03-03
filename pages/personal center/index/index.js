const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
// const user = require('../../../services/user.js');
const app = getApp();

Page({
  data: {
    userInfo: {},
    showLoginDialog: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数

// function myrequest(operation, data={}, method="GET") {
    //   // 向法商楼发送一个不管死活的请求
    //   // operation是个字符串，代表你想干的操作
    //   // makeUrl把operation变成url
    //   // makeName把operation变成云函数名称
    //   util.request("https://www.google.com.hk/", data, method).then(res => {
    //     console.log("法商楼ok")
    //     console.log(res)
    //   }).catch(err => {
    //     console.log("法商楼gg")
    //     console.log(err)
    //   })
    //   return new Promise((res, rej) => {
    //     wx.cloud.callFunction({
    //       name: 'get_post_list',
    //     }).then(r => res(r)).catch(r => rej(r))})
    //   }

    wx.cloud.init({
      traceUser: true
    })

    app.myrequest("ceshi").then(res => {
      console.log("云ok")
    }).catch(err => {
      console.log(err)
    })

    function f1(){
      return new Promise((resolve, reject) => {
        setTimeout(() => {resolve("成功1000")}, 1000)
      })
    }
    function ff1(){
      return new Promise((res, rej)=>{
        f1().then(r=>res(r))
      })
    }
    // ff1().then(res=>console.log(res))
    function f2(){
      return new Promise((resolve, reject) => {
        setTimeout(() => {resolve("成功2000")}, 5000)
      })
    } 
    // function f3(){
    //   return new Promise((resolve, reject) => {
    //     reject("失败3")
    //   })
    // } 

    // f1().then((res, rej) => {console.log(res)})
    // f2().then((res, rej) => {console.log(res)})
    // f3().then((res, rej) => {console.log(res)})

    // f1().then((res, rej) => {
    //   console.log(res)
    // }).then(f2).then((res, rej) => {
    //   console.log(res)
    // }).then(f3)
  },
  onReady: function() {

  },
  onShow: function() {
    // this.setData({
    //   userInfo: app.globalData.userInfo,
    // });
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    console.log(haha)
  },

  onUserInfoClick: function() {
    if (wx.getStorageSync('token')) {

    } else {
      this.showLoginDialog();
    }
  },

  showLoginDialog() {
    this.setData({
      showLoginDialog: true
    })
  },

  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody () {
    // 阻止冒泡
  },

  onWechatLogin(e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    util.login().then((res) => {
      return util.request(api.AuthLoginByWeixin, {
        code: res,
        userInfo: e.detail
      }, 'POST');
    }).then((res) => {
      console.log(res)
      if (res.errno !== 0) {
        wx.showToast({
          title: '微信登录失败',
        })
        return false;
      }
      // 设置用户信息
      this.setData({
        userInfo: res.data.userInfo,
        showLoginDialog: false
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
      wx.setStorageSync('token', res.data.token);
    }).catch((err) => {
      console.log(err)
    })
  },

  onOrderInfoClick: function(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function(event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})