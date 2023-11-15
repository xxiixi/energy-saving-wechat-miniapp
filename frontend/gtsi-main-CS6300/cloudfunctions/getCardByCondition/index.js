// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();

    const {
        isJob, //false means activity
        
    } = event;
    let condition = {};
    if(isJob!=void 0){
        condition.isJob = isJob;
    }

    const res = await db.collection("cardlist").where(condition).get();
    return res.data;
}