var app = getApp()
const AV = require('../../utils/av-weapp-min.js')
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'', 
    content:'',
    idx:0,
    news_c:'',
    call: '+',
    buttonAni: {},
    addfavor:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this;
    wx.getStorage({
      key: 'content',
      success: function (res) {
          that.setData({
            content:res.data,
            idx:options.newsid,
            news_c: res.data[options.newsid],
          })
      }
    });

    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          user: res.data,
          idx: options.newsid,
          news_c: res.data[options.newsid],
        })
        console.log("我是你缓存爸爸")
      },
    })
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
      },
    })

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

  collect:function(){
     var tips = false
     var i;
     for (i = 0; i < this.data.user.mycollection.length; i = i + 1) {
       if (this.data.idx == this.data.user.mycollection[i]) {
         tips = true;
         break;
       }
     }
     if(!tips)
     {
       this.data.user.mycollection.push(this.data.idx);

       //在relaton中添加收藏条目
       var AddFavor = new AV.Object.extend('Relation');
       var addfavor = new AddFavor();
       addfavor.set('relate', '收藏')
       console.log('检测用户id')
       console.log(this.data.user.id)
       addfavor.set('userid', this.data.user.id);
       addfavor.set('contentid', this.data.content[this.data.idx].itemid);
       addfavor.save().then(function () {
         console.log('relation收藏添加成功')
       }, function (error) {
         console.log('relation收藏添加报错')
         console.log(error)
       });

       wx.setStorageSync('user', this.data.user);


       //更新数据库UserIn 主标签1.5 副标签0.9 次标签0.6
       var renewU = new AV.Query('UserIn');
       renewU.equalTo('tagid', this.data.content[this.data.idx].tagid_1);
       renewU.find().then(function (results) {
         var obj = results[0];
         obj.increment('preference', 1.5);
         return obj.save();
       })
       var renewUU = new AV.Query('UserIn');
       renewUU.equalTo('tagid', this.data.content[this.data.idx].tagid_11);
       renewUU.find().then(function (results) {
         var obj = results[0];
         obj.increment('preference', 0.9);
         return obj.save();
       })
       var renewUUU = new AV.Query('UserIn');
       renewUUU.equalTo('tagid', this.data.content[this.data.idx].tagid_111);
       renewUUU.find().then(function (results) {
         var obj = results[0];
         obj.increment('preference', 0.6);
         return obj.save();
       })

     }
     wx.showToast({
       title: '已收藏',
       cion:'success'
     });
  },

  favor:function(options){
    var tips = false;
    var tipss;
    var i;

    //检查用户意图是点赞还是取消点赞
    for (i = 0; i < this.data.user.myfavor.length; i = i + 1) {//遍历当前用户点赞记录列表
      if (this.data.idx == this.data.user.myfavor[i]) {//若发现当前点赞内容用户点赞列表中已存在
        this.data.user.myfavor.splice(i, 1);//意图确为取赞则删除这条点赞记录
        wx.setStorageSync('user', this.data.user)//意图确为取赞则更新缓存中的点赞列表
        tipss = "已取消点赞" //意图确为取赞则设置提示字符
        tips = true;
        this.setData({
          addfavor:-1
        })
        //意图确为取赞则更新项目表中的点赞字段
          var renew_ = AV.Object.createWithoutData('News', this.data.content[this.data.idx].itemid);
          renew_.save().then(function (renew_) {
          renew_.increment('favor', -1);
          return renew_.save();
        }).then(function (renew_) {
        }, function (error) {
        });
        //意图确为取赞则删除关系表中这条点赞记录
          var statusQuery1 = new AV.Query('Relation');
          statusQuery1.equalTo('userid', this.data.user.id);
          var statusQuery2 = new AV.Query('Relation');
          statusQuery2.equalTo('contentid', this.data.content[this.data.idx].itemid);
          var statusQuery3 = new AV.Query('Relation');
          statusQuery3.equalTo('relate', '点赞');
          var query = AV.Query.and(statusQuery1, statusQuery2,statusQuery3);
          query.find().then(function (con) {
            var todotodo = AV.Object.createWithoutData('Relation', con[0].id);
            todotodo.destroy().then(function (success) {
              // 删除成功
            }, function (error) {
              // 删除失败
            });
          })
        
        break;
      }
    }

     //若用户意图为点赞此条目
     if(!tips)
     {
        this.data.content[this.data.idx].favor+=1;//若用户点赞则更新缓存中此项目的点赞数
        this.data.content[this.data.idx].renew='Y';
        wx.setStorageSync('content', this.data.content)//更新缓存
        this.data.user.myfavor.push(this.data.idx)//将点赞记录添加到缓存
        wx.setStorageSync('user', this.data.user)//更新缓存
        tipss="已点赞"//设置提示语
        this.setData({
          addfavor: 1
        })
          //更新数据库中项目表中相应项目的favor字段
          var renew = AV.Object.createWithoutData('News', this.data.content[this.data.idx].itemid);
          renew.save().then(function (renew) {
          renew.increment('favor', 1);
          return renew.save();
        }).then(function (renew) {}, function (error) {});
          //在关系表中添加此点赞条目
          var AddFavor = new AV.Object.extend('Relation');
          var addfavor = new AddFavor();
          addfavor.set('relate','点赞')
          addfavor.set('userid', this.data.user.id);
          addfavor.set('contentid', this.data.content[this.data.idx].itemid);
          addfavor.save().then(function () {}, function (error) {});
          //更新数据库中用户表中相应用户的偏好值和用户兴趣表 （主标签1 副标签0.6 次标签0.4）
          var renewU = new AV.Query('UserIn');
          renewU.equalTo('tagid', this.data.content[this.data.idx].tagid_1);
          renewU.find().then(function (results) {
            var obj = results[0];
            obj.increment('preference', 1);
            return obj.save();
          })
          var renewUU = new AV.Query('UserIn');
          renewUU.equalTo('tagid', this.data.content[this.data.idx].tagid_11);
          renewUU.find().then(function (results) {
            var obj = results[0];
            obj.increment('preference', 0.6);
            return obj.save();
          })
          var renewUUU = new AV.Query('UserIn');
          renewUUU.equalTo('tagid', this.data.content[this.data.idx].tagid_111);
          renewUUU.find().then(function (results) {
            var obj = results[0];
            obj.increment('preference', 0.4);
            return obj.save();
          })
     }
    
    //弹出提示语
     wx.showToast({
       title: tipss,
       cion: 'success'
     });
  }

})