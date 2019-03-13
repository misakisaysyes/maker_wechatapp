//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    call: '+',
    buttonAni: {},
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      
      console.log("用户个人空间页面")
      console.log("用户信息")
      console.log(userInfo)
      console.log('*************')
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

  release: function () {
    wx.navigateTo({
      url: '/pages/release/release?edit='+null,
    })
  },

  homepage_c1:function(){
    wx.navigateTo({
      url: '/pages/homepage_c/homepage_c?btn=创建'
    })
  },

  homepage_c2: function () {
    wx.navigateTo({
      url: '/pages/homepage_c/homepage_c?btn=点赞' 
    })
  },

  homepage_c3: function () {
    wx.navigateTo({
      url: '/pages/homepage_c/homepage_c?btn=收藏' 
    })
  },

  homepage_c4: function () {
    wx.navigateTo({
      url: '/pages/homepage_c/homepage_c?btn=历史'
    })
  }

})
