import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        records: [],
        user: {}
    },

    viewAllBorrowedRecords() {
        wx.navigateTo({
            url: '/pages/allBorrowedRecords/index',
        })
    },

    logout() {
        Dialog.confirm({
            message: 'Are you sure you want to logout?',
            cancelButtonText: "No",
            confirmButtonText: "Yes",
        }).then(_ => {
            wx.cloud.callFunction({
                name: "logout"
            }).then(res => {
                console.log("res", res);
                wx.reLaunch({
                    url: '/pages/library/index',
                });
            }).catch(err => {
                console.log("err", err);
            });
        }).catch(_ => {});
    },

    handleReturn(event) {
        Dialog.confirm({
            title: 'Return',
            message: 'Do you want to return this book? Please make sure that you\'ve put it back :)',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes'
        }).then(async () => {
            Toast.loading({
                duration: 0,
                message: 'Returning...',
                forbidClick: true,
            });

            wx.cloud.callFunction({
                name: "returnBook",
                data: {
                    bookID: event.target.dataset.bookid
                }
            }).then(res => {
                if (res.result) {
                    Toast.success('Successfully returned!');

                    this.queryBookRecords(); // refresh

                    const pages = getCurrentPages();
                    const beforePage = pages[pages.length - 2];
                    const modifiedBooks = beforePage.data.bookList.map(item => {
                        if (item._id === event.target.dataset.bookid) {
                            item.status = '';
                        }
                        return item;
                    });
                    beforePage.setData({
                        bookList: modifiedBooks
                    })
                } else {
                    Toast.fail('Return failed. Try later.')
                }
            }).catch(err => {
                Toast.fail('Return failed. Try later.')
            });
        }).catch(() => {
            // on cancel
        });

    },

    handleRenew(event) {
        const book = this.data.records.find(item => item.bookID === event.target.dataset.bookid);
        if (book.isRenewed) {
            return Toast.fail('You can only renew a book once');
        }

        Toast.loading({
            duration: 0,
            message: 'Renewing...',
            forbidClick: true,
        });

        wx.cloud.callFunction({
            name: "renewBook",
            data: {
                bookID: event.target.dataset.bookid
            }
        }).then(res => {
            if (res.result) {
                Toast.success('Successfully renewed for 30 more days');
                this.queryBookRecords();
            } else {
                Toast.fail('Renew failed. Try Later');
            }
        }).catch(err => {
            console.log("err", err);
            Toast.fail('Renew failed. Try Later');
        });
    },

    async queryBookRecords() {
        const res = await wx.cloud.callFunction({
            name: 'getBorrowRecords',
        });
        this.setData({
            records: res.result
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            user: app.globalData.user
        });
        this.queryBookRecords()
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
})