// pages/careerActivity/index.js
import Notify from '@vant/weapp/notify/notify';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeKey: 0,
        recommendList:[],
        nameList:["Current Activities","applying"],
        allList:[
        //     {
        //     title:" Career Services Walk-in ",
        //     description:"𝐰𝐚𝐥𝐤 𝐦𝐞 𝐭𝐡𝐫𝐨𝐮𝐠𝐡 𝐲𝐨𝐮𝐫 𝐫𝐞𝐬𝐮𝐦𝐞",
        //     publishDate: "3/15/2023",
        //     activityDate:"Thursday, March 16, 2023, 16:00-17:00",
        //     _id:"123456780",
        //     type:"activity", //or activity or internal
        //     origin:"GTSI", //information origin,it will be GTSI when type is activity
        //     isHurry:false,
        //     actType:"campus"
        // },{
        //     title:" Academic Lecture ",
        //     description:"How to write a journal? You will learn that from this lecture",
        //     publishDate: "3/15/2023",
        //     activityDate:"Thursday, March 16, 2023, 16:00-17:00",
        //     _id:"123456780",
        //     type:"activity", //or activity or internal
        //     origin:"GTSI", //information origin,it will be GTSI when type is activity
        //     isHurry:false,
        //     actType:"academic"
        // },{
        //     title:" PHD Applying exp sharing ",
        //     description:"Share your experience when apply a PHD",
        //     publishDate: "3/15/2023",
        //     activityDate:"Thursday, March 16, 2023, 16:00-17:00",
        //     _id:"123456780",
        //     type:"activity", //or activity or internal
        //     origin:"GTSI", //information origin,it will be GTSI when type is activity
        //     isHurry:false,
        //     actType:"applying"
        // }
    ]
    },
    onChange(event) {
        let newList = [];

        this.data.allList.forEach(item=>{
            if(item.actType==this.data.nameList[event.detail.index]){
                newList.push(item);
            } else if ((item.actType=="campus"||item.actType=="academic")&&event.detail.index==0){
                newList.push(item);
            }
        })
   
        this.setData({
            recommendList:newList
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // wx.request({
        //     url: 'http://localhost:8088/info/getCardsByType',
        //     method:'POST',
        //     data:{
        //         type:"activity"
        //     },
        //     success:(res)=>{
        //         console.log(res.data.data);
        //         this.setData({
        //             allList:res.data.data
        //         })
        //         let newList = [];

        //         this.data.allList.forEach(item=>{
        //             if(item.actType==this.data.nameList[this.data.activeKey]){
        //                 newList.push(item);
        //             }
        //         })
        
        //         this.setData({
        //             recommendList:newList
        //         })
        //     }
        // })
        let res = await wx.cloud.callFunction({
            name:"getCardByCondition",
            data:{
                isJob:false
            }
        });
        let resData = res.result;
        this.setData({
            allList:resData
        });
        let newList = [];

        this.data.allList.forEach(item=>{
            if(item.actType="campus"||item.actType=="academic"){
                newList.push(item);
            }
        })
   
        this.setData({
            recommendList:newList
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})