// pages/authorize/authorize.js
/**
 * 这段是否有比要
 */
import { $wuxFilterBar } from '../../../components/wuxfilterbar';
const util = require('../../../utils/util.js');

const app = getApp()        
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 刷新数据
   */
  refresh: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.init({
      traceUser: true
    })
    wx.cloud.callFunction({
      // 云函数名称
      // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
      //待修改云函数（与授权用户id匹配后显示）  模仿get_post_list
      name: 'get_userorder_list',    
      success: function (res) {   //*
        //提取数据
        var data = res.result.postlist.data   //还是postlist吗？
        for (let i = 0; i < data.length; i++) {
          // console.log(data[i])
          data[i].update_time = util.formatTime(new Date(data[i].update_time))
        }
        wx.hideLoading()
        that.setData({
          postlist: data
        })
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(1)

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
    var that = this
    console.log("posts.js - onShow")
    if (this.data.update) {
      wx.startPullDownRefresh()
      this.refresh()
      this.setData({
        update: false
      })
    }

    wx.getStorage({
      key: 'userInfo',
      success: function (res) {

      },
      fail: function () {
        that.userInfoAuthorize()
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
  
  onItemClick: function (e) {
    console.log(e.currentTarget.dataset.postid)
    ///
    wx.showModal({
      title: '提示',
      content: '是否查看订单详情？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../orderdetail/orderdetail?postid=' + e.currentTarget.dataset.postid,       //只用替换orderdetail？
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          // wx.requestPayment({
          //   timeStamp: '',
          //   nonceStr: '',
          //   package: '',
          //   signType: 'MD5',
          //   paySign: '',
          //   success(res) {
          //     console.log(res)},
          //   fail(res) { console.log(res) }
          // })
        }
      }
    })
    // wx.navigateTo({
    //   url: '../postdetail/postdetail?postid=' + e.currentTarget.dataset.postid,
    // })
  }
})