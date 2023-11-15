// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    const db = cloud.database();
    const _ = db.command;

    // step 1: get book records
    const recordRes = await db.collection('users').where({
        openid: openid
    }).field({
        role: true,
        borrowRecords: true
    }).get();

    const {
        role,
        borrowRecords
    } = recordRes.data[0];

    const bookIDs = borrowRecords.map(item => item.bookID);

    // step 2: get book information
    const bookRes = await db.collection('books').where({
        _id: _.in(bookIDs)
    }).get();

    // calculate dueDate and construct return value
    const res = [];
    for (const {
            bookID,
            borrowDate,
            isRenewed
        } of borrowRecords) {
        const book = bookRes.data.find(item => item._id === bookID);

        // student can borrow up to 80 days, others can borrow 160 days. Renew can extend 30 days.
        const dueDate = new Date(borrowDate.getTime());
        const days = (role === 'student' ? 80 : 160) + (isRenewed ? 30 : 0);
        dueDate.setDate(dueDate.getDate() + days);

        // change date object to printable string format
        const dueDateStr = `${dueDate.getFullYear()}-${dueDate.getMonth() + 1}-${dueDate.getDate()}`;
        const borrowDateStr = `${borrowDate.getFullYear()}-${borrowDate.getMonth() + 1}-${borrowDate.getDay()}`;

        res.push({
            bookID: bookID,
            borrowDate: borrowDateStr,
            isRenewed: isRenewed,
            dueDate: dueDateStr,
            title: book.title,
            status: dueDate > new Date() ? 'borrowing' : 'overdue'
        });
    }

    return res;
}