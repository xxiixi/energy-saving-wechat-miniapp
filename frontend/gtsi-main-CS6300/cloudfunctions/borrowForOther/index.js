// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    // const openid = wxContext.OPENID;

    const {
        bookID,
        gtid,
        email
    } = event;
    const db = cloud.database();
    const _ = db.command;

    const condition = gtid === "" ? {
        email: email
    } : {
        gtid: gtid
    };

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
    const userRes = await db.collection('users').where(condition).get();

    console.log("userRes", userRes);

    if (userRes.data.length === 0) {
        return {
            code: false,
            message: "This user is not exist."
        }
    }

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
            status: userRes.data[0].openid
        }
    });

    // step 4: add book record in user's entry
    const currentDate = new Date();
    await db.collection('users').where(condition).update({
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