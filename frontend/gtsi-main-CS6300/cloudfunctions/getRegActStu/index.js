// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const {cardId} = event;
    const cardRes = await db.collection("cardlist").where({_id:cardId}).get();
    if(cardRes.data.length==0){
        return{
            status:false
        }
    }
    let bookList = cardRes.data[0].bookList;
    let result = [];
    for(let i=0;i<bookList.length;i++){
        let res = await db.collection("users").where({gtid:bookList[i]}).get();
        if(res.data.length!=0){
            let temp = {
                name:res.data[0].name,
                gtid:bookList[i]
            }
            result.push(temp);
        }
    }
    return {
        status:true,
        list:result
    }
}