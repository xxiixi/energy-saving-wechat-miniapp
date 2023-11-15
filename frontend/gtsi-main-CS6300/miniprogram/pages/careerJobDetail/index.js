// pages/careerJobDetail/index.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        card:{
            // title:"Software Engineer",
            // isHurry:true,
            // description:"Bachelor's degree or equivalent practical experience. 5 years of experience with software development in one or more programming languages, and with data structures/algorithms. 3 years of experience testing, maintaining, and/or launching software products, and 1 year of experience with software design and architecture",
            // salary:"30k-50k",
            // origin:"Google",
            // publishDate:"3/15/2023",
            // targetDate:"ASAP",
            // isTop:false
        },
        isFollow:false,
        cardId:"",
        role:"",
        gtid:"",
        name:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        console.log(options);
        if(!options.id) return;
        // wx.request({
        //     url: 'http://localhost:8088/info/getCardsById',
        //     method:'POST',
        //     data:{
        //         _id:options.id
        //     },
        //     success:(res)=>{
        //         console.log(res.data.data);
        //         if(res.data.data!=null){
        //             this.setData({
        //                 card:res.data.data[0]
        //             })
        //         } 
        //     }
        //   })
        let res = await wx.cloud.callFunction({
            name:"getCardDetail",
            data:{
                _id:options.id
            }
        });
        let resData = res.result;
        if(res.result.length!=0||res.result.length!=null){
            this.setData({
                card:res.result[0]
            })
        }
        let gtid = wx.getStorageSync("gtid");
        let name = wx.getStorageSync('name');
        let role = wx.getStorageSync('role');
        this.setData({
            gtid:gtid,
            name:name,
            role:role,
            cardId:options.id
        });
        if(resData[0].bookList.indexOf(gtid)!=-1){
            this.setData({
                isFollow:true
            })
        }
        console.log(gtid,name,role,this.data.cardId);
    },
    async apply(){
        console.log("click!");
        if(this.data.isRegisted){
            Toast("You have been followed")
        }
        Toast.loading({
            duration: 0,
            message: 'Returning...',
            forbidClick: true,
        });
        if(this.data.name==null||this.data.name==""){
            Toast("As a student, you need to set your name at first in the user page!")
        }
        if(this.data.role=="admin"){
            Toast("admin can not apply for this card");
        } else if(this.data.role=="student"){
            //call function
            let sendData={
                role:this.data.role,
                gtid:this.data.gtid,
                cardId:this.data.cardId,
                option:"register"
            }
            let res = await wx.cloud.callFunction({
                name:"activityReg",
                data:sendData
            });
            Toast("You have registered this activity");

            if(res.result.status){
                this.setData({
                    isFollow:true
                });
            } else {
                Toast("Something get wrong, try again later.");
            }

        }
    },
    async cancel(){
        Toast.loading({
            duration: 0,
            message: 'Returning...',
            forbidClick: true,
        });
        let sendData={
            role:this.data.role,
            gtid:this.data.gtid,
            cardId:this.data.cardId,
            option:"cancel"
        }
        let res = await wx.cloud.callFunction({
            name:"activityReg",
            data:sendData
        });
        if(res.result.status){
            this.setData({
                isFollow:false
            });
            Toast("You have cancelled this activity");
        } else {
            Toast("Something get wrong, try again later.");
        }
        
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: `"${this.data.card.title}" activity card shared in GTSI Career Service`,
        }
    }
})