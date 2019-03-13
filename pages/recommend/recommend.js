var app=getApp()
var app = getApp()
const AV = require('../../utils/av-weapp-min.js')
var util = require('../../utils/util.js');
// pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    content:[],
    call: '+',
    buttonAni: {},
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this
    wx.getStorage({
      key: 'content',
      success: function (res) {
        that.setData({
          content: res.data,
        })
        console.log('recommend:onload检查缓存content')
        console.log(res.data)
      }
    });
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data,
        })
        console.log('recommend:onload检查缓存user')
        console.log(res.data)
      }
    });
    /*wx.getStorage({
      key: 'userid',
      success: function (res) {
        console.log('recommend')
        console.log(res.data)
      }
    });*/
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'content',
      success: function (res) {
        that.setData({
          content: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'userid',
      success: function (res) {
        console.log('recommend')
        console.log(res.data)
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  //点击跳转_1
  recommend_c:function(res){

    var content = this.data.content;
    content[res.currentTarget.dataset.idx].browse = content[res.currentTarget.dataset.idx].browse + 1;
    //浏览量更新到数据库中
    var renewbrowse = AV.Object.createWithoutData('Proj', content[res.currentTarget.dataset.idx].itemid);
    renewbrowse.set('browse', content[res.currentTarget.dataset.idx].browse)
    renewbrowse.save()


    //更新数据库UserIn 主标签0.5 副标签0.3 次标签0.2
    var renewU = new AV.Query('UserIn');
    renewU.equalTo('tagid', content[res.currentTarget.dataset.idx].tagid_1);
    renewU.find().then(function (results) {
      var obj = results[0];
      obj.increment('preference', 0.5);
      return obj.save();
    })
    var renewUU = new AV.Query('UserIn');
    renewUU.equalTo('tagid', content[res.currentTarget.dataset.idx].tagid_11);
    renewUU.find().then(function (results) {
      var obj = results[0];
      obj.increment('preference', 0.3);
      return obj.save();
    })
    var renewUUU = new AV.Query('UserIn');
    renewUUU.equalTo('tagid', content[res.currentTarget.dataset.idx].tagid_111);
    renewUUU.find().then(function (results) {
      var obj = results[0];
      obj.increment('preference', 0.2);
      return obj.save();
    })


    this.setData({
      content: content
    })
    wx.setStorage({
      key: 'content',
      data: this.data.content,
    })
    
    this.data.user.myhistory.push(res.currentTarget.dataset.idx);
    wx.setStorage({
      key: 'user',
      data: this.data.user,
    })
    wx.navigateTo({
      url: '/pages/recommend_c/recommend_c?itemid='+res.currentTarget.dataset.idx
    })
  },

  //点击跳转_2
  release:function(){
    wx.navigateTo({
      url:'/pages/release/release?edit='+null,
    })
  },

  //悬浮按钮的动画
  float: function () {
    var that = this;
    var ani = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    });
    if (that.data.call === "+") {
      var call = "-";
      ani.width(32).height(32).rotate(360).step();
    } else {
      var call = "+";
      ani.width(0).height(0).step();
    }
    console.log(ani);
    that.setData({
      buttonAni: ani.export(),
      call: call
    });
  },

  //按时间排序
  neww:function(){
   var content=this.data.content;
   var i,j,temp;
   for (j = 0; j < (content.length - 1 ); j++)
     for (i = 0; i < (content.length  - 1 - j); i++) {
       if (content[i].date < content[i + 1].date) {
         temp = content[i];
         content[i] = content[i + 1];
         content[i + 1] = temp;
       }
     }
   this.setData({
     content: content
   })
  },

  //按热度排序
  hot:function(){
      var content=this.data.content;
      var i,  j,  temp;
      for  (j  =  0;  j  <  (content.length-1 );  j++)
           for  (i  =  0;  i  <  (content.length -1-j);  i++){
                 if (content[i].browse  <  content[i  +  1].browse){
                     temp  =  content[i];
                     content[i]  =  content[i  +  1];
                     content[i  +  1]  =  temp;
                  }
           }
      this.setData({
        content:content
      })
  }
     
})