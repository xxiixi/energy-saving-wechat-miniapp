// app.js
const api = require("./API")
App({
    onLaunch() {
        wx.cloud.init({
            env: 'cloud1-8g0g789i329c687b',
            traceUser: true,
        });

        wx.cloud.callFunction({
                name: 'getUser'
            })
            .then(res => {
                if (res.result.data.length > 0) {
                    this.globalData.user = res.result.data[0];
                } else {
                    wx.reLaunch({
                        url: '/pages/index',
                    });
                }
            });
    },


    globalData: {
        user: {},
        publishButton: 0,
    }
})