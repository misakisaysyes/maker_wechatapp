var app = getApp()
var app = getApp()
const AV = require('../../utils/av-weapp-min.js')
var util = require('../../utils/util.js');
Page({

  data:{
    content:[],//输入项目值
    user:'',
    preference:0,
    userin:[],//输入用户值
    showarray:[]
  },

  onLoad: function (){
    var temp_user=0;
    var selfW=[];
    console.log('interest_onload')
    var that=this
    wx.getStorage({
      key: 'user',
      success: function(res) {
          that.setData({
            user:res.data
          })
       
          wx.getStorage({
            key: 'userin',
            success: function (res) {
              that.setData({
                userin: res.data
              })

              for(var i=0;i<res.data.length;i++)
                temp_user = temp_user + res.data[i].preference * res.data[i].preference
            
            wx.getStorage({
              key: 'content',
              success: function (res) {
                that.setData({
                  content: res.data
                })
                
                var temp_item = 0;
                for(var i=0;i<res.data.length;i++){
                    temp_item=5*5+2*2+3*3
                    var f=0;
                    var temp_sum = 0;
                    for (var j = 0; j < that.data.userin.length;j++)
                    {
                      if (res.data[i].tagid_1 == that.data.userin[j].tagid)
                       {
                         temp_sum = temp_sum + that.data.userin[j].preference
                         f++
                       }
                      else if (res.data[i].tagid_11 == that.data.userin[j].tagid)
                       {
                         temp_sum = temp_sum + that.data.userin[j].preference
                         f++
                       }
                      else if (res.data[i].tagid_111 == that.data.userin[j].tagid)
                       {
                          temp_sum = temp_sum + that.data.userin[j].preference
                          f++
                       }
                       if(f==3)
                        break;
                    } 
                    var id,score;
                    id=i
                    score = temp_sum / Math.sqrt(temp_user * temp_item)
                    selfW.push({id,score})
                }
                
                var i, j, temp;
                for (j = 0; j < (selfW.length - 1 ); j++)
                  for (i = 0; i < (selfW.length - 1 - j); i++) {
                    if (selfW[i].score < selfW[i + 1].score) {
                      temp = selfW[i];
                      selfW[i] = selfW[i + 1];
                      selfW[i + 1] = temp;
                    }
                  }

                var showarray=[]
                for(var k=0;k<10;k++)
                {
                  showarray.push(that.data.content[selfW[k].id])
                }
                that.setData({
                  showarray:showarray
                })
              },
            })  
            
            },
         })
      },
    })   
  },

  onshow:function(){


  },

  onReady:function(){
    console.log('interest_onready')
    
  },

  btn: function (res) {
    if (this.data.content[res.currentTarget.dataset.idx].tag=='proj'){
      var content = this.data.content;
      content[res.currentTarget.dataset.idx].browse = content[res.currentTarget.dataset.idx].browse + 1;
      //浏览量更新到数据库中
      var renewbrowse = AV.Object.createWithoutData('Proj', content[res.currentTarget.dataset.idx].itemid);
      renewbrowse.set('browse', content[res.currentTarget.dataset.idx].browse)
      renewbrowse.save()
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
        url: '/pages/recommend_c/recommend_c?itemid=' + res.currentTarget.dataset.idx
      })
    }
    else{
      var content = this.data.content;
      content[res.currentTarget.dataset.idx].browse = content[res.currentTarget.dataset.idx].browse + 1;
      //浏览量更新到数据库中
      var renewbrowse = AV.Object.createWithoutData('News', content[res.currentTarget.dataset.idx].itemid);
      renewbrowse.set('browse', content[res.currentTarget.dataset.idx].browse)
      renewbrowse.save()
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
        url: '../news_c/news_c?newsid=' + res.currentTarget.dataset.idx,
      })
    }
  },

})