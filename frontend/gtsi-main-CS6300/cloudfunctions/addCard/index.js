// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const $ = db.aggregate;

    const {
        title,
        description,
        targetDate,
        actArea,
        actType,
        isHurry,
        isJob,
        isTop,
        type,
        origin
    } = event;
    let date = new Date();
    let curDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    try{
        const res = await db.collection("cardlist").add({
            data:{
                title:title,
                description:description,
                targetDate:targetDate,
                actArea:actArea,
                actType:actType,
                isHurry:isHurry,
                isJob:isJob,
                isTop:isTop,
                origin:origin,
                bookList:[],
                type:type,
                publishDate:curDate
            }
        })
        return {
            status:true,
            _id:res._id
        }

    } catch(err){
        return {
            status:false,
            content:err
        }
    }
}