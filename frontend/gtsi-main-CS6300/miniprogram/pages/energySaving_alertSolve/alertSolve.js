// pages/energySaving_alertSolve/alertSolve.js
Page({
  data: {
    alertId: null,
    userId: '',
    comment: '',
    alertDetail: {}, 
    statusOptions: [
      { name: 'Select Status', value: null },
      { name: 'Open', value: 1 },
      { name: 'Close', value: 0 }
    ],
    selectedStatus: { name: 'Select Status', value: null },
    acStatus: null, // Store the selected air conditioner status
    switchStatus: null, // Store the selected switch status
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

  onACStatusChange: function(e) {
    const selected = this.data.statusOptions[e.detail.value];
    this.setData({ acStatus: selected.value });
  },

  onSwitchStatusChange: function(e) {
    const selected = this.data.statusOptions[e.detail.value];
    this.setData({ switchStatus: selected.value });
  },

  submitSolution: function() {
    const { alertId, userId, comment, acStatus, switchStatus, alertDetail } = this.data;
    
    if (!userId) {
      wx.showToast({
        title: 'Please enter User ID',
        icon: 'none'
      });
      return;
    }
    // Update AC status if needed
    if (acStatus !== null && acStatus !== alertDetail.ac_status) {
      this.setACStatus(acStatus, alertDetail.ac_id, alertDetail.room_id);
    }

    // Update Switch status if needed
    if (switchStatus !== null && switchStatus !== alertDetail.switch_status) {
      this.setSwitchStatus(switchStatus, alertDetail.window_id, alertDetail.room_id);
    }

    // Solve the alert
    wx.request({
      url: 'http://175.178.194.182:8080/alert/solve',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `alert_id=${alertId}&user_id=${userId}&comment=${encodeURIComponent(comment)}`,
      success: (res) => {
        if (res.statusCode === 200) {
          this.fetchUserRewards(userId, true); // Fetch rewards and navigate back
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

  setACStatus: function(status, sensorId, roomId) {
    wx.request({
      url: 'http://175.178.194.182:8080/airconditioner/status/set',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `status=${status}&sensor_id=${sensorId}&room_id=${roomId}`,
      fail: () => {
        wx.showToast({
          title: 'Failed to update AC status',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  setSwitchStatus: function(status, sensorId, roomId) {
    wx.request({
      url: 'http://175.178.194.182:8080/switch/status/set',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `status=${status}&sensor_id=${sensorId}&room_id=${roomId}`,
      fail: () => {
        wx.showToast({
          title: 'Failed to update Switch status',
          icon: 'none',
          duration: 2000
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