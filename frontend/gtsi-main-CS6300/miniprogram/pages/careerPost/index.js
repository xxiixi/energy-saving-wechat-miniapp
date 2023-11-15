// pages/careerPost/index.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value:"value",
        currentDate:new Date(),
        title:"",
        description:"",
        date: '',
        show: false,
        radio: 'activity',
        isHurry:false,
        isTop:false,
        type:"activity",
        radioActType:"campus",
        actType:"campus",
        actArea:""
    },
    onClick(event){
        this.setData({
            type:event.target.dataset.name
        });
        console.log(this.data.type)
    },
    onClick2(event){
        this.setData({
            actType:event.target.dataset.name
        });
        console.log(this.data.actType)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

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
    publish(){
        if(this.data.title==""||this.data.description==""||this.data.date==""||this.actArea==""){
            Toast("You have empty input.");
            return;
        }
        if(this.data.type=="activity"){
            let sendData = {
                title:this.data.title,
                description:this.data.description,
                targetDate:this.data.date,
                actArea:this.data.actArea,
                actType:this.data.actType,
                type:this.data.type,
                isHurry:this.data.isHurry,
                isTop:this.data.isTop,
                isJob:false,
                origin:"GTSI",
            }
            Dialog.confirm({
                message: 'Are you sure to publish?',
                confirmButtonText:"Yes",
                cancelButtonText:"No"
              })
            .then(async () => {
                // on confirm
                let res = await wx.cloud.callFunction({
                    name:"addCard",
                    data:sendData
                });
                if(res.result.status){
                    Toast("Successfully published!");
                    this.setData({
                        title:"",
                        description:"",
                        actArea:""
                    })
                } else {
                    Toast(res.result.err);
                }
            })
            .catch(() => {
                // on cancel
            });
        } else {
            Toast("Post for Career type isn't available");
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    onDisplay() {
        this.setData({ show: true });
      },
    onClose() {
    this.setData({ show: false });
    },
    formatDate(date) {
        date = new Date(date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getYear()}`;
    },
    onConfirm(event) {
    this.setData({
        show: false,
        date: this.formatDate(event.detail),
    });
    },
    onChange(event) {
    this.setData({
        radio: event.detail,
    });
    },
    onChange2(event){
    this.setData({
        radioActType: event.detail,
    });
    },
    onChangeHurry({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ isHurry: detail });
    },
    onChangeTop({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ isTop: detail });
    },
})