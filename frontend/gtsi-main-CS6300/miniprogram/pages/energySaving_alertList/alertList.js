// pages/energySaving_alertList/alertList.js
Page({
  data: {
    alerts: [],
    originalAlerts: [], // To store the original alerts data
    selectedStatus: '', // For status filter
    selectedSort: '', // For sorting criteria

    // Dropdown options for status filter
    statusOptions: [
      { text: 'All Statuses', value: '' },
      { text: 'Open', value: 0 },
      { text: 'Closed', value: 1 }
    ],

    // Dropdown options for sorting
    sortOptions: [
      { text: 'Default Sort', value: 'default' }, 
      { text: 'Sort by Room ID', value: 'room' },
      { text: 'Sort by Reward', value: 'reward' }
    ],
    selectedSort: 'default', 
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
          that.setData({
            originalAlerts: res.data.alerts
          });
          that.processAndFilterAlerts();
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

  processAndFilterAlerts: function() {
    let filteredAlerts = this.data.originalAlerts;

    // Filter by status
    if (this.data.selectedStatus !== '') {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === this.data.selectedStatus);
    }

    // Sort alerts
    switch (this.data.selectedSort) {
      case 'room':
        filteredAlerts.sort((a, b) => a.room_id - b.room_id);
        break;
      case 'reward':
        filteredAlerts.sort((a, b) => b.reward - a.reward);
        break;
      case 'default':
        // 默认排序逻辑（如果有的话），或者不做任何排序
        break;
    }
    // Process alerts for display
    const processedAlerts = filteredAlerts.map(alert => {
      return {
        ...alert,
        status_text: alert.status === 0 ? 'Open' : 'Closed'
      };
    });

    this.setData({
      alerts: processedAlerts
    });
  },

  onStatusChange: function(event) {
    this.setData({
      selectedStatus: event.detail
    });
    this.processAndFilterAlerts();
  },

  onSortChange: function(event) {
    this.setData({
      selectedSort: event.detail
    });
    this.processAndFilterAlerts();
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