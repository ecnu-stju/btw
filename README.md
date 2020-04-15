# 关于知识产权和开源项目使用情况  
（本项目在确定开源协议之前新增加了私有库分支，依照协议使用过以下开源项目成果：）  
nideshop-- by tumobi(tumobi@163.com)（MIT协议，https://github.com/tumobi/nideshop）  
wux-weapp（MIT协议，https://github.com/wux-weapp/wux-weapp）  
RssHub（https://github.com/vimerzhao/RssHub）：
（援引自开源项目RssHub：）
# 预览

# TODO&DONE
- [x] 基础功能：浏览帖子列表、发表帖子、浏览帖子详情并支持文字评论。[【小程序+云开发】实战：一天搭建小型论坛
](https://segmentfault.com/a/1190000017171840)
- [ ] 系统学习下JS、CSS，优化交互、UI和逻辑（分页加载）。
- [ ] 个人帐号体系，支持我的帖子、我的收藏等，数据库优化。
- [ ] 尝试独立后端，突破目前云开发的限制。

## new todos
### 后端
- [ ] 限制认证之后才可发帖？
- [ ] 快递单楼号变量改为交接大致区域（号）
- [ ] 通过update-status返回值是否为1解决两人同时抢单的先后问题

### 前端
- [ ] 进入 publish 页面时有询问“是否确认抢单”（删除很没有必要）
- [ ] bug：在 publish 页面中“短信粘贴”输入后，再修改前面的已填信息时，任一条已填信息删除一个字，后面“短信粘贴”处的所有内容被动清空
- [ ] bug：postdetail 页面的“备注”并没有显示publish 页“短信粘贴”的内容，“投递区域”同不显
- [ ] 功能add？：postdetail 页面的“投递区域”(个人信息)自动生成