const util = require('../../utils/util.js');
const app = getApp()
// pages/personal center/orderdetail/orderdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentLoaded: false,
    imagesLoaded: false,
    commentLoaded: false,
    detail: {},
    imageUrls: [],
    inputBoxShow: true,
    maxContentLength: 300,
    comment: '',
    comments: [],
    postid: '',
    comment_value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this

    // 获取内容
    wx.cloud.callFunction({
      // 云函数名称 
      name: 'get_userorder_detail',
      data: {
        postid: options.postid  //postid是否要改
      },
      success: function (res) {
       //postdetail==>userdetail
        var userdetail = res.result.userdetail.data[0];    
        userdetail.publish_time = util.formatTime(new Date(userdetail.publish_time))
        that.setData({
          detail: userdetail,
          contentLoaded: true
        })
        that.downloadImages(userdetail.image_url)
      },
      fail: console.error
    })
    ///wx.hideLoading()



    this.setData({
      postid: options.postid
    })

    // 获取评论
    //this.refreshComment(options.postid)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})