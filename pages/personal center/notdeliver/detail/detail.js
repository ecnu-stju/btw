const util = require('../../../../utils/util.js');  
const app = getApp()
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

  //图片点击事件
  PreImage: function (event) {
    // console.log(event)
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      // current: src, // 当前显示图片的http链接
      urls: this.data.imageUrls
      // ["http://tmp/wxd98e7d772df2ef2c.o6zAJs4F3RGEF5PxAZMpWJZkC78k.Jppb2dxsAuOcd3e611627bd9ea259f32b9592a748fe8.jpeg"] // 需要预览的图片http链接列表
    })
  },
  refreshComment: function(postid){
    var that = this
    wx.cloud.callFunction({
      name: 'get_comment_for_post',
      data: {
        postid: postid,
      },
      success: function (res) {
        console.log(res.result.comment_list.data)
        var commentList = res.result.comment_list.data
        for (let i = 0; i < commentList.length; i++) {
          commentList[i].time = util.formatTime(new Date(commentList[i].time))
        }
        that.setData({
          comments: res.result.comment_list.data,
          commentLoaded: true
        })
        that.checkLoadFinish()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    /*为什么失败了，小程序端
    const db = wx.cloud.database({
      env: "ecnu-project-50330f"///ecnu-project-50330f、rss-hub-test-898ca3
    })
    const _ = db.command
    const collection = db.collection('post_collection')
    const record = collection.doc(options.postid)
    record.get({
      success: function (res) {
        console.log(res.data)
      }
    })
    */

    // 更新浏览次数，TODO本地如何及时同步
    wx.cloud.callFunction({
      name: 'update_watch_count',
      data: {
        postid: options.postid
      },
      success: function (res) {
        console.log('更新浏览次数成功')
      }
    })

    // 获取内容
    wx.cloud.callFunction({
      // 云函数名称 
      name: 'get_post_detail',
      data: {
        postid: options.postid
      },
      success: function (res) {
        var postdetail = res.result.postdetail.data[0];
        postdetail.publish_time = util.formatTime(new Date(postdetail.publish_time))
        that.setData({
          detail: postdetail,
          contentLoaded: true
        })
        that.downloadImages(postdetail.image_url)
      },
      fail: console.error
    })
    ///wx.hideLoading()



    this.setData({
      postid: options.postid
    })

    // 获取评论
    this.refreshComment(options.postid)

  },
  
  /**
   * 从数据库获取图片的fileId，然后去云存储下载，最后加载出来
   */
  downloadImages: function(image_urls){
    var that = this
    if(image_urls.length == 0){
      that.setData({
        imageUrls: [],
        imagesLoaded: true
      })
    } else {
      var urls = []
      for(let i = 0; i < image_urls.length; i++) {
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

  scan_confirm: function () {
    var that = this

    wx.scanCode({
      success: function(res)
      {
        // 跳转页面
        // console.log(res['result'])
        var scanCod = res['result'];
        //增加update条码值，进去一层再扫码！ok 
        wx.showModal({
          title: '提示',
          content: '是否确定扫码结果（并上传）：'+res['result'],
          success (res) {
          if (res.confirm) {
          console.log('用户点击scan结果确定')
          //调用发送评论云函数
    if (res['result']=="") {
      wx.showToast({
        image: '../../images/warn.png',
        title: '评论不能为空',
      })
      return
    }
    wx.showLoading({
      title: '发布中',
    })
    console.log(res['scanCod']);
    
    wx.cloud.callFunction({
      // 云函数名称 
      name: 'add_comment',
      data: {
        postid: that.data.detail._id,
        openid: app.globalData.openId,
        //原轮子作者埋坑了，本地该值本为undefined，云函数里用的是自动产生的，现已基本将本地坑在postlist页的云函数里集成填了，但仍有缺憾
        name: app.globalData.wechatNickName,
        avatarUrl: app.globalData.wechatAvatarUrl,
        content: "条码号 \t"+scanCod
      },
      success: function (res) {
        
        wx.hideLoading()
        // this that 很迷
        that.refreshComment(that.data.postid)
        // that.setData({
        //   comment_value: ''
        // })
        //更新状态编号
        wx.cloud.callFunction({
          name: 'update_status',
          data: {
            postid: that.data.detail._id,
            deliverer_id: app.globalData.openId
          },
          success: function (res) {
            console.log('更新状态编号成功')
            wx.showToast({
              // image: '../../images/warn.png',
              title: '上传条码号成功!',
              duration: 1000,
              // success
            })
            setTimeout(function () {
            wx.redirectTo({
              url: '/pages/personal center/deliver/detail/detail?postid=' + that.data.postid,
            })}
            ,1000)
            //console.log(that.data.postid)
          }
        })
        //
      }
    })
          } 
          else if (res.cancel) {
          console.log('scan结果取消')
          }
          }
        })
        // wx.navigateTo({
        //   url: '../datain/datain?res='+res['result']
        // })
      },
      fail: function(res){
        var error = '扫码失败'
        // wx.navigateTo({
        //   url: '../error/error?error='+error,
        // })
      }
    })

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

  },

  sendComment: function() {
    var that = this
    if (this.data.comment.length < 1) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '评论不能为空',
      })
      return
    }
    wx.showLoading({
      title: '发布中',
    })
    wx.cloud.callFunction({
      // 云函数名称 
      name: 'add_comment',
      data: {
        postid: this.data.detail._id,
        openid: app.globalData.openId,
        //原轮子作者埋坑了，本地该值本为undefined，云函数里用的是自动产生的，现已基本将本地坑在postlist页的云函数里集成填了，但仍有缺憾
        name: app.globalData.wechatNickName,
        avatarUrl: app.globalData.wechatAvatarUrl,
        content: this.data.comment
      },
      success: function (res) {
        
        wx.hideLoading()
        // this that 很迷
        that.refreshComment(that.data.postid)
        that.setData({
          comment_value: ''
        })
      }
    })

  },
  onClick: function (e) {
    // console.log(e.currentTarget.dataset.postid)
    ///
    wx.showModal({
      title: '提示',
      content: '是否确认抢单并抵押0.1积分？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            image: '../../images/warn.png',
            title: '抢单成功!',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          // wx.navigateTo({
          //   url: '../postlist/postlist?postid=' + e.currentTarget.dataset.postid,
          // }) //这里不该有，是用于postlist进detail时、传那一单的id
        }
      }
    })

  },
  input: function (e) {//就是this.deta.comment_value应该
  ///区别与联系：前面页面首次加载时把这个comment_value置空了，以保证不会显示上次的残留，下面读取的也就必然是刚刚输入的新评论
    if (e.detail.value.length >= this.data.maxContentLength) {
      wx.showToast({
        title: '已达到最大字数限制',
      })
    }
    this.setData({
      comment: e.detail.value
    })
  },
  checkLoadFinish: function() {
    if (this.data.contentLoaded
          && this.data.imagesLoaded
          && this.data.commentLoaded){
      wx.hideLoading()
    }
  }

})
