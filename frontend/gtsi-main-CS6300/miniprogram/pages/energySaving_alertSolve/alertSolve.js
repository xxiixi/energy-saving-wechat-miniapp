// pages/energySaving_alertSolve/alertSolve.js
  Page({
    data: {
      alertId: null,
      userId: '777',
      comment: '',
      alertDetail: {}, 
      statusOptions: [
        { name: 'Select Status', value: null },
        { name: 'Open', value: 1 },
        { name: 'Close', value: 0 }
      ],
      selectedStatus: { name: 'Select Status', value: null },
      // acStatus: null, // Store the selected air conditioner status
      // switchStatus: null, // Store the selected switch status
    },

    onLoad: function(options) {
      this.setData({ alertId: options.alertID });
      this.fetchAlertDetail(options.alertID); // Fetch the alert details
    },
    
    fetchAlertDetail: function(alertID) {
      wx.request({
        url: 'http://175.178.194.182:8080/alert/list',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
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
    },

    handleUserIdChange: function(e) {
      this.setData({ userId: e.detail });
    },

    handleCommentChange: function(e) {
      this.setData({ comment: e.detail });
    },

    submitSolution: function() {
      const { alertId, userId, comment, alertDetail } = this.data;

      wx.request({
        url: 'http://175.178.194.182:8080/alert/solve',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `alert_id=${alertId}&user_id=${userId}&comment=${encodeURIComponent(comment)}`,
        success: (res) => {
          if (res.statusCode === 200) {
            wx.showToast({
              title: 'Alert solved successfully',
              icon: 'success',
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
          }
        },
        fail: () => {
          wx.showToast({
            title: 'Failed to solve alert',
            icon: 'none'
          });
        }
      });
    },

    goBack: function() {
      wx.navigateBack({
        delta: 1 
      });
    },


    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom() {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() {

    }
})