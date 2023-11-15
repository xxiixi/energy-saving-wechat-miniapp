// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    book
  } = event;

  const db = cloud.database();

  let code;
  if (book.code && book.code.includes('-')) {
    const parts = book.code.split('-');
    const codeSuffix = parseInt(parts[1]) + 1;
    code = parts[0] + '-' + codeSuffix;
  } else {
    code = book.code + '-1';
  }

  delete book._id;

  const res = await db.collection('books').add({
    data: {
      ...book,
      code: code,
      createdAt: new Date()
    }
  });

  return res._id;
}