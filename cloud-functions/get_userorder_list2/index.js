// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "ecnu-project-50330f"
})
const cmd = db.command
// 云函数入口函数
//s_number用来判定应该显示哪一状态的订单（是否可行）
exports.main = async (event, context) => {
  return {
    //userorder
    userorder_list: await db.collection('post_collection').where(cmd.or([
      {
        author_id: event.author_id  //author_id与当前授权用户id匹配
      },
      {
        deliverer_id: event.author_id
      }
    ])).orderBy('update_time', 'desc').get(),
  }
}

/*
*.field({
      _id: true,
      address: true,
      //author_avatar_url: true,//upload!!
      author_name: true,
      author_parcel_name: true,
      content: true,
      title: true,
      update_time: true
    }).where(_.or([
      {
        author_id: event.author_id,  //author_id与当前授权用户id匹配
      },
      {
        deliverer_id: event.user_name,//抢单用户id与当前用户id匹配
      }
    ]))
    */