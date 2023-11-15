import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';


Page({
    data: {
        bookedSeat: []
    },

    //  取消预约座位
    cancelReservation(e) {
        const { value, seatID } = e.currentTarget.dataset.seat;
        Dialog.confirm({
            message: '确定取消吗？'
        })
        .then(() => {
            wx.cloud.callFunction({
                name: "cancelReservation",
                data: {
                    seatID: seatID,
                    start: value
                }
            }).then(res => {
                if (res.result.code === 200) {
                    Toast("已取消预约");
                    this.getReservation();
                }
            }).catch(err => {
                console.log("err", err);
            })
        })
        .catch(() => {
            // on cancel
        });
    },

    getReservation() {
        wx.cloud.callFunction({
            name: "getSeatReservation"
        }).then(res => {
            const records = [];
            const now = new Date().getTime();
            for (const seat of res.result) {
                for (const time of seat.status) {
                    if (time < now - 24 * 60 * 60 * 1000 * 7) continue;
                    const startDate = new Date(time);
                    const endDate = new Date(time + 24 * 60 * 60 * 7 * 1000);
                    records.push({
                        seatID: seat._id,
                        location: seat.location,
                        number: seat.number,
                        value: time,
                        start: `${startDate.getMonth() + 1}月${startDate.getDate()}日`,
                        end: `${endDate.getMonth() + 1}月${endDate.getDate()}日`
                    })
                }
            }
            this.setData({
                bookedSeat: records
            });
            console.log(records);
        }).catch(err => {
            console.log("err", err);
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getReservation();
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