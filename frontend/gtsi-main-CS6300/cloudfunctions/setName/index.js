// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const openid = wxContext.OPENID;
    const {
        gtid,
        email,
        name,
        role
    } = event;
    let condition;

    if(role=="student"){
        condition = {
            role:role,
            gtid:gtid
        }
    } else if (role=="admin"){
        condition = {
            role:role,
            email:email
        }
    }
    try{
        const userRes = await db.collection('users').where(condition).update({
            data:{
                name:name
            }
        });
        return {
            status:true,
            res:userRes,
            name:name,
            condition:condition
        }
    }catch(err){
        return {
            status:false,
            content:err
        }
    }
}