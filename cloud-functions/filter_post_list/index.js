// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "ecnu-project-50330f" //初始化需要的东西（固定
})

// 云函数入口函数
exports.main = async (event, context) => { //已经进入云函数
  const wxContext = cloud.getWXContext()
  

  return {
    postlist: await db.collection('post_collection').where({
      blockNum: event.blockNum,//event. 本地的楼号名称
      _id: true,
      author_name: true,
      content: true,
      title: true,
      watch_count: true,
      update_time: true
    }).orderBy('update_time', 'desc').get(),

  }
}