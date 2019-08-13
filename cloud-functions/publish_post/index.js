publish 页面

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
