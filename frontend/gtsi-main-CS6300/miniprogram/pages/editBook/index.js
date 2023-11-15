import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';

// pages/addBook/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookID: '',

        isbn: '',
        title: '',
        author: '',
        edition: '',

        // 按钮状态
        saveloading: false,

        // 底部弹窗
        showPopup: false,
        tags: ['ECE', 'CS', 'MID', 'ENVE', 'MSA', 'Others'],
        selectedTags: [],

        // book code action sheet
        showCode: false,
        codes: ['A', 'B', 'C'],
        code: '',
    },

    async saveBook() {
        const db = wx.cloud.database()
        this.setData({
            saveloading: true
        })

        try {
            await db.collection('books').doc(this.data.bookID).update({
                data: {
                    isbn: this.data.isbn,
                    title: this.data.title,
                    author: this.data.author,
                    edition: this.data.edition,
                    tags: this.data.selectedTags
                }
            })

            Toast.success({
                duration: 0, // 持续展示 toast
                forbidClick: true,
                message: 'Successfully Saved',
                selector: '#van-toast',
            });

            let second = 2;
            const timer = setInterval(() => {
                second--;
                if (second === 0) {
                    clearInterval(timer);
                    Toast.clear();
                    wx.navigateBack()
                }
            }, 1000);
        } catch (err) {
            console.log("edit book error", err);
            Toast.fail("修改失败，请稍后再试");
        }
    },

    chooseTag(event) {
        this.setData({
            selectedTags: event.detail,
        });
    },

    toggle(event) {
        const {
            index
        } = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },

    noop() {},

    showPopup() {
        this.setData({
            showPopup: true
        })
    },

    closePopup() {
        this.setData({
            showPopup: false
        })
    },

    async queryBookInfo(bookID) {
        const db = wx.cloud.database();
        const res = await db.collection('books')
            .doc(bookID).get();

        this.setData({
            isbn: res.data.isbn,
            title: res.data.title,
            author: res.data.author,
            edition: res.data.edition,
            selectedTags: res.data.tags
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            bookID: options.bookID
        })
        this.queryBookInfo(options.bookID)
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