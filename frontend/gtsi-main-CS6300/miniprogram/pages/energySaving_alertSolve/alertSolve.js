// pages/energySaving_alertSolve/alertSolve.js
Page({
  data: {
    alertId: null,
    userId: '',
    comment: '',
    alertDetail: {} // Store the alert details
  },

  onLoad: function(options) {
    this.setData({ alertId: options.alertID });
    this.fetchAlertDetail(options.alertID); // Fetch the alert details
  },
  
  fetchAlertDetail: function (alertID) {
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
          // add corresponding reward points to current user
          this.fetchUserRewards(userId);
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

  fetchUserRewards: function(userId, navigateBack) {
    wx.request({
      url: 'http://175.178.194.182:8080/user/rewards',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `user_id=${userId}`,
      success: (res) => {
        if (res.statusCode === 200) {
          const updatedPoints = res.data; // Assuming the response is just the points value
          wx.showToast({
            title: `New Reward Points: ${updatedPoints}`,
            icon: 'success',
            duration: 3000 // Adjust as needed
          });
  
          // If navigateBack flag is true, navigate back after showing toast
          if (navigateBack) {
            setTimeout(() => {
              wx.navigateBack();
            }, 3000); // Adjust delay to match toast duration
          }
  
          // Optionally update local user data or state with the new points
        }
      },
      fail: () => {
        wx.showToast({
          title: 'Failed to fetch updated rewards',
          icon: 'none'
        });
  
        // Navigate back even if rewards fetch fails
        if (navigateBack) {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000); // Shorter delay if failed
        }
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