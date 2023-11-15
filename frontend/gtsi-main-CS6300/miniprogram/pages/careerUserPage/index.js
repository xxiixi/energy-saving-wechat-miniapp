// pages/careerUserPage/index.js
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    
    data: {
        gtid:"903853714",
        name:null,
        nameTemp:"",
        role:"student",
        email:"zniu37@gatech.edu",
        isLogin:false
    },
    test(){
        wx.navigateTo({
            url: '/pages/careerLogin/index',
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let isLogin = wx.getStorageSync('isLogin');
        console.log(isLogin);
        if(isLogin==void 0||isLogin==null||!isLogin) isLogin = false;
        this.setData({
            isLogin:isLogin,
            gtid:wx.getStorageSync("gtid"),
            role:wx.getStorageSync("role"),
            email:wx.getStorageSync("email"),
            name:wx.getStorageSync("name")
        })
    },
    setName(){
        Dialog.confirm({
            title:"Set your name",
            confirmButtonText:"Yes",
            cancelButtonText:"No"
          })
        .then(async () => {
            if(this.data.nameTemp==""){
                Toast("input can not be empty!");
                return;
            }
            Toast.loading({
                duration: 0,
                message: 'Returning...',
                forbidClick: true,
            });
            // on confirm  
            let sendData = {
                gtid:this.data.gtid,
                email:this.data.email,
                role:this.data.role,
                name:this.data.nameTemp
            };
            console.log(sendData);
            let res = await wx.cloud.callFunction({
                name:"setName",
                data:sendData
            });
            console.log(res.result.status);
            if(res.result.status){
                this.setData({
                    name:sendData.name
                });
                wx.setStorageSync('name', this.data.name);
                console.log(this.data.name);
                Toast("Successfully changed")
            } else {
                Toast("Something wrong, try again later.");
            }
            
        })
        .catch(() => {
            // on cancel
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

    },
    logout(){
        wx.setStorageSync('isLogin', null);
        wx.setStorageSync('gtid', null);
        wx.setStorageSync('name', null);
        wx.setStorageSync('email', null);
        wx.navigateTo({
          url: '/pages/careerLogin/index',
        })
    }
})