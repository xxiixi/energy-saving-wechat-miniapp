Page({

  data: {
    alerts: []
  },

  onLoad: function(options) {
    // Your code to fetch alerts...
  },

  onAlertTap: function(event) {
    const alertId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/alertDetail/alertDetail?alertId=' + alertId
    });
  },

  // Other lifecycle methods and functions...
});
