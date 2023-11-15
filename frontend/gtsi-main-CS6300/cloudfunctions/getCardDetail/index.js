// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const db = cloud.database();
    const _ = db.command;
    const {_id} = event;
    console.log(_id)
    const res = await db.collection('cardlist').where({
        _id:_id
    }).get();
    return res.data;
}