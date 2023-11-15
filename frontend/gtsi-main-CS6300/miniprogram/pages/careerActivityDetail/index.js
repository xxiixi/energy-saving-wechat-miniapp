// pages/careerActivityDetail/index.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        card:{
            // title:"How to write CV",
            // description:"You’ve found the perfect job opportunity. You send your CV and you breathlessly wait for the call-back… but it never happens. Sound familiar? Yeah, it does for most of us. But how’s that possible?",
            // publishDate:"3/15/2023",
            // origin:"GTSI",
            // actArea:"Room 408",
            // actType:"Campus",
            // targetDate:"Thursday, March 16, 2023, 16:00-17:00"
        },
        cardId:"",
        role:"",
        gtid:"",
        name:"",
        isRegisted:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    jumpToRegList(){
        wx.navigateTo({
          url: `/pages/careerRegStudents/index?cardId=${this.data.cardId}`,
        })
    },
    deleteCard(){
        Dialog.confirm({
            message: 'Are you sure to delete?After delete, the registration record would be deleted too.',
            confirmButtonText:"Yes",
            cancelButtonText:"No"
          })
        .then(async () => {
            // on confirm
            Toast.loading({
                duration: 0,
                message: 'Returning...',
                forbidClick: true,
            });
            console.log("delete");
            let res = await wx.cloud.callFunction({
                name:"deleteCard",
                data:{
                    cardId:this.data.cardId
                }
            });
            if(res.result.status){
                Toast('Successfully delete it!');
                wx.navigateBack({
                    delta: 1,  // 返回上一页
                    success: function(res){
                      // 通过options参数传递参数
                      wx.navigateTo({
                        url: '/pages/careerActivity/index'
                      })
                    }
                  })
            }
        })
        .catch(() => {
            // on cancel
        });
    },
    async onLoad(options) {
        console.log(options.id)
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
                card:resData[0],
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
                isRegisted:true
            })
        }
        console.log(gtid,name,role,this.data.cardId);
    },
    async apply(){
        console.log("click!");
        if(this.data.isRegisted){
            Toast("You have been registered")
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
            Toast("admin can not apply for activity");
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
                    isRegisted:true
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
                isRegisted:false
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