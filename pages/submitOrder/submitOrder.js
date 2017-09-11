// submitOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: null,   //收货地址
    orderList: [],       //订单列表数据
    totalData: {         //订单的各项合计数据
      totalPriceNum: 0,  //总价合计
      inputData: 0,      //运费合计
      totalPrice: 0
    },
    totalPrice: 0,       //合计总金额      
    totalPriceNum: 0,    //货物总价合计
    inputData: 0,        //运费合计
    focsInputData: 0,    //选中运费框，当前店铺运费总量
    nowInputData: 0,                                      //失焦或聚焦时input框内的值
    cartIds: [],                                          //商品cartId
    buyNow: false,                                        //判断是否是立即购买
    dealNum: 0,                                           //立即购买订单数
    imgUrl: "https://api.joinsilk.com/File/download?id=",  //所有图片的前半部分url（需与对应每个图片的id进行拼接）
    token: "",                                            //用户身份
    appid: 'wxf2fc3252d6e5e633',                          //小程序ID
    secret: '3fd10c7f976eb47d1ab74f6fa3421491',           //小程序密钥
    oepnId: "",                                           //用户唯一的标识
    carList: null,                                        //订单集合

    out_trade_no: "",                                     //接受日志id（支付成功后会传给后端）

    total_fee: "",                                        //接受金额   （支付成功后传给后台）

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var cartIds = options.cartIds || "904593110657400832,904593110774841344,904595351728553984,904588194740174848";
   
    // var nowOrder = options.now || "111";


    var _this = this;
    var nowOrder = options.now || "";
    var cartIds = options.cartIds || "";
    console.log(cartIds +"++++++++")

    if (nowOrder) {
      var dealNums = options.dealNums || "";
      _this.setData({
        buyNow: true,
        dealNum: dealNums,
      })
    }
    _this.data.cartIds = cartIds;

    //测试情况下打开。 上线要注销该段代码
    // wx.setStorage({
    //   key: "token",
    //   data: "otaQntmOotuPndmTmdqQnPmS"
    // })
    wx.showLoading({
      title: '加载中',
    })

    //获取token值
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data != undefined) {
          _this.data.token = res.data;
          var token = res.data;
          if (nowOrder) {
            console.log(cartIds)
            console.log(dealNums)
            _this.showOrderNow(token, cartIds, dealNums);
          } else {
            console.log(cartIds)

            _this.showOrderList(token, cartIds);
          }
        } else {

        }
      },
      fail: function () {
        // var token = "otaPndiSmPyPntiTmdaQmtyM";
        // _this.data.token = token;
        // _this.showOrderList(token, cartIds);
      }
    })
  },

  //立即支付订单查询
  showOrderNow: function (tok, cart, deal) {
    var _this = this;
    wx.request({
      url: "https://api.joinsilk.com/Api?appCode=silkPlatform",
      method: "GET",
      data: {
        url: "/pfOrder/showOrderNow",
        token: tok,
        cartIds: cart,
        dealNums: deal
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
      console.log(data);
        var data = data.data.data;
        if(data !== "购物车的id不能为空"){
          _this.analysisOrderList(data);

        }

      }
    })

  },
  //购物车订单查询
  showOrderList: function (token, cartIds) {
    var _this = this;
    wx.request({
      url: "https://api.joinsilk.com/Api?appCode=silkPlatform&token=" + token + "&url=/pfOrder/showOrder",
      method: "GET",
      data: {
        cartIds: cartIds
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
        console.log(data);
        var data = data.data.data;
        if (data !== "购物车的id不能为空") {
      
          _this.analysisOrderList(data);
        }
      }
    })
  },
  //解析从购物车或直接购买等接口获取的数据
  analysisOrderList: function (param) {
    var resultList = param;
    var resultListLen = resultList.length;
    var key = '', key1, resultListArray = [];
    var totalPriceNum = 0;
    var totalNum = 0;

    // for (key in resultList) {
    for (var key = 0; key < resultListLen; key++) {

      var nums = 0, pric_num = 0, cart_id = [], num_list = [];
      for (key1 in resultList[key]) {
        if (key1 != "couponsList") {
          var result = resultList[key][key1];
          var resultLen = result.length;
          for (var i = 0; i < resultLen; i++) {
            var head = result[i];
            nums += Number(head.deal_num);
            pric_num += head.deal_num * head.offer_string;
            cart_id.push(head.cart_id)
            num_list.push(head.deal_num)
          }
          var a = {
            shopArray: result,
            shop: {
              id: key1,
              name: result[0].company_name,
              num: 0,
              pric_num: 0,
              cart_id: ""
            }
          }
          resultListArray.push(a)
        }

      }
      var head1 = resultListArray[key].shop;

      head1.num = nums;                                        //单店商品总件
      head1.pric_num = parseFloat(pric_num.toFixed(2));        //单店铺商品总价
      head1.message = "";                                      //单店买家备注信息          
      head1.freightPrice = "";                                 //单店铺运费
      head1.storeGoodsPrice = parseFloat(pric_num.toFixed(2)); //单店总价格（商品+运费）
      head1.num_list = num_list;                               //当店各个商品数量数组集合；                                           
      head1.cart_id = cart_id;                                 //单店购物车Id
      totalPriceNum += head1.pric_num;                         //全部店铺订单的物品总价格           
      totalNum += head1.num;                                   //全部店铺商品总件数
    }

    this.setData({
      orderList: resultListArray,
      totalPriceNum: totalPriceNum,
      totalNum: totalNum,
      totalPrice: totalPriceNum
    })
    wx.hideLoading();

  },


  //添加买家备注信息到订单列表数据里
  LeavingMessageEvent: function (e) {
    var value = e.detail.value;
    var index = e.currentTarget.dataset.index;
    this.data.orderList[index].shop.message = value;
  },
  //调用微信编辑地址接口
  editAddress: function () {
    var _this = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfos = {
          initial: {
            customName: res.userName,
            phone: res.telNumber,
            privince: res.provinceName,
            city: res.cityName,
            area: res.countyName,
            adress: res.detailInfo,
            postCode: res.postalCode
          }

        };
        var adress = {
          customName: res.userName,

        };
        var addrInital = addressInfos.initial;
        //当是直辖市时去重；
        if (!addrInital.privince || addrInital.privince == addrInital.city) {
          addressInfos.privince = "";
        }
        //拼接各个收货地址省/市/区等信息
        addressInfos.detailAdress = addrInital.privince + addrInital.city + addrInital.area + addrInital.adress;
        var addrDetailAdr = addressInfos.detailAdress;
        //当收货地址长度超过38个字时候，截取前38个字
        addressInfos.detailAdress = addrDetailAdr.length < 43 ? addrDetailAdr : addrDetailAdr.substring(0, 38) + "...";
        //设置收货地址
        _this._bindAdressInfo(addressInfos);
      }
    })
  },
  //设置当前收货地址值参数
  _bindAdressInfo: function(addressInfo) {
    this.setData({
      addressInfo: addressInfo,

    });
  },
  //点击微信支付事件
  primary: function () {
    // this.wxPlaceOrder();
    var _this = this;
    var orderList = _this.data.orderList;
    var cartIds = _this.data.cartIds;

    var listLen = orderList.length;
    var flag = true;
    for (var i = 0; i < listLen; i++) {
          if (!orderList[i].shop.freightPrice && orderList[i].shop.freightPrice !== 0 ) {
        flag = false;
      }
    }
    if (flag) { //当运费全部填写时，跳转到支付页面；
      wx.login({
        success: function (res) {
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
              var openId = ress.data.data;
              _this.data.openId = openId;
              _this.verifyGoods(cartIds)
            }
          })
        }
      })

    } else {  //当有一项运费未填写时候 提示填写运费金额
      wx.showModal({
        title: '支付提示',
        content: "未填写运费金额或格式不正确！",
        cancelColor: "#e6e0e0",
        showCancel: false,
        success: function (res) {
        }
      })
    }
  },

  //订单生成前的验证
  verifyGoods: function (param) {
    var _this = this;
    wx.request({
      url: "https://api.joinsilk.com/Api?appCode=silkPlatform",
      data: {
        token: _this.data.token,
        cartIds: param,
        url: "/pfOrder/verifyGoods"
      },
      header: {
        'content-type': "application/json"
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.data == true) {
          if (_this.data.buyNow) {
            // _this.generateOrder(_this.data.orderList)
            _this.data.buyNow = false;
            _this.generateOrderNow(_this.data.orderList)
          } else {
            _this.generateOrder(_this.data.orderList)
          }
        } else if (res.data.httpCode == 400){
          var Twx = res.data.data;
          console.log(Twx)
          app.wxToast({
            title: Twx
          })
        }
      }
    })
  },

  //立即购买订单提交
  generateOrderNow: function(param) {
    var _this = this;
    var head = param[0].shop;
    var cartIds = head.cart_id.join(',');
    var message = head.message;
    var freight = head.freightPrice;
    var addressId = "";
    var cId = "";
    var dealNums = head.num_list.join(",");
    wx.request({
      url: "https://api.joinsilk.com/Api?appCode=silkPlatform",
      data: {
        url: "/pfOrder/weChatgenerateOrderNow",
        token: _this.data.token,
        cartIds: cartIds,
        message: message,
        freight: freight,
        cId: cId,
        addressId: addressId,
        adress: _this.data.addressInfo.initial,
        dealNums: dealNums
      },
      success: function (res) {
        _this.wxSumOrderPrice(res.data.data,false);
      }
    })

  },
  //购物车订单提交
  generateOrder: function(param) {
    var _this = this;
    var paramLen = param.length;
    var orders = [];
    for (var i = 0; i < paramLen; i++) {
      var head = param[i].shop;
      var a = {

      };
      a.cartIds = head.cart_id;
      a.message = head.message;
      a.freight = head.freightPrice;
      a.addressId = "";
      a.cId = "";
      orders.push(a);
    }


    wx.request({
      url: "https://api.joinsilk.com/Api?appCode=silkPlatform",
      data: {
        url: "/pfOrder/weChatgenerateOrder",
        token: _this.data.token,
        orders: orders,
        adress: _this.data.addressInfo.initial
      },
      success: function (res) {
        _this.wxSumOrderPrice(res.data.data,true);
      }
    })

  },

  //统一下单前查询总价
  wxSumOrderPrice: function(param,flag) {
    var _this = this;
    if(flag){
      param = param.join(",");
    }
    console.log(param)
    _this.data.carList = param;

    wx.request({
      url: "https://api.joinsilk.com/Api?appCode=silkPlatform",
      data: {
        url: "/pfOrder/sumOrderPrice",
        token: _this.data.token,
        orderIds: param,
      },
      success: function (res) {
        _this.wxPlaceOrder(res.data.data);
      }
    });
    // url: "/pfOrder/sumOrderPrice"

  },

  //统一查询
  wxPlaceOrder: function (param) {
    var _this = this;
    var data = _this.data.orderList;
    var dataLen = data.length;
    var orders = [];
    for (var i = 0; i < dataLen; i++) {
      var cartIds = data[i].shop.cart_id;
      orders.push(cartIds);
    }
    var body = _this.data.carList;
    var newBody = body.split(",");

    wx.request({
      url: "https://api.joinsilk.com/pay/weChatPay",
      method: "GET",
      data: {
        token: _this.data.token,
        title: "支付钞票",
        totalFee: param,
        body: newBody,
        verfiyUrl: "/pfOrder/payDetil",
        uniqUrl: "",
        openId: _this.data.openId
      },
      success: function (re) {
        var result = re.data.data
        _this.data.out_trade_no = result.trade;             //保存日志id
        _this.data.total_fee = result.totalFree;            //保存接受金额
        _this.unifiedorder(result)
      }
    })

  },

  //支付
  unifiedorder: function (param) {
    var _this = this;
    wx.requestPayment({
      "timeStamp": param.timeStamp,
      "nonceStr": param.nonceStr,
      "package": param.package,
      "signType": param.signType,
      "paySign": param.paySign,
      "success": function (res) {
        _this.paySuccess(res);
      },
      fail: function (res) {
        _this.goPage();
      }

    })
  },
  //支付成功后把total_fee和out_trade_no传给后台
  // paySuccess: function (param) {
  //   var _this = this;
  //   wx.request({
  //     url: "https://api.joinsilk.com/Api?appCode=silkPlatform",
  //     method: "GET",
  //     data: {
  //       url: "/pfOrder/payDetil",
  //       token: _this.data.token,
  //       out_trade_no: _this.data.out_trade_no,
  //       total_fee: _this.data.total_fee,

  //     },
  //     success: function (re) {
  //       if (re.data.httpCode == 200) {
  //         _this.goPage();
  //       } else {

  //       }
  //     }
  //   })
  // },


  paySuccess: function (param) {
    var _this = this;
    wx.request({
      url: "https://api.joinsilk.com/pay/CheckOrder",
      method: "GET",
      data: {
        tradeId: _this.data.out_trade_no,
        token: _this.data.token,
      },
      success: function (re) {
        console.log(re.data.data);
        // if (re.data.data === "SUCCESS") {
          console.log("_____")
          _this.goPage();
        // } else {

        // }
      }
    })
  },

  //支付成功或未支付都跳转到订单详情页
  goPage: function (param) {
    var id = this.data.carList;
    wx.redirectTo({
      url: '../orderDetail/orderDetail?id=' + id
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

  //输入运费按键事件 
  eventHandle: function (e) {
    var value = e.detail.value || "";
    var index = e.currentTarget.dataset.index;


    var a = '1.22';
    var regNew = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
    var flag = regNew.test(value)
    if (flag || value==="") {//当小数点后面两位数，且不以.开头
      if (value.length < 9) {
        var nowValue = parseFloat(value) || 0;
        var orderListShop = this.data.orderList[index].shop;
        orderListShop.freightPrice = nowValue;                          //当前店铺运费金额

        orderListShop.storeGoodsPrice = (parseFloat(orderListShop.pric_num) + nowValue).toFixed(2);   //单前店铺运费＋货物总金额

        this.setData({
          orderList: this.data.orderList
        })

        var oldTotalPriceNum = parseFloat(this.data.totalPriceNum);    //全部店铺订单总金额
        var inputData = parseFloat(this.data.inputData);               //全部店铺运费总计

        if (!inputData) {    //当总运费为0或空时
          var totalPrice = (oldTotalPriceNum + nowValue ).toFixed(2);
          this.setData({
            inputData: nowValue,                                       //全部店铺运费总金额
            focsInputData: nowValue,                                   //当前选中店铺运费金额
            // totalPrice: oldTotalPriceNum + nowValue                 //全部店铺运费+货物总金额
            totalPrice: totalPrice                                     //全部店铺运费+货物总金额

          })
        } else {             //当总运费不为0或空时
          var focsInputData = parseFloat(this.data.focsInputData);

          if (!nowValue) {   //当前input的值为空或0时
            var inputData = parseFloat(inputData) - parseFloat(focsInputData);
            var totalPrice = (oldTotalPriceNum + inputData).toFixed(2);

            this.setData({
              inputData: inputData,
              focsInputData: nowValue,
              // totalPrice: oldTotalPriceNum + nowValue               //全部店铺运费+货物总金额
              totalPrice: totalPrice                                   //全部店铺运费+货物总金额
            })
          } else {           //当前input的值不为空或0时
            var inputData = parseFloat(inputData) - parseFloat(focsInputData) + nowValue;
            var totalPrice = (oldTotalPriceNum + inputData).toFixed(2);

            this.setData({
              inputData: inputData,
              focsInputData: nowValue,
              // totalPrice: oldTotalPriceNum + nowValue               //全部店铺运费+货物总金额
              totalPrice: totalPrice                                   //全部店铺运费+货物总金额
            })  
          }
        }

      } else {
        var newValue = value.substring(0,8);
        return {
          value: newValue,
        }
      }
    } else {
      if (value === "."){
        return {
          value: "",
        }
      }
    
    }

  },



  //选择输入运费框事件 设置当前input值
  focusEventHandle: function (e) {

    var value = e.detail.value || 0;
    var nowfocsInputData = parseFloat(e.detail.value) || 0;
    if (!value || value === ".") {
      e.detail = {
        value: 222
      }
      this.setData({
        focsInputData: 0,
        nowInputData: nowfocsInputData,
      })
    } else {
      this.setData({
        focsInputData: nowfocsInputData
      })
    }
  }
})
