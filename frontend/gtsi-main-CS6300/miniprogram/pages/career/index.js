// pages/career/index.js
const api = require("../../API.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recommendList:[
            // {
            //     title:"Software Engineer",
            //     description:"responsible for front-end/mobile web interface, front-end construction...",
            //     publishDate: "3/14/2023",
            //     _id:"123456789",
            //     type:"career", //or activity or internal
            //     origin:"Google", //information origin,it will be GTSI when type is activity
            //     salary:"15k-25k*14",
            //     isHurry:true,
            //     isJob:true
            // },
            // {
            //     title:"Data Science",
            //     description:"3 month at least.",
            //     publishDate: "3/12/2023",
            //     _id:"123456789",
            //     type:"internal", //or activity or internal
            //     origin:"Amazon", //information origin,it will be GTSI when type is activity
            //     salary:"400 Per Day",
            //     isHurry:false,
            //     isJob:true
            // },
            // {
            //     title:" Career Services Walk-in ",
            //     description:"𝐰𝐚𝐥𝐤 𝐦𝐞 𝐭𝐡𝐫𝐨𝐮𝐠𝐡 𝐲𝐨𝐮𝐫 𝐫𝐞𝐬𝐮𝐦𝐞",
            //     publishDate: "3/15/2023",
            //     activityDate:"Thursday, March 16, 2023, 16:00-17:00",
            //     _id:"123456780",
            //     type:"activity", //or activity or internal
            //     origin:"GTSI", //information origin,it will be GTSI when type is activity
            //     isHurry:false,
            //     isJob:false
            // },
            // {
            //     title:"NLP Scientist",
            //     description:"trf-cf...",
            //     publishDate: "3/15/2023",
            //     _id:"123456780",
            //     type:"career", //or activity or internal
            //     origin:"Tencent", //information origin,it will be GTSI when type is activity
            //     salary:"20k*16",
            //     isHurry:false,
            //     isJob:true
            // },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // let data = await api.test();
        // console.log(data);
        // wx.request({
        //   url: 'http://localhost:8088/info/getTopCards',
        //   method:'POST',
        //   success:(res)=>{
        //       console.log(res.data.data);
        //       this.setData({
        //           recommendList:res.data.data
        //       })
        //   }
        // })
        let isLogin = wx.getStorageSync('isLogin');
        if(isLogin==null) isLogin=false;
        this.setData({
            isLogin:isLogin
        })
        // not login
        if(isLogin==false){return;}
        let res = await wx.cloud.callFunction({
            name:"getTopCard"
        });
        let resData = res.result;
        this.setData({
            recommendList:resData
        });

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
    ,
    test(){
        wx.navigateTo({
            url: '/pages/careerLogin/index',
          })
    },
    goToMenu(){
        wx.navigateTo({
            url: '/pages/index/index',
          })
    }
})