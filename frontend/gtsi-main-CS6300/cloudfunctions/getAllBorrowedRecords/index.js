// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const {
        offset = 0
    } = event;

    const db = cloud.database();
    const _ = db.command;

    // step 1: get borrowed books
    const books = await db.collection('books').where({
        status: _.neq("")
    }).skip(offset).get();

    // step 2: get borrowed users' information
    const users = await db.collection('users').where({
        openid: _.in(books.data.map(item => item.status))
    }).get();

    const userMap = {};
    for (let user of users.data) {
        userMap[user.openid] = user
    }

    const res = []
    for (let i = 0; i < books.data.length; i += 1) {
        // let bookId = books.data[i]._id;
        // // find borrowRecord in this user
        // let borrowRecords = userMap[books.data[i]["status"]].borrowRecords;
        // console.log(borrowRecords);
        // if(borrowRecords.length==0||borrowRecords==void 0) continue;
        // for(let j=0;borrowRecords.length;j++){
        //     if(borrowRecords[j]!=void 0&&bookId==borrowRecords[j].bookID){
        //         res.push({
        //             ...books.data[i],
        //             email: userMap[books.data[i]["status"]].email,
        //             gtid: userMap[books.data[i]["status"]].gtid,
        //             role: userMap[books.data[i]["status"]].role,
        //             borrowRecord:borrowRecords[j]
        //         });
        //     }
        // }
        res.push({
            ...books.data[i],
            email: userMap[books.data[i]["status"]].email,
            gtid: userMap[books.data[i]["status"]].gtid,
            role: userMap[books.data[i]["status"]].role,
            borrowRecord:userMap[books.data[i]["status"]].borrowRecords.filter(function(p){
                return p.bookID === books.data[i]._id;
            })[0]
        });
    }

    return res;
}