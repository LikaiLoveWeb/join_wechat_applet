var WxParse = require('../../pages/wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    Toggle: false,
    ToggleShop: true,
    indicatorDots: true,
    autoplay: true,
    shadeCon: true,
    TypeToggle: false,
    TypeMapList: [],
    scrollTop: 0,
    goTop_show:false,
    interval: 5000,
    duration: 1000,
    indicatorColor: 'rgba(137,137,137,0.8)',
    indicatorActiveColor: 'rgba(255,255,255,0.8)',
    singleNum:0,
    singlePrice:0,
    remark:'',
    dataMore:[],
    dataIDNum:[],
    countFidex:true,
    CountBoxNav:true,
    ShopSinglePrice:true,
    MorePrice:false,
    SingleNumL:true,
    MoreNum:true,
    SingleCount:true,
    MoreCount:false,
    //采购商按钮
    ClickBtn:false,
    //正常显示图片
    normalImg: true,
    defaultImg: false,
    //存储微信Id
    wxAccount: "",
    //商品ID
    goodsId:"",
    //商品Token
    ShopToken:"",
    imgurlList:[],
  },
  //初始化加载
  onLoad:function(Id){
    var ShopId = Id.goodsId;
    var Token = wx.getStorageSync('token');
    console.log(Token+"================")
    var jsonObj = {
      "id": ShopId
    };
    var that = this;
    that.setData({
      goodsId: ShopId,
      ShopToken: Token
    });
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + Token+'&url=/pFGoodsController/getExtendGoodsByGoodsId',
      data: {
        "jsonObj": JSON.stringify(jsonObj)
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          resourceIdListArray: res.data.data.resourceIdList,  
          dataMore: res.data.data,
          contactProvince: res.data.data.contactProvince.slice(0,2),
          contactCity: res.data.data.contactCity.slice(0, 2),
          name: res.data.data.name,
          supplyType: res.data.data.supplyType,
          num: res.data.data.num,
          goodsQuantityOffers: res.data.data.goodsQuantityOffers,   
          remark: res.data.data.remark,
          TypeMapList: res.data.data.mapList       
        });
        //转义的Html
        var detail = res.data.data.detail;
        var list = app.returnHandlerDetail(detail);
        var imgurlList = [];
        for (var i = 0; i < list.length - 1; i++) {
          //list[i].scr = '../images/'
          var a = {
            src_true: list[i],
            src_false: '../images/no_shopping.png',
            src_btn: list[i]
          }
          imgurlList.push(a)
        }
        //console.log(imgurlList)
        that.setData({
          imgurlList: imgurlList
        });
        // WxParse.wxParse('detail', 'html', detail, that, 5);
        var goodsQuantityOffers = res.data.data.goodsQuantityOffers;
        console.log(goodsQuantityOffers + res.data.data.remark)
        if ( res.data.data.remark == '1') {
          var a = [{
            'price': res.data.data.price
          }]
          goodsQuantityOffers = a;
          that.setData({
            ShopSinglePrice: false,
            MorePrice: true,
            //单个数量
            MoreNum: true,
            SingleNumL: false,
            //单个事件
            SingleCount: false,
            MoreCount: true,
            //查看价格
            ClickBtn: false,
            goodsQuantityOffers: goodsQuantityOffers
          })
        }else{
          that.setData({
            ShopSinglePrice: true,
            MorePrice: false,
            //单个数量
            MoreNum: false,
            SingleNumL: true,
            //单个事件
            SingleCount: true,
            MoreCount: false,
            //查看价格
            ClickBtn: true,
          })
        };
        //判断商品是否下架
        var selfStatus = that.data.dataMore.selfStatus;
        if (selfStatus == true) {
          that.setData({
            ToggleShop: true,
            Toggle: false
          })
        } else {
          that.setData({
            ToggleShop: false,
            Toggle: true
          })
        };
        //判断图片是否存在
        var LogoImg = that.data.dataMore.storeLogo;
        if (LogoImg == "") {
          that.setData({
            normalImg: false,
            defaultImg: true
          })
        }
      }
    });
  },
  errImg: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var imgurlList = that.data.imgurlList;
    imgurlList[index].src_btn = imgurlList[index].src_false;
    that.setData({
      imgurlList: imgurlList
    })
  },
  //计算总价
  getTotalPrice:function(){
    var dataMore = this.data.dataMore;
    var Total = 0;
    var singleNum = dataMore.num;
    Total = singleNum * dataMore.price;
    this.setData({
      dataMore: dataMore,
      singlePrice: Total.toFixed(2)
    })
  },
  PriceAdd:function(){
    //调用计算总价
    var dataMore = this.data.dataMore;
    var numbers = parseInt(dataMore.num);
    if (isNaN(numbers)){
      numbers=0
    };
    numbers = parseInt(numbers + 1);
    dataMore.num = numbers
    this.setData({
      singleNum: numbers,
    })
    this.getTotalPrice();
  },
  reducePrice:function(){
    let dataMore = this.data.dataMore;
    let numbers = dataMore.num;
    if (numbers<=0){
      numbers=0
      console.log("不能在减啦~~~")
    }else{
      numbers = numbers - 1;
      dataMore.num = numbers;
    };
    this.setData({
      singleNum: numbers,
    });
    this.getTotalPrice();
  },
  //单个输入框框
  SingleKey:function(e){
    var dataMore = this.data.dataMore;
    var SingleNumber = dataMore.num;
    var value = e.detail.value;
    var re = /^\d+(\.\d+)?$/;
    if (SingleNumber === null) {
      SingleNumber = value;
      dataMore.num = SingleNumber;
    } else if (!re.exec(value)){
      dataMore.num = 0
    }else {
      SingleNumber = value;
      dataMore.num = SingleNumber;
    };
    this.setData({
      dataMore: dataMore,
      singleNum: SingleNumber
    });
    this.getTotalPrice();
  },





  //MorePrice
  MorePriceAdd:function(){
    var dataMore = this.data.dataMore;
    var NoTypeNum = parseInt(dataMore.num);
    if (isNaN(NoTypeNum)){
      NoTypeNum = 0;
      //console.log(NoTypeNum)
    }
    NoTypeNum = NoTypeNum + 1;
    dataMore.num = NoTypeNum;
    //调用总价
    this.MoreTotal();
  },
  //Sub
  MorePriceSub:function(){
    var dataMore = this.data.dataMore;
    var NoTypeNum = dataMore.num;
    if (NoTypeNum<=0){
      NoTypeNum=0;
      console.log("救命啊~~~")
    }else{
      NoTypeNum = NoTypeNum - 1;
      dataMore.num = NoTypeNum;
    };
    //调用总价
    this.MoreTotal();
  },
  //MoreTotal
  MoreTotal:function(){
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var remark = this.data.remark;
    var dataMore = this.data.dataMore;
    var NoTypePrice = "";
    var MoreTotal = 0;
    for (var i = 0; i < goodsQuantityOffers.length;i++){
        NoTypePrice = goodsQuantityOffers[i].price
    };
    MoreTotal = NoTypePrice * dataMore.num;
    //返回值重新渲染
    this.setData({
      singleNum: dataMore.num,
      singlePrice: MoreTotal.toFixed(2),
      dataMore: dataMore
    });
  },
  //输入框事件
  bindinput: function (e) {
    var dataMore = this.data.dataMore;
    var SingleNumber = dataMore.num;
    var value = e.detail.value;
    var re = /^\d+(\.\d+)?$/;
    if (SingleNumber === null) {
      SingleNumber = value;
      dataMore.num = SingleNumber;
    } else if (!re.exec(value)){
      dataMore.num=0;
    }else {
      SingleNumber = value;
      dataMore.num = SingleNumber;
    };
    this.setData({
      dataMore: dataMore,
      singleNum: SingleNumber
    });
    this.MoreTotal();
  },




  //加入购物车,判断是否登录
  GoShop: function (){
    let dealNum = this.data.singleNum;
    var GoShopToken = this.data.ShopToken;
    if (dealNum<=0){
      console.log("商品数量少于0，不能添加")
    }else{
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + GoShopToken+'&url=/orderCart/add',
        method: "POST",
        traditional: true,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          dealNumList: JSON.stringify([dealNum]),
          goodsId: this.data.goodsId
        },
        success: function (res) {
          if (res.data.data == true) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            });
          } else {

          }
        }
      })
    }   
  },
  //立即购买
  BuGoShop:function(){
    var that = this;
    var dealNum = this.data.singleNum;
    var GoShopToken = this.data.ShopToken;
    var minimum = this.data.dataMore.minimum;
    //console.log(minimum)
    if (dealNum < minimum){
      wx.showToast({
        title: "小于起批量",
        icon: 'loading',
        duration: 2000
      });
    }else{
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + GoShopToken+'&url=/orderCart/toOrderNow',
        method: "POST",
        traditional: true,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          dealNumList: dealNum,
          goodsId: this.data.goodsId
        },
        success: function (res) {
          console.log(res);        
          if (res.data.httpCode=='200') {
            var dataIDNum = res.data.data[0];
            var cartIds = dataIDNum.cartId;
            var dealNums = dataIDNum.dealNum;
            console.log(dealNums);
            console.log(11111111);
            console.log(cartIds);
            console.log(dealNums);
            wx.navigateTo({
              url: '../submitOrder/submitOrder?cartIds=' + cartIds + '&dealNums=' + dealNums +'&now='+1,//跳转地址
            })
          }
        }
      })
    }
  },
  //点击出现弹窗
  FidexBtn:function(){
      this.setData({
        countFidex:false,
        CountBoxNav:false,
      })
  },
  LookPrice: function () {
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var remark = this.data.remark;
    if ( remark == '0') {
      var that = this;
      this.setData({
        shadeCon: false,
      })
    } else {
      console.log("本大爷是采购商")
    }
  },
  //关闭弹窗
  CloseShade: function () {
    var that = this;
    this.setData({
      shadeCon: true,
    })
  },
  GoBack: function () {
    var that = this
    this.setData({
      scrollTop: 0
    })
  },
  //查看批发价
  LookFn: function () {
    var that = this;
    //调用微信登录接口获取openid 
    //拿到token
    var token = wx.getStorageSync('token');
    console.log(token+"...................")
    that.setData({
      wxAccount: app.globalData.wxAccount
    });
    var NewWxAccount = that.data.wxAccount;
    //微信号不为空在调用
    if (token) {
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfuser/wexinLogin',
        method: 'GET',
        data: {
          token: token,
          weChat: NewWxAccount
        },
        success: function (res) {
          //返回400去绑定
           if (res.data.httpCode == 410) {
            //登录了不是采购商
            var goodsQuantityOffers = that.data.goodsQuantityOffers;
            var remark = that.data.remark;
            if ( remark == '0') {
              that.setData({
                shadeCon: false,
              })
            } else {
              console.log("本大爷是采购商")
              that.setData({
                shadeCon: true,
              })
            }
          } else if (res.data.httpCode == 200) {
            //保存Token
            wx.setStorageSync('token', res.data.data)
            var goodsQuantityOffers = that.data.goodsQuantityOffers;
            var remark = that.data.remark;
            if ( remark == '0') {
              that.setData({
                shadeCon: false,
              })
            } else {
              console.log("本大爷是采购商")
              that.setData({
                shadeCon: true,
              })
            }
          }
        },
        fail: function () {
          console.log("请求失败")
        }
      })
    } else {
      //未绑定微信账号
      wx.navigateTo({
        url: '../userBind/userBind'
      });
    }
  },
  //点击出现弹窗
  FidexBtn: function () {
    //拿到token
    var token = wx.getStorageSync('token');
    if (token) {
      var that = this;
      that.setData({
        wxAccount: app.globalData.wxAccount
      });
      console.log(that.data.wxAccount + "mc")
      var NewWxAccount = that.data.wxAccount
      console.log(NewWxAccount + "mc")
      //微信号不为空在调用
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfuser/wexinLogin',
        method: 'GET',
        data: {
          token: '',
          weChat: NewWxAccount
        },
        success: function (res) {
          //返回400去绑定
           if (res.data.httpCode == 410) {
            //已经有Token
            that.setData({
              countFidex: false,
              CountBoxNav: false,
            })
          } else if (res.data.httpCode == 200) {
            //保存Token
            wx.setStorageSync('token', res.data.data)
            that.setData({
              countFidex: false,
              CountBoxNav: false,
            })
          } else if (res.data.httpCode == 409) {
            wx.showToast({
              title: 'OpendId为空',
              icon: 'loading'
            })
          }
        },
        fail: function () {
          console.log("请求失败")
        }
      })
    } else {
      //未绑定微信账号
      wx.navigateTo({
        url: '../userBind/userBind'
      });
    }

  },
  //点击进入购物车页面
  FidexBtnGoShopping: function () {
    var that = this;
    //调用微信登录接口获取openid 
    //拿到token
    var token = wx.getStorageSync('token');
    that.setData({
      wxAccount: app.globalData.wxAccount
    });
    var NewWxAccount = that.data.wxAccount;
    //微信号不为空在调用
    if (token) {
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfuser/wexinLogin',
        method: 'GET',
        data: {
          token: token,
          weChat: NewWxAccount
        },
        success: function (res) {
          //返回400去绑定
          if (res.data.httpCode == 410) {
            wx.switchTab({
              url: '../ShoppingCart/ShoppingCart',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })           
          } else if (res.data.httpCode == 200) {
            //保存Token
            wx.setStorageSync('token', res.data.data)
            wx.switchTab({
              url: '../ShoppingCart/ShoppingCart',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }
        },
        fail: function () {
          console.log("请求失败")
        }
      })
    } else {
      wx.navigateTo({
        url: '../userBind/userBind'
      });
    }
  },
  //返回顶部
  ShoppingScroll: function (e) {
    console.log(e);
    //判断
    if (e.detail.scrollTop>200) {//触发gotop的显示条件
      this.setData({
        goTop_show: true,
        
      });
      //console.log(this.data.scrollTop)
    } else {
      this.setData({
        goTop_show: false,
      });
    }
  },
  //点击关闭弹窗
  FidexTotalBtn: function () {
    //判断是否出现弹窗
    var TotalBtn = this.data.countFidex;
    if (TotalBtn === false) {
      this.setData({
        countFidex: true,
        CountBoxNav: true
      })
    }
  },
  //点击跳转到店铺首页
  GoShopBtn:function(){
    var GoShopId = this.data.dataMore.shopId;
    //console.log(GoShopId)
    wx.redirectTo({
      url: '../storeHome/storeHome?id=' + GoShopId
    })
  },
  //商品属性
  TypeBtnFixed: function () {
    console.log("....")
    var TypeBtn = this.data.TypeToggle;
    if (TypeBtn == false) {
      TypeBtn = true
    }
    this.setData({
      TypeToggle: TypeBtn
    })
  },
  //关闭
  CloseType: function () {
    var CloseType = this.data.TypeToggle;
    if (CloseType == true) {
      CloseType = false
    }
    this.setData({
      TypeToggle: CloseType
    })
  },
  GoShoppingHome: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
})