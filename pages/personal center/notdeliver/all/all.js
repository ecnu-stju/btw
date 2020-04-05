// pages/posts/posts.js
import { $wuxFilterBar } from '../../../../components/wuxfilterbar';
const util = require('../../../../utils/util.js');  

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * items: [
      {
        type: 'filter',
        label: '筛选',
        value: 'filter',
        children: [
          {
            type: 'checkbox',
            label: '交接区域（复选）',
            value: 'query',
            children: [{
              label: '本科1-6号楼',
              value: '1',
            },
            {
              label: '本科7-16号楼',
              value: '2',
            },
            {
              label: '本科19-22号楼',
              value: '3',
            },
            {
              label: '图书馆',
              value: '4',
            },
            {
              label: '法商楼',
              value: '5',
            },
            {
              label: '其他',
              value: '6',
            },
            
            ],
          },
          {
            type: 'checkbox',
            label: '交接时间（复选）',
            value: 'query',
            children: [{
              label: '10时-13时',
              value: '1',
            },
            {
              label: '13时-16时',
              value: '2',
            },
            {
              label: '16时-19时',
              value: '3',
            },
            {
              label: '19时-22时',
              value: '4',
            },
            
            ],
          },
          {
            type: 'checkbox',
            label: '快件大小（复选）',
            value: 'query',
            children: [{
              label: '小件',
              value: '1',
            },
            {
              label: '中件',
              value: '2',
            },
            {
              label: '大件',
              value: '3',
            },
            
            ],
          },
          {
            type: 'checkbox',
            label: '类型（开发中）',
            value: 'query',
            children: [{
              label: '运动',
              value: '1',
            },
            {
              label: '游戏',
              value: '2',
            },

            {
              label: '旅行',
              value: '4',
            },
            {
              label: '读书',
              value: '5',
            },


            {
              label: '其他',
              value: '9',
            },
            ],
          }
        ],
        groups: ['001', '002', '003'],//判断元素是否同组
      },
    ],
    */

    postlist: null,
    update: false,// 用于发布动态后的强制刷新标记
    userInfo: {},
    hasUserInfo: false,// 会导致每次加载授权按钮都一闪而过，需要优化
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    page_status: 'notdeliver'
  },
  
  /**
   * 刷新数据
   */
  refresh: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    }),
    wx.cloud.init({
      traceUser: true
    })
    // console.log(app.globalData.openId)
    console.log('加载云函数')
    wx.cloud.callFunction({
      // 云函数名称
      // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
      //待修改云函数（与授权用户id匹配后显示）  模仿get_post_list
      name: 'get_userorder_list2',
      data: {
        author_id: app.globalData.openId,
        user_name: app.globalData.wechatNickName,
        page_status: this.data.page_status
      },
      success: function (res) {   //*
        //提取数据
        var self = res.result.userorder_list.data   //还是postlist吗？
        for (let i = 0; i < self.length; i++) {
          //console.log(self[i])
          self[i].update_time = util.formatTime(new Date(self[i].update_time))
        }
        wx.hideLoading()
        that.setData({
          userorder_list: self
        }),
        wx.stopPullDownRefresh()
      },
      fail(res) {
        console.log(res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 这个工具资瓷日子过滤吗？
    console.log(getApp().globalData.userInfo)

    wx.startPullDownRefresh()
    this.refresh()


    this.$wuxFilterBar = $wuxFilterBar.init({
      items: this.data.items,
      onChange: (checkedItems, items) => {
        console.log(this, checkedItems, items)
        const params = {}
        checkedItems.forEach((n) => {
          if (n.value === 'filter') {
            console.log("选中的标题内容为：" + n.value);
            n.children.filter((n) => n.selected).forEach((n) => {
              if (n.value === 'query') {
                console.log("选中的具体内容为：" + n.value);

                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                params.query = selected;
                var arr = params.query;
                var newarr = arr.split(" ");
                console.log(typeof params.query);
                console.log("最终选中的内容为：" + newarr);
              }
            })
          }
        })
      },
    })


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
    console.log("notdeliver.js - onShow")
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

  userInfoAuthorize: function () {
    var that = this
    console.log('authorize')
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 存储用户信息
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo.nickName)
              console.log(util.formatTime(new Date()))

              wx.setStorage({
                key: app.globalData.userInfo,
                data: res.userInfo,
              })
              app.globalData.wechatNickName = res.userInfo.nickName
              app.globalData.wechatAvatarUrl = res.userInfo.avatarUrl
            }
          })
        } else { // 跳转到授权页面 
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
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
      content: '是否确认进入详情页面？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../detail/detail?postid=' + e.currentTarget.dataset.postid,
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