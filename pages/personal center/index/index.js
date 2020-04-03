const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
// const user = require('../../../services/user.js');
const app = getApp();

Page({
  data: {
    userInfo: {},
    showLoginDialog: false,
    avt: "",//这里直接调app.globalData.似乎无效/还未初始化
  },
  onLoad: function(options) {
    // console.log(app.globalData.wechatAvatarUrl)
    this.setData(
      { 
        // userInfo: { nickname: app.globalData.wechatNickName },
        avt: app.globalData.wechatAvatarUrl
      }
    )
    // console.log(this.data.avt)

    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {

  },
  onShow: function() {

    console.log(app.globalData.openId)//缺点：刚进来点太快则没法显示

    // this.setData({
    //   userInfo: app.globalData.userInfo,
    // });
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
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
    var that = this

    wx.showLoading({
      title: '正在认证中',
      duration: 4800,
      mask: true,
      success: function () {
        // console.log('haha');
        setTimeout(function () {
          //要延时执行的代码
          that.setData(
            {
              userInfo: { nickname: app.globalData.wechatNickName },
              showLoginDialog: false
              // avt: app.globalData.wechatAvatarUrl
            }
          )
          // wx.switchTab({
          //   url: '/pages/postlist/postlist',
          // })
        }, 4000) //延迟时间
      }
    })

    return true
    // wx.switchTab({
    //   url: '/pages/postlist/postlist',
    // })
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