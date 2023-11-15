// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;

    const db = cloud.database();
    const _ = db.command;

    const res = await db.collection("users").where({
        openid: openid
    }).field({
        bookedSeat: true
    }).get();
    
    const seatIDs = res.data[0].bookedSeat.map(item => item.seatID);

    const seatInfo = await db.collection("seat").where({
        _id: _.in(seatIDs)
    }).get();

    console.log("seatIDs", seatIDs);
    console.log("seatInfo", seatInfo);

    return seatInfo.data;
}