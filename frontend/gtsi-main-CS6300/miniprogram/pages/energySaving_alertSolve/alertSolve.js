// pages/energySaving_alertSolve/alertSolve.js
// pages/alertSolve/alertSolve.js
Page({
  data: {
    alertId: null,
    userId: '',
    comment: ''
  },

  onLoad: function(options) {
    this.setData({ alertId: options.alertID });
  },

  handleUserIdChange: function(e) {
    this.setData({ userId: e.detail.value });
  },

  handleCommentChange: function(e) {
    this.setData({ comment: e.detail.value });
  },

  submitSolution: function() {
    const { alertId, userId, comment } = this.data;
    if (!userId) {
      wx.showToast({
        title: 'Please enter User ID',
        icon: 'none'
      });
      return;
    }
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
            complete: () => {
              // Navigate back after a short delay
              setTimeout(() => {
                wx.navigateBack();
              }, 1000); // Adjust delay as needed
            }
          });
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