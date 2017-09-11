var WxParse = require('../../pages/wxParse/wxParse.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    TypeToggle: false,
    interval: 5000,
    duration: 1000,
    indicatorColor: 'rgba(137,137,137,0.8)',
    indicatorActiveColor: 'rgba(255,255,255,0.8)',
    dataMore: [],
    resourceIdListArray: [],
    //正常显示图片
    normalImg: true,
    defaultImg: false,
    //下架
    Toggle: false,
    ToggleShop: true,
    wxGoodId: "",
    detailList: {},
    NewImg: [],
    imgurlList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodsId = options.goodsId;
    var Token = wx.getStorageSync('token');
    var jsonObj = {
      "id": goodsId
    };
    var that = this;
    that.setData({
      wxGoodId: goodsId
    });
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + Token + '&url=/pFGoodsController/getExtendGoodsByGoodsId',
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
          contactProvince: res.data.data.contactProvince.slice(0, 2),
          contactCity: res.data.data.contactCity.slice(0, 2),
          name: res.data.data.name,
          supplyType: res.data.data.supplyType,
          num: res.data.data.num,
          freightExplain: res.data.data.freightExplain,
          storeKeywordNames: res.data.data.storeKeywordNames,
          TypeMapList: res.data.data.mapList
        })
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
        // WxParse.wxParse('detail', 'html', detail, that, 5);
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
  //拨打电话
  calling: function () {
    var PhoneNum = this.data.dataMore.linkTel;
    wx.makePhoneCall({
      phoneNumber: PhoneNum
    })
  },
  //跳转到商户首页
  GoShopHome: function () {
    var GoHomeId = this.data.dataMore.shopId;
    wx.redirectTo({
      url: '../storeHome/storeHome?id=' + GoHomeId
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
  //返回首页
  GoShoppingHome: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
})