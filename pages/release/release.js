// pages/release1.0/release.js
var app = getApp()
const AV = require('../../utils/av-weapp-min.js')
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    /*测试数据集*/
    tagarray: [[], [], []],  
    tagindex: [0, 0, 0],  
    /**/

    content: [],
    user: {},
    showtag: [],
    index: 0,
    index1: 0,
    index2: 0,
    edit: '',

    itemid: '',
    title: '',
    text: '',
    member:'',
    pic1: '',
    intro: '',
    requi: '',
    line: '',

    focus: false,
    dateValue: '1900/4/1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowdate = util.formatTime(new Date());
    this.setData({
      dateValue: nowdate
    })

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
          user: res.data
        })
      }
    });

    wx.getStorage({
      key: 'line',
      success: function (res) {
        that.setData({
          line: res.data
        })
      }
    });

    var tag = [];
    wx.getStorage({
      key: 'tag',
      success: function (res) {
        tag = res.data;
        var tagbuffer = [[],[],[]];
        for (var i = 0; i < tag.length; i++)
        {
          tagbuffer[0].push(tag[i].tagname);
          tagbuffer[1].push(tag[i].tagname);
          tagbuffer[2].push(tag[i].tagname);
        }
        that.setData({
          tagarray: tagbuffer
        })
      }
    });

    this.setData({
      edit: options.edit
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.edit != 'null') {
      console.log("onready")
      console.log(this.data.edit)
      console.log(this.data.content[this.data.edit])
      this.setData({
        title: this.data.content[this.data.edit].title,
        member: this.data.content[this.data.edit].member,
        intro: this.data.content[this.data.edit].intro,
        requi: this.data.content[this.data.edit].requi,
        line: this.data.content[this.data.edit].line,
        itemid: this.data.content[this.data.edit].itemid,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'tag',
      success: function (res) {
        that.setData({
          tag: res.data
        })
        console.log(that.data.tag);
      }
    });
    wx.getStorage({
      key: 'line',
      success: function (res) {
        that.setData({
          line: res.data
        })
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

  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },

  titleadd: function (e) {
    console.log('title:' + e.detail.value);
    this.setData({
      title: e.detail.value
    })
  },

  memberadd: function (e) {
    console.log('member:' + e.detail.value)
    this.setData({
      member: parseInt(e.detail.value)
    })
  },

  introadd: function (e) {
    console.log('intro:' + e.detail.value)
    this.setData({
      intro: e.detail.value
    })
  },

  requiadd: function (e) {
    console.log('requi:' + e.detail.value)
    this.setData({
      requi: e.detail.value
    })
  },

  lineadd: function (e) {
    console.log('line:' + e.detail.value)
    this.setData({
      line: e.detail.value
    })
  },

  btnadd: function (e) {
    var item = {
      title: this.data.title,
      text: this.data.text,
      showdate: this.data.dateValue,
      browse: 0,
      member: this.data.member,
      favor: 0,
      tag: 'proj',
      pic1: this.data.pic1,
      show: false,
      intro: this.data.intro,
      requi: this.data.requi,
      line: this.data.line,
      sub_title: '',

      tagid: '标签',
      user_id: '',
      itemid: this.data.itemid,

    };

    var navid;

    console.log('release_edit' + this.data.edit)
    console.log('release_over')
    if (this.data.edit == 'null') {
      this.data.content.push(item);
      this.data.user.mycreation.push(this.data.content.length - 1)
      wx.setStorageSync('user', this.data.user)
      navid = this.data.content.length - 1;
      console.log("新建测试等于null")
      console.log(this.data.user)
    }
    else {
      this.data.content[this.data.edit] = item;
      navid = this.data.edit;
    }
    wx.setStorageSync('content', this.data.content)

    if (this.data.edit == 'null') {
      //将新建项目写会数据库中并且将新建项目存入缓存中
      var getuser = AV.Object.createWithoutData('_User', this.data.user.id);
      var AddProj = new AV.Object.extend('Proj');
      var addproj = new AddProj();
      addproj.set('requirement', item.requi);
      addproj.set('browse', item.browse);
      addproj.set('time', item.showdate);
      addproj.set('tag1', this.data.tag[this.data.index].id);
      addproj.set('tag2', this.data.tag[this.data.index1].id);
      addproj.set('tag3', this.data.tag[this.data.index2].id);
      addproj.set('title', item.title);
      addproj.set('favor', item.favor);
      addproj.set('line', item.line);
      addproj.set('userid_', getuser);
      addproj.set('pic', item.pic1);
      addproj.set('introduction', item.intro);
      addproj.set('members', item.member);
      addproj.save().then(function () {

        var buffer;
        wx.getStorage({
          key: 'content',
          success: function (res) {
            buffer = res.data
            buffer[buffer.length - 1].itemid = addproj.id
            wx.setStorageSync('content', buffer)
          },
        })

      },
        function (error) {
          console.log("项目写入数据库失败")
          console.log(error)
        }
      );
    }
    else {
      //修改此条信息
      console.log('修改前奏')
      console.log(this.data.content)
      console.log("************")
      console.log(this.data.edit)
      console.log("************")
      console.log(this.data.content[this.data.edit].itemid)

      var renew = AV.Object.createWithoutData('Proj', this.data.content[this.data.edit].itemid);
      renew.set('requirement', item.requi);
      renew.set('browse', item.browse);
      renew.set('time', item.showdate);
      renew.set('tag1', this.data.tag[this.data.index].id);
      renew.set('tag2', this.data.tag[this.data.index1].id);
      renew.set('tag3', this.data.tag[this.data.index2].id);
      renew.set('title', item.title);
      renew.set('favor', item.favor);
      renew.set('line', item.line);
      renew.set('userid_', getuser);
      renew.set('pic', item.pic1);
      renew.set('introduction', item.intro);
      renew.set('members', item.member);
      renew.save().then(function () { },
        function (error) {
          console.log("项目更新数据库失败")
          console.log(error)
        }
      );
    }

    console.log("releasedebug_导航" + navid);
    wx.navigateTo({
      url: '../recommend_c/recommend_c?itemid=' + navid,
    })
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      tagindex: e.detail.value
    })
  },

  bindMultiPickerColumnChange:function(e){
    var tagindex=[0,0,0];
    tagindex=this.data.tagindex;
    tagindex[e.detail.column]=e.detail.value;
    this.setData({
        tagindex:tagindex
    })
  }

})