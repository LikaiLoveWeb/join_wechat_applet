//logs.js
var WxParse = require('../../pages/wxParse/wxParse.js');
var app = getApp();

Page({
  data: {
    Toggle: false,
    ToggleShop: true,
    shadeCon: true,
    indicatorDots: true,
    TypeToggle: false,
    autoplay: true,
    goTop_show: false,
    interval: 5000,
    duration: 1000,
    indicatorColor: 'rgba(137,137,137,0.8)',
    indicatorActiveColor: 'rgba(255,255,255,0.8)',
    scrollTop: 0,
    goodsQuantityOffers: [],
    countFidex: true,
    CountBoxNav: true,
    mainStandarList: [],
    singleNum: 0,
    singlePrice: 0,
    dataMore: [],
    keyList: [],
    NumList: [],
    IdList: [],
    BuyNumList: [],
    standardMapList: [],
    standardMapListNew: [],
    NewListVavlue: [],
    //单个价格
    ShopSinglePrice: true,
    MorePrice: false,
    //单个数量
    MoreleNum: false,
    SingleNum: true,
    //单个事件
    SingleCount: true,
    MoreCount: false,
    //查看价格
    ClickBtn: true,
    _num: 0,
    //ID集合
    VcartIds: [],
    VnumberLisr: [],
    NewListKeyId: [],
    //图片
    resourceIdListArray: [],
    //富文本转义
    datapage: [],
    //正常显示图片
    normalImg: true,
    defaultImg: false,
    remark: '',
    //存储微信Id
    wxAccount: "",
    //
    GoShoppingToggle: false,
    //颜色,尺码
    Color: "",
    Size: "",
    //存入token
    Token: "",
    //存入goodsId
    wxGoodsId: "",
    //商品属性
    TypeMapList: [],
    //value
    KeyValie: "",
    imgurlList:[],
  },
  onLoad: function (opId) {
    //初始化详情
    var goodsId = opId.goodsId;
    var jsonObj = {
      "id": goodsId
    };
    var that = this;
    var ShopToken = wx.getStorageSync('token');
   // console.log(ShopToken+"mmmmmmmmmmmmmmmmmmmmmmmmmmm")
    that.setData({
      Token: ShopToken,
      wxGoodsId: goodsId
    });
    //console.log(ShopToken)
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + ShopToken + '&url=/pFGoodsController/getExtendGoodsByGoodsId',
      data: {
        "jsonObj": JSON.stringify(jsonObj)
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data != null) {
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
            storeKeywordNames: res.data.data.storeKeywordNames,
            standardMapList: res.data.data.standardMapList,
            mainStandarList: res.data.data.mainStandarList,
            Color: res.data.data.mainStandarList[0].valueName,
            remark: res.data.data.remark,
            Size: res.data.data.standardMapList[0].vName,
            TypeMapList: res.data.data.mapList
          });
        }
        var goodsQuantityOffers = res.data.data.goodsQuantityOffers;
        var remark = res.data.data.remark;
        if (res.data.data.remark=='1') {
          that.setData({
            ShopSinglePrice: false,
            MorePrice: true,
            //单个数量
            MoreleNum: true,
            SingleNum: false,
            //单个事件
            SingleCount: false,
            MoreCount: true,
            //查看价格
            ClickBtn: false
          })
        };
        //转义的Html
        var detail = that.data.dataMore.detail;
        //var imgurlList = that.returnHandlerDetail(detail)

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
        console.log(imgurlList)
        that.setData({
          imgurlList: imgurlList
        });
        var NewList = [];
        var mainStandarListNew = res.data.data.mainStandarList;
        var standardMapListNew = res.data.data.standardMapList;
        for (var i = 0; i < standardMapListNew.length; i++) {
          if (standardMapListNew[i].kTemplateValue == mainStandarListNew[0].key) {
            NewList.push(standardMapListNew[i])
          }
        };
        that.setData({
          standardMapListNew: NewList
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
    // var that = this;
    //调用微信登录接口获取openid 
    // wx.login({
    //   success: function (res) {
    //     //console.log(res.code)
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa218a849df64ab76&secret=3bc99bbc129ca44f1363d04d9092c29d&js_code=' + res.code + '&grant_type=authorization_code', //仅为示例，并非真实的接口地址
    //       data: {
    //         appid: 'wxa218a849df64ab76',
    //         secret: '3bc99bbc129ca44f1363d04d9092c29d',
    //         js_code: res.code,
    //         grant_type: 'authorization_code'
    //       },
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       success: function (res) {
    //         //console.log(res.data.openid + "mcmmmmmmmm");
    //         //存储OpenId
    //         var waChat = res.data.openid;
    //         //console.log(waChat+"mccccccccc")
    //        //console.log(typeof waChat)
    //         that.setData({
    //           wxAccount: waChat
    //         })
    //         //console.log(that.data.wxAccount)
    //       }
    //     })
    //   }
    // });
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // wx.setStorageSync('logs', logs)
    // that.setData({
    //   wxAccount: app.globalData.wxAccount
    // })
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
  //单个价格加
  SingleAdd: function (e) {
    //调用总价
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    for (var i = 0; i < goodsNumMore.length; i++) {
      if (index == goodsNumMore[i].vTemplateValue) {
        var NumNum = parseInt(goodsNumMore[i].number);
        NumNum = NumNum + 1;
        //console.log(NumNum+"mc")
        goodsNumMore[i].number = NumNum;
      }
    };
    //赋值input
    for (var i = 0; i < standardMapListNew.length; i++) {
      for (var j = 0; j < goodsNumMore.length; j++) {
        if (standardMapListNew[i].vTemplateValue == goodsNumMore[j].vTemplateValue && standardMapListNew[i].kTemplateValue == goodsNumMore[j].kTemplateValue) {
          //console.log(standardMapListNew[i].vTemplateValue + "**********" + goodsNumMore[j].vTemplateValue + "****" + goodsNumMore[j].number + standardMapListNew[i].kTemplateValue+"ccc");
          standardMapListNew[i].number = goodsNumMore[j].number;
        }
      }
    };
    this.SingleTotal();
  },
  //单个价格减
  SingleSub: function (e) {
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    for (var i = 0; i < goodsNumMore.length; i++) {
      if (index == goodsNumMore[i].vTemplateValue) {
        var NumNum = parseInt(goodsNumMore[i].number);
        if (NumNum > 0) {
          NumNum = NumNum - 1;
          //console.log(NumNum+"mc")
          goodsNumMore[i].number = NumNum;
        } else {
          console.log("小于0,不能在减啦~~~")
        }
      }
    };
    //赋值input
    for (var i = 0; i < standardMapListNew.length; i++) {
      for (var j = 0; j < goodsNumMore.length; j++) {
        if (standardMapListNew[i].vTemplateValue == goodsNumMore[j].vTemplateValue && standardMapListNew[i].kTemplateValue == goodsNumMore[j].kTemplateValue) {
          //console.log(standardMapListNew[i].vTemplateValue + "**********" + goodsNumMore[j].vTemplateValue + "****" + goodsNumMore[j].number + standardMapListNew[i].kTemplateValue+"ccc");
          standardMapListNew[i].number = goodsNumMore[j].number;
        }
      }
    };
    this.SingleTotal();
  },
  //ID
  //计算总价
  SingleTotal: function () {
    var standList = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    var SinglePirce = this.data.dataMore.price;
    var standNum = 0;
    var MoreTotalPrice = 0;
    for (var i = 0; i < standardMapListNew.length; i++) {
      if (standardMapListNew[i].number > 0) {
        standNum += parseInt(standardMapListNew[i].number);
        console.log(standNum + "mc")
        MoreTotalPrice = standNum * SinglePirce
      }
    };
    this.setData({
      standardMapListNew: standList,
      singleNum: standNum,
      singlePrice: MoreTotalPrice.toFixed(2)
    })
  },
  //单个价格输入
  KeyValueSingle: function (e) {
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    var value = e.detail.value;
    for (var i = 0; i < goodsNumMore.length; i++) {
      if (index == goodsNumMore[i].vTemplateValue) {
        goodsNumMore[i].number = parseInt(value);
      }
    };
    //赋值input
    for (var i = 0; i < standardMapListNew.length; i++) {
      for (var j = 0; j < goodsNumMore.length; j++) {
        if (standardMapListNew[i].vTemplateValue == goodsNumMore[j].vTemplateValue && standardMapListNew[i].kTemplateValue == goodsNumMore[j].kTemplateValue) {
          //console.log(standardMapListNew[i].vTemplateValue + "**********" + goodsNumMore[j].vTemplateValue + "****" + goodsNumMore[j].number + standardMapListNew[i].kTemplateValue+"ccc");
          standardMapListNew[i].number = goodsNumMore[j].number;
        }
      }
    };
    this.SingleTotal();
  },



  //增加
  MoreAdd: function (e) {
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    for (var i = 0; i < goodsNumMore.length; i++) {
      if (index == goodsNumMore[i].vTemplateValue) {
        var NumNum = parseInt(goodsNumMore[i].number);
        NumNum = NumNum + 1;
        goodsNumMore[i].number = NumNum;
      }
    };
    for (var i = 0; i < standardMapListNew.length; i++) {
      for (var j = 0; j < goodsNumMore.length; j++) {
        if (standardMapListNew[i].vTemplateValue == goodsNumMore[j].vTemplateValue && standardMapListNew[i].kTemplateValue == goodsNumMore[j].kTemplateValue) {
          //console.log(standardMapListNew[i].vTemplateValue + "**********" + goodsNumMore[j].vTemplateValue + "****" + goodsNumMore[j].number + standardMapListNew[i].kTemplateValue+"ccc");
          standardMapListNew[i].number = goodsNumMore[j].number;
        }
      }
    };
    this.MorePrice();
  },
  //减少
  MoreSub: function (e) {
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    var keyListNew = this.data.keyList;
    var OldListKeyId = [];
    var NewListKeyId = [];
    for (var i = 0; i < goodsNumMore.length; i++) {
      if (index == goodsNumMore[i].vTemplateValue) {
        var NumNum = parseInt(goodsNumMore[i].number);
        if (NumNum <= 0) {
          console.log("不能在减啦")
        } else {
          NumNum = NumNum - 1;
          goodsNumMore[i].number = NumNum;
          keyListNew.push(goodsNumMore[i].id)
          this.setData({
            NewListKeyId: Array.from(new Set(keyListNew))
          })
        }
      }
    };
    for (var i = 0; i < standardMapListNew.length; i++) {
      for (var j = 0; j < goodsNumMore.length; j++) {
        if (standardMapListNew[i].vTemplateValue == goodsNumMore[j].vTemplateValue && standardMapListNew[i].kTemplateValue == goodsNumMore[j].kTemplateValue) {
          //console.log(standardMapListNew[i].vTemplateValue + "**********" + goodsNumMore[j].vTemplateValue + "****" + goodsNumMore[j].number + standardMapListNew[i].kTemplateValue+"ccc");
          standardMapListNew[i].number = goodsNumMore[j].number;
        }
      }
    };
    this.MorePrice();
    //this.addCarts();
  },
  //MorePrice
  MorePrice: function () {
    var standList = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    var standNum = 0;
    var MoreTotalPrice = 0;
    for (var i = 0; i < standardMapListNew.length; i++) {
      standNum += parseInt(standardMapListNew[i].number)
    };
    var goodsList = this.data.goodsQuantityOffers;
    var TurePrice = "";
    for (var j = 0; j < goodsList.length; j++) {
      if (standNum >= goodsList[j].limit) {
        TurePrice = goodsList[j].price
      };
      if (standNum <= goodsList[0].limit) {
        TurePrice = goodsList[0].price
      };
    };
    MoreTotalPrice = TurePrice * standNum
    this.setData({
      standardMapListNew: standList,
      singleNum: standNum,
      singlePrice: MoreTotalPrice.toFixed(2)
    })
  },
  //多个价格输入
  KeyValueMore: function (e) {
    //console.log(".//.//")
    const index = e.currentTarget.dataset.index;
    var goodsNumMore = this.data.standardMapListNew;
    var standardMapListNew = this.data.standardMapList;
    var value = e.detail.value;
    for (var i = 0; i < goodsNumMore.length; i++) {
      if (index == goodsNumMore[i].vTemplateValue) {
        goodsNumMore[i].number = parseInt(value);
      }
    };
    //赋值input
    for (var i = 0; i < standardMapListNew.length; i++) {
      for (var j = 0; j < goodsNumMore.length; j++) {
        if (standardMapListNew[i].vTemplateValue == goodsNumMore[j].vTemplateValue && standardMapListNew[i].kTemplateValue == goodsNumMore[j].kTemplateValue) {
          //console.log(standardMapListNew[i].vTemplateValue + "**********" + goodsNumMore[j].vTemplateValue + "****" + goodsNumMore[j].number + standardMapListNew[i].kTemplateValue+"ccc");
          standardMapListNew[i].number = goodsNumMore[j].number;
        }
      }
    };
    this.MorePrice();
  },

  //加入购物车
  GoShop: function () {
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var ShopToken = this.data.Token;
    var remark = this.data.remark;
    var that = this;
    if (remark == '1') {
      console.log("采购商")
      var GoNum = this.data.singleNum;
      if (GoNum === 0) {
        wx.showToast({
          title: "小于0",
          icon: 'loading',
          duration: 2000
        });
      } else {
        var standardMapList = this.data.standardMapList;
        var keyListNew = this.data.NewListKeyId;
        var VkeyNumber = this.data.VnumberLisr;
        for (var i = 0; i < standardMapList.length; i++) {
          if (standardMapList[i].number > 0) {
            keyListNew.push(standardMapList[i].id);
            var NewKeyListId = Array.from(new Set(keyListNew));
            VkeyNumber.push(standardMapList[i].number);
            var NewKeyNumber = VkeyNumber;
          }
        };
        this.setData({
          NewListKeyId: NewKeyListId,
          VnumberLisr: NewKeyNumber
        });
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + ShopToken + '&url=/orderCart/add',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: this.data.wxGoodsId,
            standardIdList: JSON.stringify(this.data.NewListKeyId),
            dealNumList: JSON.stringify(this.data.VnumberLisr)
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
    } else {
      var GoNum = this.data.singleNum;
      console.log("非采购商")
      if (GoNum === 0) {
        wx.showToast({
          title: "小于0",
          icon: 'loading',
          duration: 2000
        });
      } else {
        var standardMapList = this.data.standardMapList;
        var keyListNew = this.data.NewListKeyId;
        var VkeyNumber = this.data.VnumberLisr;
        for (var i = 0; i < standardMapList.length; i++) {
          if (standardMapList[i].number > 0) {
            keyListNew.push(standardMapList[i].id);
            var NewKeyListId = Array.from(new Set(keyListNew));
            VkeyNumber.push(standardMapList[i].number);
            var NewKeyNumber = VkeyNumber;
          }
        };
        this.setData({
          NewListKeyId: NewKeyListId,
          VnumberLisr: NewKeyNumber
        });
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + ShopToken + '&url=/orderCart/add',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: this.data.wxGoodsId,
            standardIdList: JSON.stringify(this.data.NewListKeyId),
            dealNumList: JSON.stringify(this.data.VnumberLisr)
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
  BuGoShop: function () {
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var remark = this.data.remark;
    var ShopToken = wx.getStorageSync('token');
    //console.log(ShopToken)
    if (remark == '1') {
      //console.log("ddddd")
      var GoLimit = this.data.singleNum;
      var that = this;
      if (GoLimit < goodsQuantityOffers[0].limit) {
        wx.showToast({
          title: "小于起批量",
          icon: 'loading',
          duration: 2000
        });
      } else {
        var standardMapList = this.data.standardMapList;
        var keyListNew = this.data.NewListKeyId;
        var VkeyNumber = this.data.VnumberLisr;
        for (var i = 0; i < standardMapList.length; i++) {
          if (standardMapList[i].number > 0) {
            keyListNew.push(standardMapList[i].id);
            var NewKeyListId = Array.from(new Set(keyListNew));
            VkeyNumber.push(standardMapList[i].number);
            var NewKeyNumber = VkeyNumber;
          }
        };
        this.setData({
          NewListKeyId: NewKeyListId,
          VnumberLisr: NewKeyNumber
        });
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + ShopToken + '&url=/orderCart/toOrderNow',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: this.data.wxGoodsId,
            standardIdList: this.data.NewListKeyId,
            dealNumList: this.data.VnumberLisr
          },
          success: function (res) {
            if (res.data.httpCode == 200) {
              //关闭微信弹窗
              wx.hideToast();
              var mapList = res.data.data;
              var id = [];
              var num = [];
              for (var i = 0; i < mapList.length; i++) {
                id.push(mapList[i].cartId);
                num.push(mapList[i].dealNum);
              };
              wx.redirectTo({
                url: '../submitOrder/submitOrder?cartIds=' + id + '&dealNums=' + num + '&now=' + 1,//待修改链接
              })
            }
          }
        })
      }
    } else {
      //console.log("顶顶顶顶")
      var judgeNum = this.data.dataMore.minimum;
      var JudgeMin = this.data.singleNum
      if (JudgeMin < judgeNum) {
        wx.showToast({
          title: "小于起批量",
          icon: 'loading',
          duration: 2000
        });
      } else {
        var SingleMapList = this.data.standardMapList;
        var keyListNew = this.data.NewListKeyId;
        var VkeyNumber = this.data.VnumberLisr;
        for (var i = 0; i < SingleMapList.length; i++) {
          if (SingleMapList[i].number > 0) {
            keyListNew.push(SingleMapList[i].id);
            var NewKeyListId = Array.from(new Set(keyListNew));
            VkeyNumber.push(SingleMapList[i].number);
            var NewKeyNumber = VkeyNumber;
          }
        };
        this.setData({
          NewListKeyId: NewKeyListId,
          VnumberLisr: NewKeyNumber
        });
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + ShopToken + '&url=/orderCart/toOrderNow',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            goodsId: this.data.wxGoodsId,
            standardIdList: this.data.NewListKeyId,
            dealNumList: this.data.VnumberLisr
          },
          success: function (res) {
            if (res.data.httpCode == 200) {
              //关闭微信弹窗
              wx.hideToast();
              var mapList = res.data.data;
              var id = [];
              var num = [];
              for (var i = 0; i < mapList.length; i++) {
                id.push(mapList[i].cartId);
                num.push(mapList[i].dealNum);
              };
              wx.redirectTo({
                url: '../submitOrder/submitOrder?cartIds=' + id + '&dealNums=' + num + '&now=' + 1,//待修改链接
              })
            }
          }
        })
      };
    }
  },
  //点击input
  ValueName: function (e) {
    const index = e.currentTarget.dataset.index;
    var standardMapListNew = this.data.standardMapList;
    var mainStandarListNew = this.data.mainStandarList;
    var goodsNumMore = this.data.standardMapListNew;
    // var NewListVavlue = this.data.NewListVavlue; 
    var ValueList = [];
    for (var i = 0; i < standardMapListNew.length; i++) {
      if (mainStandarListNew[index].key == standardMapListNew[i].kTemplateValue) {
        ValueList.push(standardMapListNew[i]);
      }
    };
    //console.log(ValueList);
    this.setData({
      standardMapListNew: ValueList,
      _num: index
    })
  },

  ClickShade: function () {
    var goodsQuantityOffers = this.data.goodsQuantityOffers;
    var remark = this.data.remark;
    if (remark == '0') {
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
  //返回顶部
  ShoppingScroll: function (e) {
    console.log(e)
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
  GoBack: function () {
    var that = this
    this.setData({
      scrollTop: 0
    })
  },
  //点击出现弹窗
  FidexBtn: function () {
    //拿到token
    var token = wx.getStorageSync('token');
    console.log(token+"mmmmmmmm")
    if (token) {
      var that = this;
      that.setData({
        wxAccount: app.globalData.wxAccount
      });
      var NewWxAccount = that.data.wxAccount
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
            //已经有Token
            wx.switchTab({
              url: '../ShoppingCart/ShoppingCart',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
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
            });
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
      //console.log("看看上步操作哪里出了问题~~~~~~")
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
  //点击进入店铺首页
  GoToShopHome: function () {
    var ShopHomeId = this.data.dataMore.shopId;
    wx.redirectTo({
      url: '../storeHome/storeHome?id=' + ShopHomeId,
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
  //下架商品返回
  GoShoppingHome: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  //

});

