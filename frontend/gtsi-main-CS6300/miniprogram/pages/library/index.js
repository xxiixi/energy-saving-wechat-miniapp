const app = getApp();

// pages/library/index.js
Page({
    data: {
        // 左边的 dropdown，用于 book type 分类
        bookType: '',
        bookTypes: [{
                text: 'All Shelf',
                value: ''
            },
            {
                text: 'Type A',
                value: 'A'
            },
            {
                text: 'Type B',
                value: 'B'
            },
            {
                text: 'Type C',
                value: 'C'
            },
        ],

        // 右边的 dropdown，用于根据 major tag 过滤
        bookTag: '',
        bookTags: [{
                text: 'All Majors',
                value: ''
            },
            {
                text: 'ECE',
                value: 'ECE'
            },
            {
                text: 'CS',
                value: 'CS'
            },
            {
                text: 'MID',
                value: 'MID'
            },
            {
                text: 'ENVE',
                value: 'ENVE'
            },
            {
                text: 'MSA',
                value: 'MSA'
            },
            {
                text: 'Others',
                value: 'Others'
            }
        ],

        bookList: [],
        hasMore: true,

        // 搜索字段
        searchValue: '',

        // 用户信息
        user: {},

        // 滑动图片
        indicatorDots: true,
        bannerList: ['/image/banner.png', '/image/banner.png', '/image/banner.png']
    },

    async getBooks() {
        const res = await wx.cloud.callFunction({
            name: "getBooks",
            data: {
                bookType: this.data.bookType,
                bookTag: this.data.bookTag,
                offset: this.data.bookList.length
            }
        });
        this.setData({
            bookList: this.data.bookList.concat(res.result.data),
            hasMore: res.result.data.length === 30
        });
    },

    // 关闭底部选择角色的弹窗
    closeRole() {
        this.setData({
            showRole: false
        });
    },

    selectRole(event) {
        this.setData({
            role: event.detail.value
        })
    },

    // 切换 book type
    selectType(value) {
        this.setData({
            bookType: value.detail,
            bookList: []
        });
        this.getBooks();
    },

    // 切换 book tag
    selectTag(value) {
        this.setData({
            bookTag: value.detail,
            bookList: []
        });
        this.getBooks();
    },

    // 搜索
    async onSearch(event) {
        const searchValue = event.detail;
        if (searchValue === '') {
            this.setData({
                bookList: []
            })
            this.getBooks();
            return;
        }
        const res = await wx.cloud.callFunction({
            name: 'searchBook',
            data: {
                searchValue: event.detail
            }
        });
        this.setData({
            bookList: res.result.data,
            hasMore: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getBooks();

        wx.cloud.callFunction({
                name: 'getUser'
            })
            .then(res => {
                if (res.result.data.length > 0) {
                    this.setData({
                        user: res.result.data[0]
                    });
                } else {
                    wx.reLaunch({
                        url: '/pages/login/index',
                    })
                }
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
    onShow() {},

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
        if (this.data.hasMore) {
            this.getBooks();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})