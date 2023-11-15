// pages/bookRequest/index.js
import Toast from '@vant/weapp/toast/toast';

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // affiliation action sheet
        showAffiliation: false,
        affiliationActions: [{
            name: 'Student',
            value: 'Student'
        }, {
            name: 'Faculty',
            value: 'Faculty'
        }],
        affiliation: '',

        title: '',
        author: '',
        name: '',

        // program action sheet
        showProgram: false,
        programActions: [{
            name: "ECE",
            value: 'ECE'
        }, {
            name: 'CS',
            value: 'CS',
        }, {
            name: 'MID',
            value: 'MID'
        }, {
            name: 'ENVE',
            value: 'ENVE'
        }, {
            name: 'MSA',
            value: 'MSA'
        }, {
            name: 'Others',
            value: 'Others'
        }],
        program: '',

        // button loading status
        loading: false,

        user: {}
    },

    showAffiliation() {
        this.setData({
            showAffiliation: true
        })
    },

    closeAffiliation() {
        this.setData({
            showAffiliation: false
        })
    },

    selectAffiliation(event) {
        this.setData({
            affiliation: event.detail.value
        })
    },

    showProgram() {
        this.setData({
            showProgram: true
        })
    },

    closeProgram() {
        this.setData({
            showProgram: false
        })
    },

    selectProgram(event) {
        this.setData({
            program: event.detail.value
        })
    },

    // submit request
    submitRequest() {
        const {
            title,
            author,
            name,
            affiliation,
            program
        } = this.data;

        if (!title) {
            return Toast.fail("Please input book title");
        }
        if (!author) {
            return Toast.fail("Please input book author");
        }
        if (!name) {
            return Toast.fail("Please input your name");
        }
        if (!affiliation) {
            return Toast.fail("Please choose your affiliation first");
        }
        if (!program) {
            return Toast.fail("Please choose your program first");
        }

        this.setData({
            loading: true
        });
        wx.cloud.callFunction({
            name: 'requestBook',
            data: {
                title,
                author,
                name,
                affiliation,
                program
            }
        }).then(_ => {
            Toast.success("Book request successfully submitted");
            this.setData({
                loading: false,
                title: '',
                author: '',
                name: '',
                affiliation: '',
                program: ''
            });
        }).catch(_ => {
            Toast.fail("Book request failed to submit. Try Later");
        }).finally(() => {
            this.setData({
                loading: false
            });
        })
    },

    showRequestPage() {
        wx.navigateTo({
            url: '/pages/requests/index',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(app.globalData.user.role === 'admin');
        this.setData({
            user: app.globalData.user
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
    // onShareAppMessage() {

    // }
})