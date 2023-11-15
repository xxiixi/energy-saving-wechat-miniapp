// pages/bookTag/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookList: [],
        bookTag: ''
    },

    async getBooks() {
        const res = await wx.cloud.callFunction({
            name: "getBooks",
            data: {
                bookTag: this.data.bookTag,
                offset: this.data.bookList.length
            }
        });
        this.setData({
            bookList: this.data.bookList.concat(res.result.data),
            hasMore: res.result.data.length === 30
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            bookTag: options.tag
        });
        this.getBooks();
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
        this.getBooks();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})