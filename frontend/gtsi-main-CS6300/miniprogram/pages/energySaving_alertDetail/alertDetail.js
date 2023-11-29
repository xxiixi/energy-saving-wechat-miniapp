// pages/alertDetail/alertDetail.js
Page({
  data: {
    alertDetail: {}
  },

  onLoad: function (options) {
    const alertID = options.alertID;
    this.fetchAlertDetail(alertID);
  },

  fetchAlertDetail: function (alertID) {
    wx.request({
      url: 'http://175.178.194.182:8080/alert/list',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          // Find the specific alert by ID
          const alert = res.data.alerts.find(a => a.id === parseInt(alertID));
          if (alert) {
            this.setData({ alertDetail: alert });
          } else {
            wx.showToast({
              title: 'Alert not found',
              icon: 'none'
            });
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: 'Failed to load alert details',
          icon: 'none'
        });
      }
    });
  }
});
