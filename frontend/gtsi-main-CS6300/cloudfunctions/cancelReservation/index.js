// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;

    const { seatID, start } = event;

    const db = cloud.database();
    const _ = db.command;

    // step 1: remove from user's bookedSeat record
    await db.collection('users').where({
        openid: openid
    }).update({
        data: {
            bookedSeat: _.pull({
                seatID: _.eq(seatID),
                startTime: _.eq(start)
            })
        }
    });

    // step 2: remove from seat's status
    await db.collection("seat").doc(seatID).update({
        data: {
            status: _.pull(start)
        }
    });

    return {
        code: 200,
        message: "已取消预约"
    };
}