// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const appKey = '48924_0fe4217a696d7f6e1dceb6e0afb0dd53'

// 云函数入口函数
// api reference: https://isbndb.com/apidocs/v2
exports.main = async (event, context) => {
  const {
    isbn
  } = event;

  const res = await axios.get(`https://api2.isbndb.com/book/${isbn}`, {
    headers: {
      'Content-Type': "application/json",
      'Authorization': appKey
    }
  });

  return res.data;
}