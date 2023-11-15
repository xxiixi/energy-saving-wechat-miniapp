// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();
    const _ = db.command;

    const {
        bookType,
        bookTag,
        offset = 0
    } = event;

    let condition = {}
    if (bookType) {
        condition.code = db.RegExp({
            regexp: '^' + bookType
        });
    }
    if (bookTag) {
        condition.tags = _.elemMatch(_.eq(bookTag))
    }

    const res = await db.collection('books').where(condition).skip(offset).limit(30).get();
    return res;
}