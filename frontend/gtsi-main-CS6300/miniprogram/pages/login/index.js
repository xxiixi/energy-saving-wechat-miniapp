import Toast from '@vant/weapp/toast/toast';

const app = getApp();

// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        role: 'student',
        gtid: '',
        email: '',
        password: '',

        loading: false
    },

    changeRole(event) {
        this.setData({
            role: event.detail.name
        });
    },

    async login() {
        const {
            role,
            gtid,
            email,
            password
        } = this.data;
        if (role === 'student' && (!gtid || !password)) {
            return Toast('please input GTID and password');
        } else if (role === 'faculty' && !email) {
            return Toast('please input email');
        } else if (role === 'admin' && (!email || !password)) {
            return Toast('please input admin email and password');
        }

        this.setData({
            loading: true
        });
        wx.cloud.callFunction({
            name: "login",
            data: {
                role: role,
                gtid: gtid,
                email: email,
                password: password
            }
        }).then(res => {
            if (res.result.code) {
                app.globalData.user = res.result.user;
                wx.redirectTo({
                    url: '/pages/library/index',
                });
            } else {
                Toast.fail(res.result.message);
            }
        }).catch(_ => {
            Toast.fail('Login failed. Try Later.');
        }).finally(() => {
            this.setData({
                loading: false
            });
        });
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
    // reference: https://youzan.github.io/vant-weapp/#/tab#jie-jue-fang-fa
    onShow() {
        this.selectComponent('#tabs').resize();
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
    // onShareAppMessage() {

    // }
})