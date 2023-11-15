import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';

// pages/addBook/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    isbn: '',
    title: '',
    author: '',
    edition: '',

    // 按钮状态
    isbnLoading: false,
    addLoading: false,

    // 底部弹窗
    showPopup: false,
    tags: ['ECE', 'CS', 'MID', 'ENVE', 'MSA', 'Others'],
    selectedTags: [],

    // book code action sheet
    showCode: false,
    codes: ['A', 'B', 'C'],
    code: '',
  },

  showCode() {
    this.setData({
      showCode: true
    })
  },

  closeCode() {
    this.setData({
      showCode: false
    })
  },

  changeCode(event) {
    this.setData({
      code: event.detail,
      showCode: false
    })
  },

  chooseCode(event) {
    this.setData({
      code: event.currentTarget.dataset.name,
      showCode: false
    });
  },

  toggleCode(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.code-${index}`);
    checkbox.toggle();
  },

  isbnLookup() {
    if (!this.data.isbn) {
      return Toast.fail('ISBN cannot be empty');
    }

    this.setData({
      isbnLoading: true
    });

    wx.cloud.callFunction({
      name: 'isbnLookup',
      data: {
        isbn: this.data.isbn
      }
    }).then(res => {
      const book = res.result.book;
      console.log(book);

      this.setData({
        fileList: [{
          url: book.image
        }],
        author: book.authors.join(" && "),
        title: book.title,
        edition: book.edition
      });

      Notify({
        type: 'success',
        message: '查询成功，如有误可以手动修改'
      });
    }).catch(err => {
      Notify({
        type: 'warning',
        message: '查询失败，需手动输入'
      });
    }).finally(() => {
      this.setData({
        isbnLoading: false
      });
    });
  },

  async addBook() {
    const {
      isbn,
      code,
      title,
      author,
      edition,
      selectedTags,
      fileList
    } = this.data;
    if (!isbn || !code || !title) {
      return Toast.fail('ISBN, title, book code are required');
    }

    this.setData({
      addLoading: true
    });
    wx.cloud.callFunction({
      name: 'addBook',
      data: {
        image: fileList.length === 0 ? '' : fileList[0].url,
        isbn: isbn,
        code: code,
        title: title,
        author: author,
        edition: edition,
        tags: selectedTags
      }
    }).then(res => {
      if (res.result) {
        wx.navigateTo({
          url: `/pages/book/index?bookID=${res.result}`,
        });
        Notify({
          type: 'success',
          message: '添加成功'
        });
      } else {
        Notify({
          type: 'warning',
          message: '添加失败，请稍后再试'
        });
      }
    }).catch(err => {
      Notify({
        type: 'warning',
        message: '添加失败，请稍后再试'
      });
    }).finally(() => {
      this.setData({
        addLoading: false
      });
    });
  },

  chooseTag(event) {
    this.setData({
      selectedTags: event.detail,
    });
  },

  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},

  showPopup() {
    this.setData({
      showPopup: true
    })
  },

  closePopup() {
    this.setData({
      showPopup: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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