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
  switch(event.page_status){
    case 'all':
      return {
        userorder_list: await db.collection('post_collection').where(cmd.or([
          {
            author_id: event.author_id  //author_id与当前授权用户id匹配
          },
          {
            deliverer_id: event.author_id
          }
        ])).orderBy('update_time', 'desc').get(),
      };
    case 'notreceive': 
      return {
        userorder_list: await db.collection('post_collection').where(cmd.or([
          {
            author_id: event.author_id,
            status:4
          },
          {
            author_id: event.author_id,
            status: 3
          },
          {
            author_id: event.author_id,
            status: 2
          },
          {
            deliverer_id: event.author_id,
            status: 4
          }
        ])).orderBy('update_time', 'desc').get(),
      };
    case 'deliver':
      return {
        userorder_list: await db.collection('post_collection').where({
            deliverer_id: event.author_id,
            status: 3
        }).orderBy('update_time', 'desc').get(),
      };
    case 'notdeliver':
      return {
        userorder_list: await db.collection('post_collection').where({
            deliverer_id: event.author_id,
            status: 2
        }
         ).orderBy('update_time', 'desc').get(),
      };
    default :
      console.log("default");
  }
  

}