var time = require('./utils/util.js');
const AV = require('./utils/av-weapp-min.js');
AV.init({
  appId: 'NqFVYk1fUriNVxxuKynhEWjc-gzGzoHsz',
  appKey: 'oAo1ewMotNIbAXFBn7AiU5CB'
});

App({

  //全局变量
  data: {
    //测试数据
    test: 'test_show_globaldata',
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var content = [];
    var user={
      id:'',//直接从登录信息中读取
      preference:0,//直接从_User中读取
      mycreation:[],//直接从proj中读取
      myfavor:[],//从realtion中找到对应userid的条目id,然后在content中查找
      mycollection:[],//从relation中找到对应的userid，然后在到content中查找
      myhistory:[],//从relation中找到对应的userid，然后再到content中查找
    };
    var tag=[];
    
    //将news中的内容取到content中
    var query_news = new AV.Query('News');
    query_news.include(['tagid_']);
    query_news.find().then(function (items) {
      items.forEach(function (item) {
        var title = item.get('title');
        var text = item.get('text');
        var date = item.createdAt;
        var showdate=item.get('time');
        showdate=time.formatTimeTwo(showdate, 'Y/M/D h:m:s');
       
        var browse = item.get('browse');
        var favor = item.get('favor');
        var pic1 = item.get('pic');

        var sub_title = item.get('sub_title');
        var tagid_1 = item.get('tag1');
        var tagid_11 = item.get('tag2');
        var tagid_111 = item.get('tag3');

        var user_id='';
        var itemid=item.get('objectId');

        var tag = 'news';
        var member = 0;
        var show = false;
        var intro = '';
        var requi = '';
        var line = '';

        content.push({ title, text, date, browse, favor, pic1, sub_title, tag, member, show, tagid_1,tagid_11,tagid_111,intro, requi, line,user_id,itemid,showdate});
      });
      console.log('app:数据库中取news放入content中');
      console.log(content);
    }).then(function (items) {
      //执行查找news成功
      try {
        console.log('app:检查取到content中的news');
        console.log(content);
        console.log(content.length);
        wx.setStorageSync('content', content)
      } catch (e) {
        console.log('app:取新闻缓存error')
        console.log(e.error)
      }
    }, function (error) {
      //异常处理
      console.log('app:取新闻查询error')
      console.log(error)
   });

   //将proj中的内容取到content中
    var query_proj = new AV.Query('Proj');
    query_proj.include(['userid_']);
    query_proj.find().then(function (items) {
      items.forEach(function (item) {
        var title = item.get('title');
        var text = '';
        var date=item.createdAt;
        var showdate = item.get('time');
      
        var browse = item.get('browse');
        var favor = item.get('favor');
        var pic1 = item.get('pic');

        var sub_title = '';
        var tagid_1 = item.get('tag1');
        var tagid_11 = item.get('tag2');
        var tagid_111 = item.get('tag3');

        var userid=item.get('userid_');
        // var user_id=userid.id;
        var user_id ="5ab89157ac502e57c957b0be"
        var itemid=item.get('objectId');
      
        var tag = 'proj';
        var member = item.get('members');
        var show = false;
        var intro = item.get('introduction');
        var requi = item.get('requirement');
        var line = item.get('line');

        content.push({ title, text, date, browse, favor, pic1, sub_title, tag, member, show, tagid_1,tagid_11,tagid_111,intro, requi, line,user_id,itemid,showdate});
      });
      console.log('app:将proj取放入content中');
      console.log(content);
    }).then(function (items) {
      //执行查找content成功
      try {
        console.log('app:检查取到content中的proj');
        console.log(content);
        console.log(content.length);
        //查询成功后加标签
        wx.setStorageSync('content', content)
      } catch (e) {
        console.log('app:取proj缓存error')
        console.log(e.error)
      }

      //用户登录取userid，若用户是首次登录，则leancloud会自动在数据库中登记此用户
      var leanuser;
      AV.User.loginWithWeapp().then(user => {
        leanuser = user.toJSON();//将leancloud中的用户信息转化为json格式存在变量里
        wx.setStorageSync('userid', user.id);//将取出的用户id存在小程序的本地缓存里
        wx.setStorageSync('preference', leanuser.preference);//将取出的用户偏好值存在本地缓存里
        //查询数据库中的用户兴趣表，将用户兴趣表存到本地缓存里
        var userin = []
        var query_userin = new AV.Query('UserIn');
        query_userin.equalTo('userid',user.id)
        query_userin.find().then(function (items) {
          items.forEach(function (item) {
            var preference = item.get('preference');
            var tagid = item.get('tagid')
            userin.push({ preference, tagid });
          });
          wx.setStorageSync('userin', userin);
        })
        //判断用户是否为第一次登录，若用户为第一次登录则初始化用户的兴趣表项并抹去第一次登录的标记
        if(leanuser.preference==0)
        {
             var buffer=[]
             var getuser = AV.Object.createWithoutData('_User',user.id)
             var query_tag = new AV.Query('Tag')
             query_tag.find().then(function(con){
                  con.forEach(function(conn){
                    buffer.push(conn.get('objectId'))
                  })
             }).then(function(){
               for(var i=0;i<buffer.length;i++)
               {
                  var initUI = AV.Object.extend('UserIn') 
                  var initui=new initUI()
                  initui.set('userid',user.id)
                  initui.set('tagid',buffer[i])
                  initui.set('preference',0)
                  initui.save().then(function(){
                    console.log('初始化用户兴趣表成功')
                  },function(error){
                    console.log(error)
                  }) 
                }
             })
             leanuser.preference=0.000001   
             var renewpre = AV.Object.createWithoutData('_User', user.id);
             renewpre.set('preference', leanuser.preference)
             renewpre.save()
        }
        wx.setStorageSync('preference', leanuser.preference);
      }).catch(console.error);


      //用户登录,用户登录信息缓存
      try {
        wx.setStorageSync('user', user)
        console.log('app:缓存user检查')
        console.log(user)
      } catch (e) {
        console.log('app:缓存用户error')
        console.log(e.error)
      }

    }, function (error) {
      console.log('app:取proj查询error')
      console.log(error)
    });
    

    //取标签
    var query_news = new AV.Query('Tag');
    query_news.find().then(function (items) {
      items.forEach(function (item) {
        var id = item.id;
        var tagname = item.get('tag')
        tag.push({ id, tagname });
      });
      console.log('取标签')
      console.log(tag);
      wx.setStorageSync('tag', tag);
    })

  },

  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },

  globalData: {
    userInfo: null,
    user:{}
  }
})