// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  const {
    role,
    gtid,
    email,
    password
  } = event;

  const db = cloud.database();

  // step 1: check if it's already exists
  let condition = role === 'student' ? {
    gtid: gtid
  } : {
    email: email
  }
  const userRes = await db.collection('whitelist').where(condition).get();
  if (userRes.data.length > 0) {
    return {
      code: false,
      message: role === 'student' ? 'GTID already exists' : 'Email already exists'
    };
  }

  // step 2: add user record
  const res = await db.collection('whitelist').add({
    data: {
      email: email,
      gtid: gtid,
      role: role,
      password: password
    }
  });

  return {
    code: res._id ? true : false
  };
}