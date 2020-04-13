const util = require('../../../../utils/util.js');  
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url:[],//付款码图,考虑与下面imageUrls直接连通显示？
    clould_img_id_list: [],
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

  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 3, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 3) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            if (img_url.length >= 3) {
              wx.showToast({
                image: '../../images/warn1.png',
                title: '图片过多'
              })
              that.setData({
                hideAdd: 1
              })
              break
            }
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
        }
      }
    })
  },

  publish: function(img_url_ok) {
    var that = this
    console.log(that.data.postid);
    
    wx.cloud.init({
      traceUser: true
    })

    wx.cloud.callFunction({
      name: 'update_post',
      data: {
        payQR:1,
        postid:that.data.postid,//以下为新发布时所需
        openid: app.globalData.openId,// 不是直接含在 event 里的？这个云端其实能直接拿到
        author_name: app.globalData.wechatNickName,
        author_avatar_url: app.globalData.wechatAvatarUrl,
        //调用这两个都是用全局变量的
        content: this.data.content,
        image_url: img_url_ok,//本地要显示图像，图像是一个链接的形式，链接是可以直接得到的，不用 event 之类的来装
        //云函数报错能力不佳，实际上下面的参数明显过多偏差了，导致调用失败
        // // x:'2',
        // pickup_code: this.data.address.Pickup_code,
        // id: this.data.address.id,
        // deliverer_id: this.data.address.deliverer_id,  //增加记录送货者的id
        // // city_id: this.data.address.city_id,
        // address: this.data.address.address,
        // //两个 address 不歧义，第二个 address 是在第一个address 包里面的，外面看不到
        // // full_region: this.data.address.full_region,
        // //full_region: this.data.address.blockNum,
        // blockNum: this.data.address.blockNum,
        // author_parcel_name: that.data.address.author_parcel_name,
        // mobile: this.data.address.mobile,
        // //is_default: this.data.address.is_default,
        // note: this.data.address.note,
        // publish_time: "",
        // update_time: ""//目前让服务器自己生成这两个时间
      },
      success: function (res) {
        wx.hideLoading()//严谨地，前面加个hideload
        wx.showToast({
          icon: 'success',
          title: '上传成功!',//应该加个点5状态？
          duration: 2000
        })
         console.log(res)
        // 强制刷新，这个传参很粗暴
        var pages = getCurrentPages();             //  获取页面栈
        var prevPage = pages[pages.length - 2];    // 上一个页面
        prevPage.setData({
          update: true
        })
        setTimeout(function (){
          wx.navigateBack({
            delta: 1
          })//此页需要吗？
        },500)
      },
      fail: function(res) {
        console.log(res)
        that.publishFail('发布失败')
      }
    })
  },
  send: function () {

    var that = this;

    wx.showModal({
      title: '提示',
      content: '是否确认上传收款码？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.showLoading({
            title: '发布中',
            mask: true
          })

          let img_url = that.data.img_url;
          let img_url_ok = [];
          //由于图片只能一张一张地上传，所以用循环
          if (img_url.length == 0) {
            // that.publish([])
            return
          }
          for (let i = 0; i < img_url.length; i++) {
            var str = img_url[i];
            var obj = str.lastIndexOf("/");
            var fileName = str.substr(obj + 1)
            console.log(fileName)
            wx.cloud.uploadFile({
              cloudPath: 'post_images/' + fileName,//必须指定文件名，否则返回的文件id不对
              filePath: img_url[i], // 小程序临时文件路径
              success: res => {
                // get resource ID: 
                console.log(res)
                //把上传成功的图片的地址放入数组中
                img_url_ok.push(res.fileID)

                //如果全部传完，则可以将图片路径保存到数据库

                if (img_url_ok.length == img_url.length) {
                  console.log(img_url_ok)
                  that.publish(img_url_ok)

                }

              },
              fail: err => {
                // handle error
                that.publishFail('图片上传失败')
                console.log('fail: ' + err.errMsg)
              }
            })
          }  
          
          // wx.showToast({
          //   icon: 'success',
          //   title: '上传成功!',//应该加个点5状态？
          //   duration: 2000
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
          // wx.navigateTo({
          //   url: '../publish/publish?postid=' + e.currentTarget.dataset.postid,
          // }) //这里不该有，是用于postlist进detail时、传那一单的id
        }
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
