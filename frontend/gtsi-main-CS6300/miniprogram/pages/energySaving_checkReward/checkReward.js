// pages/energySaving_checkReward/checkReward.js
Page({
  data: {
    userId: '777',      // User ID input
    rewardPoints: '' // To display reward points
  },

  handleUserIdInput: function(e) {
    this.setData({ userId: e.detail.value });
  },

  fetchUserRewards: function() {
    if (!this.data.userId) {
      wx.showToast({
        title: 'Please enter User ID',
        icon: 'none'
      });
      return;
    }

    const that = this;
    wx.request({
      url: 'http://175.178.194.182:8080/user/rewards',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `user_id=${this.data.userId}`,
      success(res) {
        if (res.statusCode === 200) {
          that.setData({ rewardPoints: res.data });
        } else {
          wx.showToast({
            title: 'Failed to fetch rewards',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: 'Network error',
          icon: 'none'
        });
      }
    });
  },


    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {

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