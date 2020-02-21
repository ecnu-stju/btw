const util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentLoaded: false,
    imagesLoaded: false,
    //commentLoaded: false,
    detail: {},
    imageUrls: [],
    inputBoxShow: true,
    maxContentLength: 300,
    //comment: '',
    //comments: [],
    postid: '',
    //comment_value: ''
  },

//与postdetail比，应该不用显示评论？==>没有refreshcomment函数

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    //取消了更新浏览次数功能
    // 获取内容
    wx.cloud.callFunction({
      // 云函数名称 
      name: 'get_userorder_detail',
      data: {
        postid: options.postid 
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
   * 从数据库获取图片的fileId，然后去云存储下载，最后加载出来
   */
  downloadImages: function (image_urls) {
    var that = this
    if (image_urls.length == 0) {
      that.setData({
        imageUrls: [],
        imagesLoaded: true
      })
    } else {
      var urls = []
      for (let i = 0; i < image_urls.length; i++) {
        wx.cloud.downloadFile({
          fileID: image_urls[i],
          success: res => {
            // get temp file path
            console.log(res.tempFilePath)
            urls.push(res.tempFilePath)
            if (urls.length == image_urls.length) {
              console.log(urls)
              that.setData({
                imageUrls: urls,
                imagesLoaded: true
              })
              this.checkLoadFinish()
            }
          },
          fail: err => {
            // handle error
          }
        })

      }
    }
    this.checkLoadFinish()
  },

  checkLoadFinish: function () {
    if (this.data.contentLoaded
      && this.data.imagesLoaded) {
      wx.hideLoading()
    }
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