// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const _ = db.command;
    let {
        searchValue
      } = event;
      const res = await db.collection("cardlist").where(
        _.or({
          title: db.RegExp({
            regexp: searchValue,
            options: 'i',
          })
        }, {
            description: db.RegExp({
              regexp: searchValue,
              options: 'i',
            })
          })
        ,
        {
            isJob:true
        }
      ).limit(100).get();

    return res;
}