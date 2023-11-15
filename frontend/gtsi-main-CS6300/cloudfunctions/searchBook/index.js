// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    searchValue
  } = event;

  const db = cloud.database();
  const _ = db.command;

  searchValue = searchValue.toUpperCase();

  // 根据 title / author / bookcode 进行搜索
  // 不区分大小写
  const res = await db.collection("books").where(
    _.or({
      code: searchValue,
    }, {
      title: db.RegExp({
        regexp: searchValue,
        options: 'i',
      })
    }, {
      author: db.RegExp({
        regexp: searchValue,
        options: 'i',
      })
    })
  ).limit(100).get();

  return res;
}