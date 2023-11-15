// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const {
        bookID
    } = event;

    const db = cloud.database()
    const res = await db.collection('books').doc(bookID).update({
        data: {
            isbn: this.data.isbn,
            title: this.data.title,
            author: this.data.author,
            edition: this.data.edition,
            tags: this.data.selectedTags
        }
    })
    console.log("res", res);


    return res.data
}