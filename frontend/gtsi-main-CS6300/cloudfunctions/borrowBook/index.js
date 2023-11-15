// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    const {
        bookID
    } = event;
    const db = cloud.database();
    const _ = db.command;

    console.log("openid", openid);
    console.log("bookID", bookID);

    // step 1: check if this book can be borrowed
    const bookRes = await db.collection('books').doc(bookID).get();
    if (bookRes.data.status !== '') {
        return {
            code: false,
            message: 'This book was already borrowed by others.'
        };
    }

    // step 2: check if current user is beyond borrow limit
    // student can borrow up to 8 books at once
    const userRes = await db.collection('users').where({
        openid: openid
    }).get();

    const user = userRes.data[0];
    const count = user.borrowRecords.length;
    if (count >= 8) {
        return {
            code: false,
            message: `You can only borrow up to 8 books at once.`
        }
    }

    // step 3: change book status
    await db.collection('books').doc(bookID).update({
        data: {
            status: openid
        }
    });

    // step 4: add book record in user's entry
    const currentDate = new Date();
    await db.collection('users').where({
        openid: openid
    }).update({
        data: {
            borrowRecords: _.push({
                bookID: bookID,
                borrowDate: currentDate,
                isRenewed: false,
            })
        }
    });

    return {
        code: true,
        message: 'Successfully borrowed.'
    };
}