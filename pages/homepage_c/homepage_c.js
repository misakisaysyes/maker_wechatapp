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
    btn:'',
    showarray:[],
    call: '+',
    buttonAni: {},
    showView:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

//////
    var that = this
    wx.getStorage({
      key: 'content',
      success: function (res) {
        that.setData({
          content: res.data,
        })
        wx.getStorage({
          key: 'user',
          success: function (res) {
            that.setData({
              user: res.data,
            })

            switch (that.data.btn) {
              case "创建":
                that.setData({
                  showarray: that.data.user.mycreation,
                });
                break;
              case "点赞":
                that.setData({
                  showarray: that.data.user.myfavor,
                });
                break;
              case "收藏":
                that.setData({
                  showarray: that.data.user.mycollection,
                });
                break;
              case "历史":
                that.setData({
                  showarray: that.data.user.myhistory,
                });
                break;
            }

            console.log('onready')
            console.log(that.data.user.mycreation);
            console.log(that.data.showarray);
            console.log('我的创建')
            console.log(that.data.content)

          }
        })
      }
    });
//////

    this.setData({
      btn:options.btn
    });
      showView:(options.showView  ==  "true"  ?  true  :  false)
      console.log('我的创建')
      console.log(this.data.content)
  },

  onChangeShowState:  function  ()  {
        var  that  =  this;
        that.setData({
            showView:  (!that.data.showView)
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
    var that=this;
    wx.getStorage({
      key: 'content',
      success: function (res) {
        that.setData({
          content: res.data,
        })
      
        wx.getStorage({
          key: 'user',
          success: function (res) {
            that.setData({
              user: res.data,
            })
          }
        })
      }
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

  delete_:function(e){
    console.log("delete");
    console.log(e); 
    var i = e.currentTarget.dataset.idx;
    var url_=''

    console.log(this.data.showarray);
    console.log('*'+i+'*');
    console.log(this.data.user);
    console.log(this.data.content[this.data.showarray[i]]);

    if(!this.data.showView)
    {
    console.log('删除');
    //在user中删除
    switch (this.data.btn) {
      case "创建":
        //在proj中删除相应的项
        var statusQuery1 = new AV.Query('Proj');
        statusQuery1.equalTo('objectId', this.data.content[this.data.showarray[i]].itemid);
        var query = AV.Query.and(statusQuery1);
        query.find().then(function (con) {
          var todotodo = AV.Object.createWithoutData('Proj', con[0].id);
          todotodo.destroy().then(function (success) {
            // 删除成功
          }, function (error) {
            // 删除失败
          });
        })
        this.data.user.mycreation.splice(i,1);
        this.data.content.splice(this.data.showarray[i],1);
        break;
      case "点赞":
        this.data.user.myfavor.splice(i, 1);
        //和取消点赞是一样的操作
        
        var table='';
        if (this.data.content[this.data.showarray[i]].tag=='新闻')
            table='News';
        else
            table='Proj';

        //更新content中的favor-
        var renew_ = AV.Object.createWithoutData(table, this.data.content[this.data.showarray[i]].itemid);
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
        statusQuery2.equalTo('contentid', this.data.content[this.data.showarray[i]].itemid);
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
      case "收藏":
        this.data.user.mycollection.splice(i, 1);
        //在relation中删除相应的项
        var statusQuery1 = new AV.Query('Relation');
        statusQuery1.equalTo('userid', this.data.user.id);
        var statusQuery2 = new AV.Query('Relation');
        statusQuery2.equalTo('contentid', this.data.content[this.data.showarray[i]].itemid);
        var statusQuery3 = new AV.Query('Relation');
        statusQuery3.equalTo('relate', '收藏');
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
      case "历史":
        this.data.user.myhistory.splice(i, 1);
        //在relation中删除相应的项
        var statusQuery1 = new AV.Query('Relation');
        statusQuery1.equalTo('userid', this.data.user.id);
        var statusQuery2 = new AV.Query('Relation');
        statusQuery2.equalTo('contentid', this.data.content[this.data.showarray[i]].itemid);
        var statusQuery3 = new AV.Query('Relation');
        statusQuery3.equalTo('relate', '浏览');
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
    } ;   
    //showarray中删除
    wx.setStorage({
      key: 'user',
      data: this.data.user,
    });
    wx.setStorage({
      key: 'content',
      data: this.data.content,
    })
    
    var tool_content=this.data.content;
    var tool_showarray=this.data.showarray;
    
    tool_content.splice(this.data.showarray[i], 1);
    tool_showarray.splice(i, 1);
    
    this.setData({
        content:tool_content,
        showarray:tool_showarray
    });
    console.log(this.data.showarray);
  }
  else
  {
    if(this.data.content[this.data.showarray[i]].tag=="项目")
      url_ = "../recommend_c/recommend_c?itemid=" + this.data.showarray[i];
    else
      url_ = "../news_c/news_c?newsid=" + this.data.showarray[i];
    wx.navigateTo({
      url: url_,
    })
  }
  }
})