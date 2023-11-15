// pages/careerRegStudents/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        studentList:[],
        hasContent:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let cardId = options.cardId;
        let res = await wx.cloud.callFunction({
            name:"getRegActStu",
            data:{
                cardId:cardId
            }
        });
        if(res.result.status){
            console.log(res.result.list);
            this.setData({
                studentList:res.result.list
            })
        } else {
            console.log(res.result.status);
        }
        if(this.data.studentList.length==0){
            this.setData({
                hasContent:false
            })
        }
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