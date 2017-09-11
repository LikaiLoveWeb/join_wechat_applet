//app.js
var app = getApp(); 
var wxToast = require('toast/toast.js')
App({
   wxToast,
  onLaunch: function() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('logs')
    var that=this;
    wx.login({
      success: function (res) {
        //console.log("//////////")
        //console.log(res.code);
        var code = res.code;
        wx.request({
          url: 'https://api.joinsilk.com/getOpenId',
          data: {
            code: code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (ress) {
          console.log(ress.data.data+'----------------------------------------')
           that.globalData.wxAccount = ress.data.data;
           that.wxTokenFN(ress.data.data);
           //that.globalData.wxAccount = 'o1Arv0EHcQN_xF_7tpY5xX3_2EZs'//o1Arv0EHcQN_xF_7tpY5xX3_2EZs
            //console.log(that.globalData.wxAccount + '--------------------------');
          },
          fail:function(){
            console.log("//////")
          }
        })
      }
    });
   // isLogin(that.globalData.wxAccount,'sort/sort');
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    //console.log(logs+"_____________________________________________________")
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //console.log(logs+"mmmmmmmmmmmmm")
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
             
            },
            fail:function(res){
              if (res.errMsg == 'getUserInfo:fail auth deny'){
                console.log('----------------------------------')
                var a = {
                  'nickName':'你猜猜我是谁',
                  'avatarUrl':'../images/user_l.png'
                }
                that.globalData.userInfo = a;
                console.log(that.globalData.userInfo)
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            },
            complete:function(res){

            }
          })
        }
      })
    }
  },
  //更改圖片
  returnHandlerDetail: function (deatil) {
    var imgurlList = [];
    var deatels = deatil.split("/File");
    console.log(deatels[1])
    for (var i = 0; i < deatels.length; i++) {
      if (deatels[i].startsWith("/download")) {        
        var d = deatels[i].substring(0, 31);
        d = "https://api.joinsilk.com/File" + d
        imgurlList.push(d);       
      }
    }
    //console.log(imgurlList)
    return imgurlList;
  },
  getLogin:function(e,u){
    var token = wx.getStorageSync('token');//获取token
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfuser/wexinLogin',
      method: 'GET',
      data: {
        token: token,
        weChat: e  //微信号
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data + '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\');
        if (res.data.httpCode == 400) {
          wx.navigateTo({
            url: '../../pages/userBind/userBind'
          })
        } else if (res.data.httpCode == 410) {
          wx.navigateTo({
            url: '../../pages/' + u
          })
        } else if (res.data.httpCode == 200) {   //如果是返回200 登录返回token
          wx.setStorageSync('token', res.data.data)   //同步保存token
          //URL链接
          wx.navigateTo({
            url: '../../pages/' + u
          })
        }
      }
    });
},
  //跳转商品详情页
  GoodShopping: function (goodsId){
    var token = wx.getStorageSync('token'); 
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/goodsClassTemplateController/selectSum',
      data: {
        goodsId: goodsId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data + "mc")
        wx.hideToast();
        // alert(data.data+"dasssssssssssss")
        if (res.data.data == '0') {
          wx.navigateTo({
            url: '../ShopAttributeOne/ShopAttributeOne?goodsId=' + goodsId,
          })
          // window.location.href=('/goodsShow/goodsStateless?goodsId='+lib_moudle.getRequestParams().goodsId)
        } else if (res.data.data == '1') {
          wx.navigateTo({
            url: '../Shopping/Shop?goodsId=' + goodsId,
          })
          //window.location.href=('/goodsShow/goodsStatelessOne?goodsId='+lib_moudle.getRequestParams().goodsId)
        } else if (res.data.data == '2') {
          wx.navigateTo({
            url: '../ShoppingMore/ShoppingMore?goodsId=' + goodsId,
          })
        } else if (res.data.data == '-1') {
          /*vm.pageDisplay = true*/
          wx.navigateTo({
            url: '../ShopNR/ShopNR?goodsId=' + goodsId,
          })
          // window.location.href=('/goodsShow/shopping_price?goodsId='+tools.getRequestParams().goodsId)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    wxAccount: '', //微信账号
    token:"", // 微信Token
  },
  //获取微信Token
  wxTokenFN:function(wxOpendId){
    //console.log(wxOpendId)
    var that = this;
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&url=/pfuser/gethomeToken',
      method: 'get',
      data: {
        openId: wxOpendId
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.data){
          //保存已经绑定的微信账号Token
          that.globalData.token = res.data.data;
          wx.setStorageSync('token', res.data.data);
          console.log(that.globalData.token)
        }else{
          console.log("没有绑定，操作的时候请注意！！！！！")
        }
        //console.log(that.globalData.wxToken)
        //console.log(that.globalData.wxToken+"mc")
      },
      fail: function () {
        console.log("请求失败")
      }
    })
  },
  toDecimal: function (x){
    var f = parseFloat(x);
    if(isNaN(f)) {
      return false;
    }
  var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if(rs < 0) {
      rs = s.length;
      s += '.';
    }
  while (s.length <= rs + 2) {
      s += '0';
    }
  return s;
  } 
});