// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    const { seatID, time } = event;

    const db = cloud.database();
    const _ = db.command;

    // step 1: check if user is qualified to book a seat
    // rule: user can only book once within a month
    const userBookedSeat = await db.collection('users').where({
        openid: openid
    }).field({
        bookedSeat: true
    }).get();

    let flag = false;
    for (const seat of userBookedSeat.data[0].bookedSeat) {
        if (Math.abs(seat.startTime - time) <= 24 * 60 * 60 * 1000 * 28) {
            flag = true;
            break;
        }
    }

    if (flag) {
        return {
            code: 400,
            message: "You can only book a seat once within a month"
        }
    }


    // step 2: append date to seat's booking array
    await db.collection("seat").doc(seatID).update({
        data: {
            status: _.push(time)
        }
    });

    // step 3: update user's booking information
    await db.collection("users").where({
        openid: openid
    }).update({
        data: {
            bookedSeat: _.push({
                seatID: seatID,
                startTime: time,
                period: 7,
                bookedAt: new Date().getTime()
            })
        }
    });

    return {
        code: 200,
        message: "Successfully book a seat"
    };
}