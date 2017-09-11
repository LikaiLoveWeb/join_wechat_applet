//orderlist.js
var app = getApp();
Page({
  data: {
    navTab: ["全部", "待付款", "待收货","交易成功"],
    currentNavtab: "0",
    orderDetails:[],
    orderlistArr:[],
    createTime:"",
    conid:"",//订单的id
    confirmFn: false, //确认收货的弹框
    scrollTop: 0,  //回到顶部
    floorstatus: false, //判断回到顶部的框是否显示
    appid:"wxf2fc3252d6e5e633",
    secret:"3fd10c7f976eb47d1ab74f6fa3421491",
    openId:"",
    bodyid:"",
    trade:"",//保存日志的id
    total_fee:""//金额
  },
  // 页面初始化加载
  onLoad: function (opations) {
    console.log(app.globalData.wxAccount);
    console.log(111111111111111111111111)
    var that = this;
    var t = opations.id;
    var index = opations.index;
    var statuobj = {
      status: ''
    }
    if (t == 1) {
      statuobj.status =0;
    } else if (t == 2) {
      statuobj.status = 2;
    } 
    var token = wx.getStorageSync('token');   //获取token的方法
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfOrder/selectBuyerOrders',
      method: 'GET',
      data: {
        extendOrder: JSON.stringify(statuobj), //订单状态
        pageNum: 1,   //页码
        pageSize: 10  //每页长度

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var orderlist = res.data.data.list;
        for (var i = 0; i < orderlist.length; i++) {
          orderlist[i].createTime = format(orderlist[i].createTime);
          for (var j = 0; j < orderlist[i].orderDetails.length;j++){
            orderlist[i].orderDetails[j].goodsStandardOfferJson = JSON.parse(orderlist[i].orderDetails[j].goodsStandardOfferJson)
          }
        };
        console.log(orderlist);
        that.setData({
          orderlistArr: orderlist,
          currentNavtab: index//更换样式
        })
      }
    })
  },
  //点击确定收货出现的弹框
  confirm:function(e){
    var that = this;
    var conid = e.currentTarget.dataset.conid;//获取订单的id
    that.data.conid=conid;
    that.setData({
      confirmFn: true
    })
  },
  // 点击取消
  hideBox:function(){
    var that = this;
    that.setData({
      confirmFn:false
    })

  },
  //点击确定收货事件
  showBoxBtn:function(){
    var that = this;
    var orderId = that.data.conid//获取订单的ID
    var token = wx.getStorageSync('token');   //获取token的方法
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token='+token+'&url=/pfOrder/confirmReceipt',
      method: 'GET',
      data: {
        orderId: orderId 
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data == true) {
          wx.navigateTo({
            url: '../orderDetail/orderDetail?id=' + orderId
          })
          console.log('确认收货成功');
        }
      }
    })
   
    that.setData({
      confirmFn: false
    })
  },
  // 四个状态的点击事件
  switchTab: function (e) {
  var index = e.target.dataset.index;//获取下标
   console.log(index);
   var statusobj = {
     status: ''
   }
   if (index==1){
     statusobj.status =0;
   }else if(index==2){
     statusobj.status = 2;
   } else if (index == 3) {
     statusobj.status =4;
   }
    var that = this;
    var token = wx.getStorageSync('token');   //获取token的方法
   wx.request({
     url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token+'&url=/pfOrder/selectBuyerOrders',
     method: 'GET',
     data: {
       extendOrder: JSON.stringify(statusobj), //订单状态
       pageNum: 1,   //页码
       pageSize: 10  //每页长度

     },
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {
       var orderlist = res.data.data.list;
      for (var i = 0; i < orderlist.length; i++) {
         orderlist[i].createTime = format(orderlist[i].createTime)
         for (var j = 0; j < orderlist[i].orderDetails.length; j++) {
           orderlist[i].orderDetails[j].goodsStandardOfferJson = JSON.parse(orderlist[i].orderDetails[j].goodsStandardOfferJson)
         }
       };
       console.log(orderlist);
       that.setData({
         orderlistArr: res.data.data.list
       })
     }
   })

// setData 函数用于将数据从逻辑层发送到视图层，同时改变对应的 this.data 的值。
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  // 点击查看详情跳页面
  cheakdetal:function(e){
     var dataid = e.currentTarget.dataset.postid//订单的id

     wx.navigateTo({
       url: '../orderDetail/orderDetail?id='+ dataid
     })
  },
 
  //点击去付款页面前查询总价
  cheakMoney(e) {
    console.log(1111111111111111);
    var that=this;
    var fuid = e.currentTarget.dataset.fuid//订单的id
    console.log(fuid + "*****************id")
    that.data.bodyid = fuid;
    var token = wx.getStorageSync('token');

    console.log(app.globalData.wxAccount)
    var openId = app.globalData.wxAccount;
    if (openId) {
      that.data.openId = openId;
      that.querySumOrderPrice(token,fuid);
    } else {
      console.log(2222);
      wx.login({
        success: function (res) {
          console.log(res);
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
              console.log(ress);
              var openId = ress.data.openid;
              console.log(openId + "GGGGGGGGGGGGGGGGGGGGGGG这是openID");
              that.data.openId = openId;
              that.querySumOrderPrice(token,fuid);
            }
          })
        }
      })
    }


    // wx.login({
    //   success: function (res) {
    //     console.log(res);
    //     var code = res.code;
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/sns/jscode2session',
    //       data: {
    //         appid: that.data.appid,
    //         secret: that.data.secret,
    //         js_code: code,
    //         grant_type: 'authorization_code'
    //       },
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       //订单查询总价的接口
    //       success: function (ress) {
    //         console.log(ress);
    //         var openId = ress.data.openid;
    //         console.log(openId+"GGGGGGGGGGGGGGGGGGGGGGG这是openID");
    //         that.data.openId = openId;
    //         wx.request({
    //           url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfOrder/sumOrderPrice',
    //           data: {
    //             orderIds: fuid,
    //           },
    //           success: function (res) {
    //             console.log(res.data.data);//订单的总价
    //             that.wxPlaceOrder(res.data.data);
    //           }
    //         });
    //       }
    //     })
    //   }
    // })

},



  //查询订单总价格
  querySumOrderPrice: function (param,cardid) {
    console.log(cardid);
    var that = this;
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + param + '&url=/pfOrder/sumOrderPrice',
      method: 'get',
      data: {
        orderIds: cardid, //订单id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data);
        that.wxPlaceOrder(res.data.data);
      }
    })

  },


  //点击付款前统一查询
  wxPlaceOrder:function(param){
    var that = this;
    console.log(param);
    var token = wx.getStorageSync('token');   //获取token的方法
    var data = that.data.orderlistArr;
    var body = that.data.bodyid;
    that.data.bodyid = body.split(",");
    console.log(that.data.bodyid)
    wx.request({
      url: "https://api.joinsilk.com/pay/weChatPay",
      method: "GET",
      data: {
        token: token,
        title: "支付钞票",
        totalFee: param,
        body: that.data.bodyid,
        verfiyUrl: "/pfOrder/payDetil",
        uniqUrl: "",
        openId: that.data.openId
      },
      success: function (res) {
      console.log(res);
       var result = res.data.data
       console.log(result);
        that.data.trade = result.trade;
        that.data.total_fee = result.totalFree
        that.unifiedorder(res.data.data)
       }
    })

  },

  //支付
  unifiedorder: function (param) {
    var that = this;
    console.log(param)
   wx.requestPayment({
      "timeStamp": param.timeStamp,
      "nonceStr": param.nonceStr,
      "package": param.package,
      "signType": param.signType,
      "paySign": param.paySign,
      "success": function (res) {
        console.log(res);
        that.paySuccess(res);

        // console.log(res);
      },
      fail: function (res) {
        console.log(res);
        that.paySuccess(res);

      }

    })
    console.log(param)

  },

  //支付成功后把total_fee和out_trade_no传给后台
  // paySuccess: function (param) {
  //   var token = wx.getStorageSync('token');   //获取token的方法
  //   var that = this;
  //   wx.request({
  //     url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfOrder/payDetil',
  //     method: "GET",
  //     data: {
  //       url: "/pfOrder/payDetil",
  //       token: token,
  //       out_trade_no: that.data.trade,
  //       total_fee: that.data.total_fee,
  //     },
  //     success: function (re) {
  //       console.log(re)
  //       if (re.data.httpCode == 200) {
  //         that.goPage();
  //       } else {

  //       }
  //     }
  //   })
  // },

  //支付成功后把out_trade_no传给后台确认是否付款成功
  paySuccess: function (param) {
    var token = wx.getStorageSync('token');   //获取token的方法
    var that = this;
    wx.request({
      url: "https://api.joinsilk.com/pay/CheckOrder",
      method: "GET",
      data: {
        tradeId: that.data.trade,
        token: token,

      },
      success: function (re) {
        console.log(re.data.data);
          that.goPage();

      }
    })
  },

  //支付成功或未支付都跳转到订单详情页
  goPage: function () {
    var that=this
    var id = that.data.bodyid;
    console.log(that.data.bodyid)
    wx.redirectTo({
      url: '../orderDetail/orderDetail?id=' + id
    })
  },

//点击跳转商品详情页
  silkShop:function(e){
    var goodsid = e.currentTarget.dataset.goodsid//获取商品的goodsId
    // console.log(goodsid + "______________________")
    app.GoodShopping(goodsid);

  },
  goTop: function (e) {  // 回到顶部js
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    if (e.detail.scrollTop >300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      })
    }
  },

});
function format(time) {
  var time = new Date(time);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + '  ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
};
function add0(m) {
  return m < 10 ? '0' + m : m
}
