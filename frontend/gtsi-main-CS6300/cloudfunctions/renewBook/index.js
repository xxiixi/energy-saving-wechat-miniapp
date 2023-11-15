// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    const {
        bookID
    } = event;

    console.log("openid", openid);
    console.log("bookID", bookID);

    const db = cloud.database();
    const res = await db.collection("users").where({
        openid: openid,
        "borrowRecords.bookID": bookID
    }).update({
        data: {
            "borrowRecords.$.isRenewed": true
        }
    })

    console.log("res", res);

    return res.stats.updated === 1;
}