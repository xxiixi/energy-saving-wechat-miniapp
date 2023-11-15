// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const openid = wxContext.OPENID;
    const {
        bookID
    } = event;

    const db = cloud.database();
    const _ = db.command;

    // step 1: delete book from user record
    const recordRes = await db.collection('users').where({
        openid: openid
    }).update({
        data: {
            borrowRecords: _.pull({
                bookID: bookID
            })
        }
    });

    // step 2: set book status to available
    const bookRes = await db.collection('books').doc(bookID).update({
        data: {
            status: ''
        }
    });

    console.log("recordRes", recordRes);
    console.log("bookRes", bookRes);

    return recordRes.stats.updated === 1 && bookRes.stats.updated === 1;
}