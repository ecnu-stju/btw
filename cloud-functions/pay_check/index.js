// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('加载云函数')

    // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
        // 获取内容，接下来用得到的两个id和status主要变量判断付钱还是加钱操作，抵押0.1之事先暂缓
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
        // that.downloadImages(postdetail.image_url)
      },
      fail: console.error
    })

    //接下来要判断积分如何变换。。。
    // switch(status){
    //   case '1':
    //     return {}
    // }

  return {//要返回支付成功与否
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

  // 本地调用的套路 
  // submitOrder: function () {
  //   if (this.data.addressId <= 0) {
  //     util.showErrorToast('请选择收货地址');
  //     return false;
  //   }
  //   util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
  //     if (res.errno === 0) {
  //       const orderId = res.data.orderInfo.id;
  //       pay.payOrder(parseInt(orderId)).then(res => {
  //         wx.redirectTo({
  //           url: '/pages/payResult/payResult?status=1&orderId=' + orderId
  //         });
  //       }).catch(res => {
  //         wx.redirectTo({
  //           url: '/pages/payResult/payResult?status=0&orderId=' + orderId
  //         });
  //       });
  //     } else {
  //       util.showErrorToast('下单失败');
  //     }
  //   });
  // } 