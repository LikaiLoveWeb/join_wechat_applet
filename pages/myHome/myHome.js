// 调用App.js获取头像和昵称
 var app = getApp();
Page({
    data: {
      userInfo: {},
   },
  // 初始化加载
    onLoad: function () {
      console.log(app.globalData.wxAccount);
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
      var token = wx.getStorageSync('token');
      if(token == undefined||token == null||token == ''){
        var openid = app.globalData.wxAccount;
        if (openid != '' && openid != null && openid != undefined){
           init(openid)
        }else{
          wx.login({
            success: function (res) {
              console.log(res.code);
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
                  if (ress.data.httpCode == 200) {

                    init(ress.data.data)
                  }

                }
              })

            }
          });
        }
      }

    },    
  //跳转全部订单
  allorder:function(){
    // var weChat = app.globalData.wxAccount;   //这句代码不用变，记得当前页面最上面写   var app = getApp();
    var weChat = app.globalData.wxAccount;   //这是微信号  每个页面进的时候需要传微信号
    console.log(weChat+"&&&&&&&&&&&&&&&&&&&这是微信号")
    var url ='orderlist/orderlist'   //这是你需要跳转的页面  判断就是（如果登录成功，应该去哪里）
    app.getLogin(weChat, url);  //这是调验证登录的接口
  },
  //跳转待付款页面
  alllistorder:function(options){
    console.log(options)
    var index = options.currentTarget.dataset.idx;
    console.log(index+"小标")
    var weChat = app.globalData.wxAccount;   //这是微信号  每个页面进的时候需要传微信号
    console.log(weChat+"*************微信号")
    var url = 'orderlist/orderlist?id=' + 1 + '&index=' + index;  //这是你需要跳转的页面  判断就是（如果登录成功，应该去哪里）
    app.getLogin(weChat, url);  //这是调验证登录的接口

  },
  //跳转待收货页面
  receiving: function (options) {
    var index = options.currentTarget.dataset.idx;
    var weChat = app.globalData.wxAccount;   //这是微信号  每个页面进的时候需要传微信号
    var url = 'orderlist/orderlist?id=' + 2 + '&index=' + index //这是你需要跳转的页面  判断就是（如果登录成功，应该去哪里）
    app.getLogin(weChat, url);  //这是调验证登录的接口
  },
  // 点击收货地址
  deAddress:function(){
     var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfos = {
          name: res.userName,
          telNumber: res.telNumber,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
        }
      }
    })
  },
});

function init(id) {
  console.log(id + '-----------------------------------')
  if (id != ''&&id != undefined && id!= null){
    wx.setStorageSync('wxAccount', 'id')
  }
  
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  var that = this;
  var phoneobj = {
    weChat: id
  }
  wx.request({
    url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pfuser/wexinLogin', //微信登陆接口
    method: 'get',
    data: phoneobj,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.httpCode == 200) {
        var token = res.data.data;
        wx.setStorageSync('token', token)
      } else {
        wx.navigateTo({
          url: '../userBind/userBind',
        })
        //toast('跳转到手机登陆页')
      }
    },
    fail: function (res) {
      //请求失败
      toast('请求失败，错误未知！')
    },
    complete: function () {
      wx.hideLoading()
    }
  })
}