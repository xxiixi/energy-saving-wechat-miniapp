import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        seatID: '', // seat record's _id
        seatInfo: {},

        dates: [],
        selectedDate: null,
    },

    async querySeatInfo() {
        const { seatID } = this.data;
        const res = await wx.cloud.callFunction({
            name: "getSeatInfo",
            data: {
                seatID: seatID
            }
        });

        // generate the date for next 14 weeks (3 month)
        const now = new Date();
        const date = now.getDate();
        const day = now.getDay();

        // this week's Monday & Sunday
        const Monday = new Date(now.setDate(date - (day === 0 ? 6 : day - 1)));
        const Sunday = new Date(new Date(Monday).setDate(Monday.getDate() + 6))

        const dates = [];
        for (let i = 0; i < 14; i += 1) {
            const value = new Date(Monday.getFullYear(), Monday.getMonth(), Monday.getDate()).getTime();
            dates.push({
                value: value,
                status: res.result.status.includes(value) ? 0 : 1,
                start: (Monday.getMonth() + 1) + "月" + Monday.getDate() + "日",
                end: (Sunday.getMonth() + 1) + "月" + Sunday.getDate() + "日"
            });
            Monday.setDate(Monday.getDate() + 7);
            Sunday.setDate(Sunday.getDate() + 7);
        }
        this.setData({
            dates: dates,
            seatInfo: res.result
        })  
        console.log("seatInfo", res.result);
        console.log("dates", dates);
    },

    async bookSeat(event) {
        Dialog.confirm({
            title: '确定预定该周吗？',
            message: '每个人在一周之内最多可预约一次',
          })
            .then(() => {
                wx.cloud.callFunction({
                    name: "bookSeat",
                    data: {
                        seatID: this.data.seatID,
                        time: event.currentTarget.dataset.value
                    }
                }).then(res => {
                    console.log(res);
                    if (res.result.code === 200) {
                        Toast.success('预定成功');
                        this.querySeatInfo();
                    } else {
                        Toast.fail(res.result.message);
                    }                    
                });

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
            seatID: options.seatID
        });

        this.querySeatInfo();
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