// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const {
        title,
        author,
        name,
        affiliation,
        program
    } = event;

    const db = cloud.database();

    const res = await db.collection("request").add({
        data: {
            title,
            author,
            name,
            affiliation,
            program,
            date: new Date()
        }
    });

    return res._id;
}