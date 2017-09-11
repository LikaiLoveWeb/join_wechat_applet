var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderIdss: '',  //订单id传参
    cancelOrder: false,   //取消订单的弹框
    suewGetGood: false,  //确认收货的弹框
    getToken: '',     //获取token的值
    isReGoMoShow: false,  //退货退款电脑上操作  显示
    isCancelOrder: false,   //取消订单和去付款的按钮显示
    isSureShopShow: false, //确认收货的按钮是否显示
    payStatus: '',   //订单状态
    realMoney: '',    //应付金额
    orderId: '',//订单id
    createTime: '',//下单时间
    consigneeName: '',//收货人
    consigneeLinkTel: '',//收货电话
    getGoodAdd: '',//收货地址
    consigneePostCode: '',//邮编
    buyerMessage: '',//买家留言
    storeName: '',//店铺名称
    originalPrice: '', //商品总额
    changePrice: '',//卖家修改
    freightPrice: '',//运费
    couponsFace: '',//优惠券
    cancelReason: '',//取消订单的原因
    shopInfoArr: [],//循环的数组
    version: '', //版本号  取消订单的时候需要传给后台
    status: '', //订单状态 取消订单的时候需要传给后台
    appid: "wxf2fc3252d6e5e633",
    secret: "3fd10c7f976eb47d1ab74f6fa3421491",
    openId: "",
    trade: "",//保存日志的id
    total_fee: ""//金额
  },

  sureShopTap: function () {   //点击（确认收货）按钮的事件
    var that = this;
    that.setData({
      suewGetGood: true
    })
  },
  hideBox: function () {    //出现的弹框点击取消的事件
    var that = this;
    that.setData({
      suewGetGood: false
    })
  },
  showBoxBut: function () {//点击确认收货按钮  确定的事件
    var that = this;
    wx.getStorage({   //获取存储的token
      key: 'token',
      success: function (res) {
        console.log(res)
        console.log(res.data + 'ssssssssss');
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + res.data + '&url=/pfOrder/confirmReceipt',
          method: 'GET',
          data: {
            orderId: that.data.orderIdss
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data + 'ssss');
            if (res.data.data == true) {
              console.log('确认收货成功');
            }
          }
        })
        that.setData({
          suewGetGood: false
        })
      }
    })

  },

  cacelTap: function () {    //点击（取消订单）弹出层事件
    var that = this;
    that.setData({
      cancelOrder: true
    })
  },
  canHideBox: function () {   //点击取消订单弹出层(取消按钮)事件
    var that = this;
    that.setData({
      cancelOrder: false
    })
  },
  canYesBut: function () {//点击取消订单弹出层(确定按钮)事件
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfOrder/updateOrderStatus',
      method: 'GET',
      data: {
        id: that.data.orderIdss, //订单id
        status: 5,  //订单状态
        cancelReason: 0, //取消订单的原因
        version: that.data.version  //版本号
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.data == true) {
          console.log('取消订单成功');
        }

      }
    })
    that.setData({
      cancelOrder: false
    })

  },
  goPayMon: function () {   //去付款的接口
    var that = this;
    var token = wx.getStorageSync('token');
    var openId = app.globalData.wxAccount;
    if (openId) {
      that.data.openId = openId;
      that.querySumOrderPrice(token);
    } else {
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
              that.querySumOrderPrice(token);
            }
          })
        }
      })
    }

  },

  //查询订单总价格
  querySumOrderPrice: function (param) {
    var that = this;
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + param + '&url=/pfOrder/sumOrderPrice',
      method: 'get',
      data: {
        orderIds: that.data.orderIdss, //订单id
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
  wxPlaceOrder: function (param) {
    var that = this;
    console.log(param);
    var token = wx.getStorageSync('token');   //获取token的方法
    var data = that.data.orderlistArr;
    var body = that.data.orderIdss;
    that.data.orderIdss = body.split(",");
    console.log(that.data.orderIdss);
    // console.log(body + "*******************")
    wx.request({
      url: "https://api.joinsilk.com/pay/weChatPay",
      method: "GET",
      data: {
        token: token,
        title: "支付钞票",
        totalFee: param,
        body: that.data.orderIdss,
        verfiyUrl: "/pfOrder/payDetil",
        uniqUrl: "",
        openId: that.data.openId
      },
      success: function (res) {
        var result = res.data.data
        console.log(result);
        that.data.trade = result.trade;
        that.data.total_fee = result.totalFree;
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
    var that = this;
    var token = wx.getStorageSync('token');   //获取token的方法
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
    var that = this
    var id = that.data.orderIdss;
    console.log(that.data.orderIdss)
    wx.redirectTo({
      url: '../orderDetail/orderDetail?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.data.orderIdss = options.id;
    console.log(options.id);
    var token = wx.getStorageSync('token');
    var orderId = options.id;
    // 查询订单详情的数据
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfOrder/getOrderById',
      method: 'POST',
      data: {
        orderId: orderId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data);
        var newData = res.data.data;
        var orderDetails = newData.orderDetails;
        for (var i = 0; i < orderDetails.length; i++) {
          orderDetails[i].goodsStandardOfferJson = JSON.parse(orderDetails[i].goodsStandardOfferJson)
        }
        // console.log(orderDetails);
        that.setData({
          status: newData.status,
          payStatus: staFn(newData.status),   //订单状态
          realMoney: newData.freightPrice + newData.totalPrice,  //实付金额
          orderId: newData.id,    //订单id
          createTime: format(newData.createTime),//下单时间
          consigneeName: newData.consigneeName,//收货人
          consigneeLinkTel: newData.consigneeLinkTel,//收货电话
          getGoodAdd: newData.receiveProvince + newData.receiveCity + newData.receiveArea,  //收货地址
          consigneePostCode: newData.consigneePostCode, //邮编
          buyerMessage: newData.buyerMessage,   //买家留言
          storeName: newData.storeName,  //店铺名称
          originalPrice: checkOrPrice(newData.originalPrice),  //商品总额
          freightPrice: newData.freightPrice,  //运费
          changePrice: newData.changePrice,  //卖家修改
          couponsFace: couFace(newData.couponsFace), //优惠券
          cancelReason: cancelFn(newData.cancelReason),  //取消订单的原因
          version: newData.version, //版本号
          shopInfoArr: orderDetails  //循环的数组
        });
        //取消订单和去付款的按钮框
        if (newData.status == 0) {
          that.setData({
            isCancelOrder: true
          })
        } else {
          that.setData({
            isCancelOrder: false
          })
        }
        //确认收货的按钮框
        if (newData.status == 2) {
          that.setData({
            isSureShopShow: true
          })
        } else {
          that.setData({
            isSureShopShow: false
          })
        }

      }
    });

  },
  //点击跳到商品详情页
  detailgood: function (e) {
    var goodsid = e.currentTarget.dataset.goodid//获取商品的goodsId
    app.GoodShopping(goodsid);    

    // wx.navigateTo({
    //   url: '../refreshto/refreshtoPage?goodsId=' + goodsid
    // })

  },

})


//订单状态
function staFn(e) {
  if (e == 0) {
    return '待付款'
  } else if (e == 1) {
    return '待发货'
  } else if (e == 2) {
    return '待确认收货'
  } else if (e == 3 || e == 4) {
    return '交易成功'
  } else if (e == 5) {
    return '交易关闭'
  } else if (e == 6) {
    return '退货退款中'
  }
}

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

function couFace(price) {
  if (price == null) {
    return '0'
  } else {
    return price
  }
}

function hangeJson(jsons) {   //规格的转换
  return JSON.parse(jsons);
}


//根据返回的值判断订单关闭的原因  0买家取消订单1卖家取消订单2超过7天未付款3退款退货完成）
function cancelFn(e) {
  if (e == 0) {
    return '(买家取消订单)';
  } else if (e == 1) {
    return '(卖家取消订单)'
  } else if (e == 2) {
    return '(超过7天未付款)'
  } else if (e == 3) {
    return '(退货退款完成)'
  } else {
    return ''
  }
}

//商品总额有时为null处理
function checkOrPrice(e) {
  if (e == null) {
    return '0';
  } else {
    return e;
  }
}