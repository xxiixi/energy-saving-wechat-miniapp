// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    const db = cloud.database();

    const user = await db.collection('users').where({
        openid: openid,
        login: true
    }).field({
        borrowRecords: false
    }).limit(1).get();
    return user;
}