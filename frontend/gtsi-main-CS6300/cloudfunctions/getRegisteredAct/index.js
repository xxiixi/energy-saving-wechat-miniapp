// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const { gtid } = event;
    const userRes = await db.collection("users").where({gtid:gtid}).get();
    
    if(userRes.data==void 0){
        return{
            status:false,
            test:gtid
        }
    }
    let idList = userRes.data[0].scheduleList;
    let result = [];
    for(let i=0;i<idList.length;i++){
        let cardRes = await db.collection("cardlist").where({_id:idList[i]}).get();
        if(cardRes.data.length!=0){
            result.push(...cardRes.data);
        }
    }
    return {
        status:true,
        list:result
    }
}