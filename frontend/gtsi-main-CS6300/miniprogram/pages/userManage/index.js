import Toast from '@vant/weapp/toast/toast';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        gtid: '',
        email: '',
        password: ''

    },

    addUser(event) {
        const {
            role
        } = event.currentTarget.dataset;
        const {
            gtid,
            email,
            password
        } = this.data;

        if (role === 'student' && (!gtid || !password)) {
            return Toast.fail('GTID and password cannot be empty');
        }
        if (role === 'faculty' && !email) {
            return Toast.fail("Email cannot be empty");
        }

        Toast.loading({
            message: 'adding...',
            forbidClick: true,
            duration: 0
        })
        wx.cloud.callFunction({
            name: 'addUser',
            data: {
                role: role,
                gtid: role === 'student' ? gtid : "",
                email: role === 'faculty' ? email : "",
                password: role == 'student' ? password : "",
            }
        }).then(res => {
            if (res.result.code) {
                Toast.success('User successfully added');
            } else {
                Toast.fail(res.result.message);
            }
        }).catch(err => {
            Toast.fail('Add user failed. Try Later.');
        })
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

    }
})