// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const {
        image,
        isbn,
        code,
        title,
        author,
        edition,
        tags
    } = event;

    const db = cloud.database();
    const $ = db.aggregate;

    // step 1: look up for the latest book code
    const codeRes = await db.collection('books').where({
        code: db.RegExp({
            regexp: code, // code is one of ['A', 'B', 'C']
        })
    }).orderBy('createdAt', 'desc').limit(1).get();

    let maxCode = codeRes.data[0].code;
    maxCode = maxCode.substring(1);
    maxCode = maxCode.split('-')[0];
    maxCode = parseInt(maxCode) + 1;

    console.log("newly generated book code", maxCode);

    // step 2: add book
    try {
        const res = await db.collection('books').add({
            data: {
                image,
                isbn,
                code: code + maxCode,
                title,
                author,
                edition,
                tags,
                status: '',
                createdAt: new Date()
            }
        });
        return res._id;
    } catch (err) {
        return null;
    }
}