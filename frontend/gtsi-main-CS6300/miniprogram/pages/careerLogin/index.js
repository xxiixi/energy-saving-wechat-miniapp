// pages/careerLogin/index.js
import Toast from '@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gtid:"",
        password:"",
        email:"",
        role:"student"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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

    },
    async login(){
        // console.log(this.data.role);
        // console.log(this.data.gtid);
        console.log(this.data.role);
        let res = await wx.cloud.callFunction({
            name:"login",
            data:{
                gtid:this.data.gtid,
                role:this.data.role,
                password:this.data.password,
                email:this.data.email
            }
        })
        console.log(res.result);
        if(res.result.code==true){
            Toast("successfully login!");
            setTimeout(()=>{
                wx.setStorageSync('gtid', this.data.gtid);
                wx.setStorageSync('role', this.data.role);
                wx.setStorageSync('email', this.data.email);
                wx.setStorageSync('name', res.result.user[0].name);
                wx.setStorageSync('isLogin', true);
                wx.navigateTo({
                    url: '/pages/career/index',
                })
            },1000)
            
        } else {
            Toast(res.result.message);
        }
        
    },
    changeRole(event) {
        this.setData({
            role: event.detail.name
        });
    },
})