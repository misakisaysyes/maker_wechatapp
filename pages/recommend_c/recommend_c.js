// pages/recommend_c/recommend_c.js
var app = getApp()
const AV = require('../../utils/av-weapp-min.js')
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx:0,
    user:'',
    content:'',
    item_c:'',
    call: '+',
    buttonAni: {},
    editflag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'content',
      success: function(res) {
        that.setData({
          content: res.data,
          idx: options.itemid,
          item_c:res.data[options.itemid]
        })
      },
    });

    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data,
          idx: options.itemid,
          item_c: res.data[options.itemid],
        });
      },
    });
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var i;
    for (i = 0; i < this.data.user.mycreation.length ; i = i + 1)
    {
     console.log(this.data.idx + "   " + this.data.user.mycreation[i])
    if (this.data.idx == this.data.user.mycreation[i]) {
        this.setData({
          editflag: true
        });
        break;
      }
    } 
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
          user:res.data
        })
      },
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

  release:function(){
    wx.navigateTo({
      url: '/pages/release/release?edit='+null,
    })
  },

  collect: function () {
    var tips = false
    var i;
    for (i = 0; i < this.data.user.mycollection.length; i = i + 1) {
      if (this.data.idx == this.data.user.mycollection[i]) {
        tips = true;
        break;
      }
    }
    if (!tips) {
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
      cion: 'success'
    });
  },

  favor: function (options) {
    var tips = false;
    var tipss;
    var i;
    for (i = 0; i < this.data.user.myfavor.length; i = i + 1) {
      if (this.data.idx == this.data.user.myfavor[i]) {
        this.data.user.myfavor.splice(i, 1);
        wx.setStorageSync('user', this.data.user)
        tipss = "已取消点赞"
        tips = true;

        //更新content中的favor-
        var renew_ = AV.Object.createWithoutData('Proj', this.data.content[this.data.idx].itemid);
        renew_.save().then(function (renew_) {
          renew_.increment('favor', -1);
          return renew_.save();
        }).then(function (renew_) {
          console.log('content_decrease成功')
        }, function (error) {
          console.log('content_decrease失败')
          console.log(error)
        });

        //删除relation
        var statusQuery1 = new AV.Query('Relation');
        statusQuery1.equalTo('userid', this.data.user.id);
        var statusQuery2 = new AV.Query('Relation');
        statusQuery2.equalTo('contentid', this.data.content[this.data.idx].itemid);
        var statusQuery3 = new AV.Query('Relation');
        statusQuery3.equalTo('relate', '点赞');
        var query = AV.Query.and(statusQuery1, statusQuery2, statusQuery3);
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
    if (!tips) {
      this.data.content[this.data.idx].favor += 1;
      this.data.content[this.data.idx].renew='Y';
      wx.setStorageSync('content', this.data.content);
      this.data.user.myfavor.push(this.data.idx);
      wx.setStorageSync('user', this.data.user);
      tipss = "已点赞"

      //更新content中的favor+
      var renew = AV.Object.createWithoutData('Proj', this.data.content[this.data.idx].itemid);
      renew.save().then(function (renew) {
        renew.increment('favor', 1);
        return renew.save();
      }).then(function (renew) {
        console.log('更新content成功')
      }, function (error) {
        console.log('更新content报错')
        console.log(error)
      });
      //在relaton中添加点赞条目
      var AddFavor = new AV.Object.extend('Relation');
      var addfavor = new AddFavor();
      addfavor.set('relate', '点赞')
      console.log('检测用户id')
      console.log(this.data.user.id)
      addfavor.set('userid', this.data.user.id);
      addfavor.set('contentid', this.data.content[this.data.idx].itemid);
      addfavor.save().then(function () {
        console.log('relation添加成功')
      }, function (error) {
        console.log('relation添加报错')
        console.log(error)
      });

      //更新数据库UserIn 主标签1 副标签0.6 次标签0.4
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

    wx.showToast({
      title: tipss,
      cion: 'success'
    });
  },

  edit:function(){
      wx.navigateTo({
        url: '../release/release?edit='+this.data.idx,
      })
  },

  backtore:function(){
    wx.switchTab({
      url: '../recommend/recommend',
    })
  }

})