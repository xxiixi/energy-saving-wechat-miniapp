
// pages/careerUserReg/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recommendList:[],
        jobList:[],
        hasContent:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let gtid = wx.getStorageSync('gtid');
        let res = await wx.cloud.callFunction({
            name:"getRegisteredAct",
            data:{
                gtid:gtid
            }
        });

        if(res.result.status){
            let recList = [];
            let jobList = [];
            res.result.list.forEach(item=>{
                if(item.isJob==true){
                    jobList.push(item);
                } else {
                    recList.push(item);
                }
            });

            this.setData({
                recommendList:recList,
                jobList:jobList
            });
            if(this.data.recommendList.length==0){
                this.setData({
                    hasContent:false
                })
            }
        } else {
            console.log(res.result.test);
        }
    },
    // async refreshPage(){
    //     let gtid = wx.getStorageSync('gtid');
    //     let res = await wx.cloud.callFunction({
    //         name:"getRegisteredAct",
    //         data:{
    //             gtid:gtid
    //         }
    //     });

    //     if(res.result.status){
    //         this.setData({
    //             recommendList:res.result.list
    //         });
    //     } else {
    //         console.log(res.result.test);
    //     }
    // },

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