// pages/energySaving_alertList/alertList.js
Page({

  data: {
    alerts: []
  },

  onLoad(options) {
    this.fetchAlerts();
  },
  fetchAlerts: function() {
    const that = this;
    wx.request({
      url: 'http://175.178.194.182:8080/alert/list',
      method: 'GET',
      success(res) {
        if (res.statusCode === 200) {
          that.processAlerts(res.data.alerts);
        }
      },
      fail() {
        wx.showToast({
          title: 'Failed to load alerts',
          icon: 'none'
        });
      }
    });
  },

  processAlerts: function(alerts) {
    const processedAlerts = alerts.map(alert => {
      return {
        ...alert,
        status_text: alert.status === 0 ? 'Open' : 'Closed'
      };
    });

    this.setData({
      alerts: processedAlerts
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },


  onShow: function() {
    // Fetch the alerts every time the page is shown
    this.fetchAlerts();
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