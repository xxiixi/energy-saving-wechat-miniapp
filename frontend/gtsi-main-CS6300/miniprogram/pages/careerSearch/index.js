// pages/careerSearch/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        option1: [
            { text: 'All Type', value: 0 },
            { text: 'Internship', value: 1 },
            { text: 'On-Campus', value: 2 },
          ],
          option2: [
            { text: 'Default Sort', value: 'a' },
            { text: 'Sort By Time', value: 'b' },
            { text: 'Sort Hurry first', value: 'c' },
          ],
          value1: 0,
          value2: 'a',
          recommendList:[
            //   {
            //     title:"Software Engineer",
            //     description:"responsible for front-end/mobile web interface, front-end construction...",
            //     publishDate: "3/14/2023",
            //     _id:"123456789",
            //     type:"career", //or activity or internal
            //     origin:"Google", //information origin,it will be GTSI when type is activity
            //     salary:"15k-25k*14",
            //     isHurry:true,
            //     isJob:true
            // }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // wx.request({
        //     url: 'http://localhost:8088/info/getCardsByType',
        //     method:'POST',
        //     data:{
        //         type:"career"
        //     },
        //     success:(res)=>{
        //         console.log(res.data.data);
        //         this.setData({
        //             recommendList:res.data.data
        //         })
        //     }
        // })
        let res = await wx.cloud.callFunction({
            name:"getCardByCondition",
            data:{
                isJob:true
            }
        });
        let resData = res.result;
        this.setData({
            recommendList:resData
        });
    },
    async getJobCards(searchValue){
        if(searchValue==""){
            let res = await wx.cloud.callFunction({
                name:"getCardByCondition",
                data:{
                    isJob:true
                }
            });
            let resData = res.result;
            this.setData({
                recommendList:resData
            });
        } else {
            let res = await wx.cloud.callFunction({
                name:"searchJob",
                data:{
                    searchValue:searchValue
                }
            });
            let resData = res.result;
            console.log(resData);
            let resultList = []
            resData.data.forEach(item=>{
                if(item.isJob==true){
                    resultList.push(item);
                }
            })
            this.setData({
                recommendList:resultList
            });
        }
    },
    async onSearch(event){
        const searchValue = event.detail;
        this.getJobCards(searchValue);
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