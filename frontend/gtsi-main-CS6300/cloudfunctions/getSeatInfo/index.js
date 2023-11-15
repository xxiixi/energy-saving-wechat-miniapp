// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const { seatID } = event;
    
    const db = cloud.database();
    const res = await db.collection('seat').doc(seatID).get();

    return res.data;
}