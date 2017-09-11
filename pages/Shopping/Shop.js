//logs.js
var WxParse = require('../../pages/wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    Toggle:false,
    shadeCon:true,
    indicatorDots: true,
    autoplay: true,
    TypeToggle: false,
    interval: 5000,
    duration: 1000,
    indicatorColor:'rgba(137,137,137,0.8)',
    indicatorActiveColor:'rgba(255,255,255,0.8)',
    scrollTop: 0,
    goTop_show:false,
    goodsQuantityOffers:[],
    resourceIdListArray:[],
    countFidex:true,
    CountBoxNav:true,
    mainStandarList:[],
    singleNum:0,
    singlePrice:0,
    dataMore:[],
    keyList:[],
    NumList:[],
    IdList:[],
    BuyNumList:[],
    TypeMapList:[],
    remark:'',
    //单个价格
    ShopSinglePrice:true,
    MorePrice:false,
    //单个数量
    MoreleNum:false,
    SingleNum:true,
    //单个事件
    SingleCount:true,
    MoreCount:false,
    //查看价格
    ClickBtn:true,
    //正常显示图片
    normalImg: true,
    defaultImg: false,
    ShopType:"",
    //商品下架
    ToggleShop:true,
    Toggle:false,
    wxAccount: "",
    wxGoodsId:"",
    Token:"",
    imgurlList:[],
  },
  onLoad: function (options){
    //初始化详情
    var goodsId = options.goodsId;
    var jsonObj = {
      "id": goodsId
    };
    var that = this;
    var ShopToken = wx.getStorageSync('token');
    that.setData({
      Token: ShopToken,
      wxGoodsId: goodsId
    });
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + ShopToken+'&url=/pFGoodsController/getExtendGoodsByGoodsId',
      data: {
        "jsonObj": JSON.stringify(jsonObj)
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          dataMore: res.data.data,
          resourceIdListArray: res.data.data.resourceIdList,
          contactProvince: res.data.data.contactProvince.slice(0, 2),
          contactCity: res.data.data.contactCity.slice(0, 2),
          name: res.data.data.name,
          supplyType: res.data.data.supplyType,
          freightExplain: res.data.data.freightExplain,
          minimum: res.data.data.minimum,
          calculateType: res.data.data.calculateType,
          price: res.data.data.price,
          goodsQuantityOffers: res.data.data.goodsQuantityOffers,
          remark: res.data.data.remark,
          storeKeywordNames: res.data.data.storeKeywordNames,
          mainStandarList: res.data.data.mainStandarList,
          // ShopType: res.data.data.mainStandarList[0].valueName,
          TypeMapList: res.data.data.mapList
        });
        var goodsQuantityOffers = res.data.data.goodsQuantityOffers;
        if ( res.data.data.remark == '1'){
          var a = [{
            'price': res.data.data.price
          }]
          goodsQuantityOffers = a;
          that.setData({
            ShopSinglePrice:false,
            MorePrice:true,
            //单个数量
            MoreleNum:true,
            SingleNum:false,
            //单个事件
            SingleCount:false,
            MoreCount:true,
            //查看价格
            ClickBtn:false,
            goodsQuantityOffers: goodsQuantityOffers
          })
        };
        //转义的Html
        var detail = that.data.dataMore.detail;

        var list = app.returnHandlerDetail(detail);
        var imgurlList = [];
        for(var i = 0;i<list.length-1;i++){
          //list[i].scr = '../images/'
          var a = {
            src_true : list[i],
            src_false : '../images/no_shopping.png',
            src_btn: list[i]
          }
          imgurlList.push(a)
        }
        console.log(imgurlList)
        that.setData({
          imgurlList: imgurlList
        });
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

  //单个价格加
  SingleAdd:function(e){
      //调用总价
    const index = e.currentTarget.dataset.index;
    var mainStandarList = this.data.mainStandarList;
    var SingleNum = parseInt(mainStandarList[index].number);
    SingleNum = parseInt(SingleNum + 1);
    mainStandarList[index].number = SingleNum;
    this.addCarts();
    this.SingleTotal();
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
  //单个价格减
  SingleSub:function(e){
    const index = e.currentTarget.dataset.index;
    var mainStandarList = this.data.mainStandarList; 
    var SingleNum = mainStandarList[index].number;
    //判断是否小于0
    if (SingleNum<=0){
      SingleNum=0;
     // console.log("少于0,不能在减啦~~~")
    }else{
      SingleNum = SingleNum - 1;
      mainStandarList[index].number = SingleNum
    };
    //调用ID
    this.addCarts();
    this.SingleTotal();
  },
  //ID
  addCarts:function(){
   // console.log(111111);
    var mainStandarList = this.data.mainStandarList; 
   // console.log(mainStandarList)
    var SingleNum = this.data.singleNum;
    //拿到ID
    var keyList = [];
    var NumList = [];
    //遍历
    for (var i = 0; i < mainStandarList.length; i++) {
      if (keyList.indexOf(mainStandarList[i].key) == -1) {
        keyList.push(mainStandarList[i].key);
        NumList.push(mainStandarList[i].number)
      }
    }

    this.setData({
      keyList: keyList,
      NumList: NumList
    });
  },
  //计算总价
  SingleTotal: function () {
    var mainStandarList = this.data.mainStandarList;
    var price = this.data.price;
    //定义变量
    var Total = 0;
    var Num = 0;
    for (var j = 0; j < mainStandarList.length;j++){
      Total += mainStandarList[j].number * price;
      Num += parseInt(mainStandarList[j].number)
    };
    //返回
    this.setData({
      mainStandarList: mainStandarList,
      singlePrice: Total.toFixed(2),
      singleNum: Num,
    })
  },
  //单个价格输入
  SingleKey:function(e){
    var SingleValue = e.detail.value;
    console.log("..//")
    const index = e.currentTarget.dataset.index;
    var mainStandarList = this.data.mainStandarList;
    var SingleNum = mainStandarList[index].number;
   // SingleNum = SingleValue;
    mainStandarList[index].number = SingleValue;
    console.log(mainStandarList[index].number)
    console.log(mainStandarList)
    this.setData({
      mainStandarList: mainStandarList
    });
    //调用总价
    this.addCarts();
    this.SingleTotal();
  },



  //增加
  MoreAdd:function(e){
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.mainStandarList;
    var NumNum = parseInt(goodsNumMore[index].number);
    NumNum = parseInt(NumNum + 1) ;
    goodsNumMore[index].number = NumNum;
    this.MorePrice();
    this.addCarts();
  },
  //减少
  MoreSub:function(e){
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.mainStandarList;
    var NumNum = parseInt(goodsNumMore[index].number);
    if (NumNum<=0){
      NumNum=0;
      console.log("不能在减啦~~~~~")
    }else{
      NumNum = NumNum - 1;
      goodsNumMore[index].number = NumNum;
    };
    this.MorePrice();
    this.addCarts();
  },
  //MorePrice
  MorePrice:function(){
    var goodsPrice = this.data.goodsQuantityOffers;
    var goodsNum = this.data.mainStandarList;
    var MoreNum = 0;
    var MorePrice =0;
    for (var i = 0; i < goodsNum.length;i++){
      MoreNum += parseInt(goodsNum[i].number)
    }; 
    var length = goodsPrice.length;
    if (length>0){
      var truePrice='';
      for (var i = 0; i < length;i++){
        if (MoreNum >= goodsPrice[i].limit){
            truePrice = goodsPrice[i].price                 
          }else{
            truePrice = goodsPrice[0].price            
          }
      }
      var Toprice = truePrice * MoreNum; 
      MorePrice = Toprice.toFixed(2); 
    };
    this.setData({
      mainStandarList: goodsNum,
      singleNum: MoreNum,
      singlePrice: MorePrice
    })
  },
  //多个价格输入
  MoreKey:function(e){
    var SingleValue = e.detail.value;
    //console.log(1)
    const index = e.currentTarget.dataset.index;
    //console.log(1)

    var mainStandarList = this.data.mainStandarList;
    //console.log(1)

    var SingleNum = mainStandarList[index].number;
    //console.log(1)

    // SingleNum = SingleValue;
    mainStandarList[index].number = SingleValue;
    //console.log(mainStandarList);
    // console.log(mainStandarList[index].number)
    this.setData({
      mainStandarList: mainStandarList
    });
    //调用总价
    this.addCarts();
    this.MorePrice();
  },





  //加入购物车
  GoShop:function(){
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var remark = this.data.remark;
    var GoShopToken = this.data.Token;
    var GogoodID = this.data.wxGoodsId;
    var that = this;
    if (remark=='1'){
      console.log('采购商')
      var GoNum = this.data.singleNum;
      if (GoNum === 0) {
        wx.showToast({
          title: "小于0",
          icon: 'loading',
          duration: 2000
        });
      } else {
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + GoShopToken+'&url=/orderCart/add',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: GogoodID,
            standardIdList: JSON.stringify(this.data.keyList),
            dealNumList: JSON.stringify(this.data.NumList)
          },
          success: function (res) {
            //关闭微信弹窗
            wx.hideToast();
            if (res.data.data == true) {
              //调用微信弹窗
              wx.showToast({
                title: "添加成功",
                icon: "success",
                duration: 1500
              });
              //制空数组
              var aId = [];
              var bNumber = [];
              //制空
              that.setData({
                NewListKeyId: aId,
                VnumberLisr: bNumber
              });
            };
            if (res.data.httpCode == 409) {
              wx.showToast({
                title: res.data.msg,
                icon: "loading",
                duration: 3000
              });
            }
          }
        })
      } 
    }else{
      console.log("不是采购商")
      var GoNum = this.data.singleNum;
      if (GoNum === 0) {
        wx.showToast({
          title: "小于0",
          icon: 'loading',
          duration: 2000
        });
      } else {
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + GoShopToken+'&url=/orderCart/add',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: GogoodID,
            standardIdList: JSON.stringify(this.data.keyList),
            dealNumList: JSON.stringify(this.data.NumList)
          },
          success: function (res) {
            //关闭微信弹窗
            wx.hideToast();
            if (res.data.data == true) {
              //调用微信弹窗
              wx.showToast({
                title: "添加成功",
                icon: "success",
                duration: 1500
              });
              //制空数组
              var aId = [];
              var bNumber = [];
              //制空
              that.setData({
                NewListKeyId: aId,
                VnumberLisr: bNumber
              });
            };
            if (res.data.httpCode == 409) {
              wx.showToast({
                title: res.data.msg,
                icon: "loading",
                duration: 3000
              });
            }
          }
        })
      } 
    }   
  },
  //立即购买
  BuGoShop:function(){
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var remark = this.data.remark;
    //var BuyToken = this.data.Token;
    var BuyId = this.data.wxGoodsId;
    var BuyToken = wx.getStorageSync('token');
    // console.log(goodsQuantityOffers);
    // console.log(33333333333333333333333333)
    if (remark == '1'){
      var GoLimit = this.data.singleNum;
      var that = this;
      if (GoLimit < goodsQuantityOffers[0].limit) {
        wx.showToast({
          title: "小于起批量",
          icon: 'loading',
          duration: 2000
        });
      } else {
        // console.log(this.data.keyList);
        // console.log(this.data.NumList);
        // console.log(435)

        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + BuyToken+'&url=/orderCart/toOrderNow',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: BuyId,
            standardIdList: this.data.keyList,
            dealNumList: this.data.NumList
          },
          success: function (res) {
            
          // console.log(res);
          // console.log(447)
            //关闭微信弹窗
            wx.hideToast();
            var mapList = res.data.data;
            var id = [];
            var num = [];
            for (var i = 0; i < mapList.length; i++) {
              id.push(mapList[i].cartId);
              num.push(mapList[i].dealNum);
            };
            // return false;
            // console.log(id);
            // console.log(num);
            // console.log(2222222222222222222222222222222222222)

            wx.navigateTo({
              url: '/pages/submitOrder/submitOrder?cartIds=' + id + '&dealNums=' + num + '&now=' + 1,//待修改链接
            })
          }
        })
      } 
    }else{
      var GoNum = this.data.singleNum;
      var limit = this.data.dataMore.minimum;
      var that = this;
      if (GoNum < limit) {
        wx.showToast({
          title: "小于起批量",
          icon: 'loading',
          duration: 2000
        });
      } else {
        
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + BuyToken+'&url=/orderCart/toOrderNow',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: BuyId,
            standardIdList: this.data.keyList,
            dealNumList: this.data.NumList
          },
          success: function (res) {
            // console.log(res.data)
            //关闭微信弹窗
            wx.hideToast();
            var mapList = res.data.data;
            if (mapList!=null){
              var id = [];
              var num = [];       
              for (var i = 0; i < mapList.length; i++) {
                //console.log(mapList[0].cartId + "*****" + "_______-" + mapList[i].dealNum)
                 id.push(mapList[i].cartId);
                 num.push(mapList[i].dealNum);
              };            
              // console.log(11111111111111111111111)
              wx.redirectTo({
                url: '/pages/submitOrder/submitOrder?cartIds=' + id + '&dealNums=' + num + '&now=' + 1,//待修改链接
              })
            }           
          }
        })
      } 
    }; 
  },

  ClickShade:function(){
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var remark = this.data.remark;
    if (remark == '0'){
      var that = this;
      this.setData({
        shadeCon: false,
      })
    }else{
      console.log("本大爷是采购商")
    }
  },
  //关闭弹窗
  CloseShade:function(){
    var that = this;
    this.setData({
      shadeCon: true,
    })
  },
  //返回顶部
  ShoppingScroll:function(e){
    //判断
    if (e.detail.scrollTop > 20) {//触发gotop的显示条件
      this.setData({
        goTop_show: true
      });
      //console.log(this.data.scrollTop)
    } else {
      this.setData({
        goTop_show: false
      });
    }
  },
  GoBack:function(){
    var  that = this
    this.setData({
      scrollTop:0
    })
  },
  //点击出现弹窗
  FidexBtn: function () {

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
          //console.log(res.data.httpCode)
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
      wx.navigateTo({
        url: '../userBind/userBind'
      });
     // console.log("看看上步操作哪里出了问题~~~~~~")
    }
  },
  //查看批发价
  LookFn: function () {
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
            //登录了不是采购商
            var goodsQuantityOffers = that.data.goodsQuantityOffers;
            var remark = that.data.remark;
            if (remark == '0') {
              that.setData({
                shadeCon: false,
              })
            } else {
              that.setData({
                shadeCon: true,
              })
              console.log("本大爷是采购商")
            }
          } else if (res.data.httpCode == 200) {
            //保存Token
            wx.setStorageSync('token', res.data.data)
            var goodsQuantityOffers = that.data.goodsQuantityOffers;
            var remark = that.data.remark;
            if (remark == '0') {
              that.setData({
                shadeCon: false,
              })
            } else {
              that.setData({
                shadeCon: true,
              })
              console.log("本大爷是采购商")
            }
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
      console.log("看看上步操作哪里出了问题~~~~~~")
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
            //已经有Token
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
      wx.navigateTo({
        url: '../userBind/userBind'
      });
      console.log("看看上步操作哪里出了问题~~~~~~")
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
  GoShopHome:function(){
    var ShopHomeId = this.data.dataMore.shopId
    wx.redirectTo({
      url: '../storeHome/storeHome?id=' + ShopHomeId
    })
  },
  //商品属性
  TypeBtnFixed: function () {
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
  //返回首页
  GoShoppingHome:function(){
      wx.redirectTo({
        url: '../index/index',
      })
  },
});