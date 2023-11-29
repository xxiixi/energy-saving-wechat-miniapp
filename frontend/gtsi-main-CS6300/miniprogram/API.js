// let baseURL = "http://localhost:8088"

// function request(method,url,params={}){
//     return new Promise((resolve,reject)=>{
//         console.log("start");
//         wx.request({
//             method:method,
//             url:`${baseURL}/${url}`,
//             data:params,
//             success:(res)=>{
//                 console.log(res);
//                 resolve(res.data);
//             },
//             error:(res)=>{
//                 console.log(res);
//             }
//         })
//     })
// }

// function test(){return request("","GET")}
// function boom(){console.log("boom")}
// module.exports = {
//     test,
//     boom
// }