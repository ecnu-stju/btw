// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "ecnu-project-50330f"
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // await db.collection('post_collection').where({
  //   _id: event.postid
  // }).update({
  //   data: {
  //     status: event.status + 1,
  //     deliverer_id:event.deliverer_id,  //真正记录下送货者的id
  //   },
  //   success: function (res) {
  //     console.log(res.data)

  //   }
  // })

  // if (true) {
    await db.collection('post_collection').where({
      _id: event.postid
    }).update({
      data: {
        image_url: event.image_url,  
        //真正记录下送货者的id
      },
      success: function (res) {
        console.log(res)
  
      },
      fail: function (res) {
        console.log(res)
  
      }
    })
    return await db.collection('post_collection').where({
      _id: event.postid
    })
  // }
  
}