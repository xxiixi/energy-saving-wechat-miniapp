import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookID: '',
        book: {},

        showShare: false,
        shareOptions: [{
            name: '微信',
            icon: 'wechat',
            value: "wechat",
            openType: 'share'
        }],

        // 全局user变量
        user: {},

        // 顶部popup
        showPopup: false,

        borrowForOther: false,

        // admin borrow for others
        gtid: '',
        email: ''
    },

    closeDialog() {
        this.setData({
            showDialog: false
        })
    },

    clickHome() {
        wx.reLaunch({
            url: '/pages/library/index',
        });
    },

    borrowBook() {
        const bookID = this.data.book._id;
        const queryBookInfo = this.queryBookInfo;

        // 订阅消息: https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
        wx.requestSubscribeMessage({
            tmplIds: ['c8204cxUyhISFXPh0dV5cPxwUncW5pjvYx1W6ezBgPI'],
            success(res) {
                if (res['c8204cxUyhISFXPh0dV5cPxwUncW5pjvYx1W6ezBgPI'] === 'accept') {
                    const text = app.globalData.user.role === "student" ?
                        "a. To ensure the availability of items, each person can check out and keep no more than 8 items\n" +
                        "b. The loan period is 80 days with a maximum renewal period of 30 days.\n" +
                        "c. Please return items on time and in good condition.\n" +
                        "d. The borrower is responsible for reporting damaged or lost items to GTSI staff.\n" +
                        "e. The borrower must pay for the cost to replace the damaged or lost item." :
                        "a. The loan period is 80 days with a maximum renewal period of 30 days.\n" +
                        "b. Please return items on time and in good condition.\n" +
                        "c. The borrower is responsible for reporting damaged or lost items to GTSI staff."


                    Dialog.confirm({
                            title: "Do you want to borrow this book?",
                            message: text,
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'Cancel'
                        })
                        .then(() => {
                            Toast.loading({
                                duration: 0,
                                forbidClick: true,
                                message: 'Borrowing ...',
                            });

                            wx.cloud.callFunction({
                                name: "borrowBook",
                                data: {
                                    bookID: bookID
                                }
                            }).then(res => {
                                if (res.result.code) {
                                    Toast.success(res.result.message);
                                    queryBookInfo(bookID); // refresh

                                    const pages = getCurrentPages();
                                    const beforePage = pages[pages.length - 2];
                                    const modifiedBooks = beforePage.data.bookList.map(item => {
                                        if (item._id === bookID) {
                                            item.status = 'borrowed';
                                        }
                                        return item;
                                    });
                                    beforePage.setData({
                                        bookList: modifiedBooks
                                    })
                                } else {
                                    Toast.fail(res.result.message);
                                }
                            }).catch(err => {
                                console.log("err", err);
                                Toast.fail('Borrow failed. Try Later.');
                            });
                        })
                        .catch(() => {
                            // on cancel
                        });
                } else {
                    Toast('Please subscribe WeChat notification before borrowing the book');
                }
            },
            fail(err) {
                Toast.fail(err.errMsg);
            }
        });


    },

    async queryBookInfo(bookID) {
        const db = wx.cloud.database();
        const res = await db.collection('books')
            .doc(bookID).get();

        this.setData({
            book: res.data
        });
    },

    copyBook() {
        Dialog.confirm({
                message: 'Are you sure to copy the same book?',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
            .then(() => {
                console.log('book', this.data.book);
                wx.cloud.callFunction({
                    name: 'copyBook',
                    data: {
                        book: this.data.book
                    }
                }).then(res => {
                    if (res.result) {
                        Toast.success('Successfully generated a new copy');
                        wx.navigateTo({
                            url: `/pages/book/index?bookID=${res.result}`,
                        })
                    } else {
                        Toast.fail('Failed to generate a new copy.');
                    }
                })
            })
            .catch(() => {
                // on cancel
            });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            user: app.globalData.user,
            bookID: options.bookID,
        });
        this.queryBookInfo(options.bookID)
    },

    editBook() {
        wx.navigateTo({
            url: `/pages/editBook/index?bookID=${this.data.bookID}`,
        })
    },

    borrowForOther() {
        this.setData({
            borrowForOther: true
        })
    },

    closeBorrowForOther() {
        this.setData({
            borrowForOther: false
        })
    },

    async handleBorrowForOther() {
        const {
            gtid,
            email,
            bookID
        } = this.data;
        if (gtid === '' && email === '') {
            Toast("Please input GTID or email");
            return;
        }
        if (gtid !== '' && email !== '') {
            Toast("Cannot input both GTID and email");
            return;
        }

        this.setData({
            borrowForOther: false
        })

        const res = await wx.cloud.callFunction({
            name: "borrowForOther",
            data: {
                gtid: gtid,
                email: email,
                bookID: bookID
            }
        });

        console.log("res", res);

        if (res.result.code) {
            Toast.success("Successfully Borrowed");
            this.queryBookInfo(bookID); // refresh

            const pages = getCurrentPages();
            const beforePage = pages[pages.length - 2];
            const modifiedBooks = beforePage.data.bookList.map(item => {
                if (item._id === bookID) {
                    item.status = 'borrowed';
                }
                return item;
            });
            beforePage.setData({
                bookList: modifiedBooks
            })
        } else {
            Toast.fail(res.result.message);
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
        this.queryBookInfo(this.data.bookID)
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


    shareBook() {
        this.setData({
            showShare: true
        })
    },

    closeShare() {
        this.setData({
            showShare: false
        })
    },

    selectShare(options) {
        console.log("options", options);
    },
})