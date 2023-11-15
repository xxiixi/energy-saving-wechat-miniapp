// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const {
        role,
        gtid,
        cardId,
        option,
        isJob
    } = event;
    const cardRes = await db.collection('cardlist').where({_id:cardId}).get();
    if(cardRes.data[0].length==0||role=="admin"){
        return {
            status:false
        }
    }
    let bookList = cardRes.data[0].bookList;
    if(option=="register"){
        bookList.push(gtid);
    } else if(option=="cancel") {
        let newArr = [];
        bookList.forEach(item=>{
            if(item!=gtid){
                newArr.push(item);
            }
        })
        bookList = newArr;
    }
 
    const userRes = await db.collection('users').where({role:role,gtid:gtid}).get();
    let scheduleList = userRes.data[0].scheduleList;
    if(scheduleList==void 0||scheduleList==null){
        scheduleList = []
    }
    if(option=="register"){
        scheduleList.push(cardId);
    } else if(option=="cancel") {
        let newArr = [];
        scheduleList.forEach(item=>{
            if(item!=cardId){
                newArr.push(item);
            }
        })
        scheduleList = newArr;
    }
    try{
        let res1 = await db.collection('users').where({role:role,gtid:gtid}).update({
            data:{
                scheduleList:scheduleList
            }
        });
        let res2;

        res2 = await db.collection('cardlist').where({_id:cardId}).update({
            data:{
                bookList:bookList
            }
        });
        return{
            status:true,
            content:{
                res1,
                res2
            }
        }
    } catch(err){
        return {
            status:false,
            content:err
        }
    }

}