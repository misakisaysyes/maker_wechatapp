var app = getApp()
const AV = require('../../utils/av-weapp-min.js')
var util = require('../../utils/util.js');

// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
    user:'',
    content:[],
    call: '+',
    buttonAni: {},
    buffer:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('news:onload函数')
    var that = this;
    wx.getStorage({
      key: 'content',
      success: function (res) {
          that.setData({
            content:res.data
          })
      }
    });
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
        console.log('news:onload检查user缓存')
        console.log(res.data)
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    console.log('news:onready函数')
    console.log('news:onready中显示初始content')
    console.log(this.data.content)

    //在这个地方取用户信息（创建，收藏，点赞）
    var user = {
      id: '',//直接从登录信息中读取
      preference: 0,//直接从_User中读取
      mycreation: [],//直接从proj中读取
      myfavor:[],//从realtion中找到对应userid的条目id,然后在content中查找
      mycollection: [],//从relation中找到对应的userid，然后在到content中查找
      myhistory: [],//从relation中找到对应的userid，然后再到contenr中查找
    };
    var content = this.data.content;
    var that=this;
    wx.getStorage({
      key: 'content',
      success:function(ress){
        console.log('news:onread从缓存中取content')
        content=ress.data
        console.log(content)
     
        wx.getStorage({
          key: 'userid',
          success: function (res) {
          console.log('news:从缓存中取用户id')
          user.id = res.data;
          console.log(user.id)
          //取用户创建
          for (var i = 0; i < content.length;i++)
            if(content[i].id!=""&&user.id==content[i].user_id)
              user.mycreation.push(i)
          console.log('news:用户创建初始化完成')
          console.log(user.mycreation)

          //取用户点赞收藏以及浏览历史
          console.log('news:取用户点赞收藏浏览时的前置检查，useid&&content')
          console.log(user.id);
          console.log(content)
          var buffer=[];
          var query_relation = new AV.Query('Relation');
          query_relation.find().then(function (items) {
          items.forEach(function (item) {
            var itemid = item.get('contentid');
            var relate = item.get('relate');
            var userid = item.get('userid');
            if(userid==user.id)
              buffer.push({ itemid, relate });
          });
          console.log('news:用户content长度检查和relation初始检查')
          console.log(content.length)
          console.log(buffer);
          for(var j=0;j<buffer.length;j++)
          {
              for(var i=0;i<content.length;i++)
              {
                  if (buffer[j].itemid == content[i].itemid)
                  {
                      if(buffer[j].relate=='点赞')
                      {
                         user.myfavor.push(i);
                      }else if(buffer[j].relate=='收藏'){
                         user.mycollection.push(i);
                      }else{
                         user.myhistory.push(i);
                      }
                  }
              }
          }
          console.log('news:user初始化完成缓存检查')
          console.log(user)
          //初始化完成后记得存入缓存中
          wx.setStorageSync('user', user)
        }, function (error) {
        console.log('news:用户点赞收藏浏览报错');
        console.log(error);
        });
      }
    });
    },
  });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;
    wx.getStorage({
      key: 'content',
      success: function (res) {
        that.setData({
          content: res.data
        })
      }
    });

    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data,
        })
        console.log('news:onshow用户缓存检查')
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

  //展开新闻
  news_unfold:function(res)
  {
      var id = res.currentTarget.dataset.idx;
      var cur_content=this.data.content;
      cur_content[id].show=!cur_content[id].show;
      this.setData({
        content: cur_content
      })

  },

  //长按跳转到新闻内容页面
  jumpnews:function(res){
    console.log('jumpnews:长按内容页面跳转检查')
    var content=this.data.content;
    content[res.currentTarget.dataset.idx].browse = content[res.currentTarget.dataset.idx].browse+1;
    //浏览量更新到数据库中
    var renewbrowse = AV.Object.createWithoutData('News', content[res.currentTarget.dataset.idx].itemid);
    renewbrowse.set('browse', content[res.currentTarget.dataset.idx].browse)
    renewbrowse.save()
    this.setData({
      content: content
    })

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
        url: '../news_c/news_c?newsid=' + res.currentTarget.dataset.idx,
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
  neww: function () {
    var content = this.data.content;
    var i, j, temp;
    for (j = 0; j < (content.length - 1 ); j++)
      for (i = 0; i < (content.length - 1 - j); i++) {
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
  hot: function () {
    var content = this.data.content;
    var  i, j, temp;
    for (j = 0; j < (content.length - 1 ); j++)
      for (i = 0; i < (content.length  - 1 - j); i++) {
        if (content[i].browse < content[i + 1].browse) {
          temp = content[i];
          content[i] = content[i + 1];
          content[i + 1] = temp;
        }
      }
    this.setData({
      content: content
    })
  },

  release:function(){
      wx.navigateTo({
        url: '/pages/release/release?edit='+null,
      })
  }
})