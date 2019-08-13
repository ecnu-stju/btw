// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "ecnu-project-50330f"
})

exports.main = async (event, context) => {
  try {
    return await db.collection('post_collection').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        img_url: event.img_url,
        //this.data指这个页面的数据，所以用在本地页面，event 用在云函数
        content: event.content,
        author_id: event.userInfo.openId,//特例
        author_name: event.author_name,
        author_avatar_url: event.author_avatar_url,
        pickup_code: event.pickup_code,
        publish_time: Date.now(),
        update_time: Date.now(),
        image_url: event.image_url,//有图像的都要用
        // update_time: event.update_time,
        // 最近一次更新时间，发布或者评论触发更新,目前用服务器端时间
        //以上基本是每个页面都需要的
        watch_count: 1,//浏览数
        id: event.address.id,
        city_id: event.address.city_id,
        address: event.address.address,
        //两个 address 不歧义，第二个 address 是在第一个address 包里面的，外面看不到
        full_region: event.address.full_region,
        author_parcel_name: event.address.author_parcel_name,
        mobile: event.address.mobile,
        is_default: event.address.is_default,

      }
    })
  } catch (e) {
    console.error(e)
  }
}
