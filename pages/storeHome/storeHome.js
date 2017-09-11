//storeHome.js
var app = getApp()
Page({
  data: {
    id:"",//店铺logo
    logo:"",//店铺logo
    name:"",//店铺名称
    keywordNames:"",//主营类目
    contactAddress:"",//地址
    linkMan:"",//联系人
    storegoods:[],
    scrollTop: 0,  //回到顶部
    floorstatus: false, //判断回到顶部的框是否显示
    linkTel:"",
    businessLicensePic:"",
    navigateTitle:"",
    nameTitle:"",
    scpage: 1,
    hasMore: false,
    hasNOne: false,
    shopnone: true,
    storeId:""
  },
  // 请求商品列表的ajax
  onLoad: function (option,pageNum) {
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 500,
    });
   var that = this;
    var storeId =option.id;//店铺的id
    that.data.storeId = storeId
    // that.setData({
    //   storeId:option.id
    // })
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/storeCompanyController/getExtendStoreCompanyAndGoods',
      method: 'GET',
      data: {
        storeId: storeId,
        pageSize:4,
        pageNum:1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var storeHome = res.data.data.store;//店铺的商家信息
        var storegoods = res.data.data.goods.list;//店铺的商品信息
        var name = res.data.data.store.name;
        that.data.navigateTitle=name;
        console.log(that.data.navigateTitle+"%##############%%%");
        wx.setNavigationBarTitle({
          title: that.data.navigateTitle,
          success: function (res) {
            //成功回调的方法
          }
        })
        that.setData({
          // 店铺信息
          id: storeHome.id,
          name: storeHome.name,
          keywordNames: storeHome.keywordNames,
          contactAddress: storeHome.store.contactAddress,
          linkMan: storeHome.store.linkMan,
          linkTel: storeHome.store.linkTel,
          logo: storeHome.store.logo,
          businessLicensePic: storeHome.store.businessLicensePic,
          // //商品信息
          storegoods: storegoods,
        });
      }
    });
   },
  // onReady: function () {
  //   var that = this;
  //   //设置导航条的title
  // },
  // 点击拨打电话事件
  callphone:function(e){
    var linkTel = e.currentTarget.dataset.postid
    wx.makePhoneCall({
      phoneNumber:linkTel, //仅为示例，并非真实的电话号码
      success: function () {
        console.log("拨打电话成功")
      },
      fail: function () {
        console.log("拨打电话失败")
      }
    })

  },
  // 跳转商品详情页
  Detailpage:function(e){
    var goodsid = e.currentTarget.dataset.goodsid//获取商品的goodsId
    app.GoodShopping(goodsid)
    // wx.navigateTo({
    //   url: '../refreshto/refreshtoPage?goodsId=' + goodsid
    // })

  },
  // 回到顶部
  goTop: function (e) {  // 回到顶部js
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    if (e.detail.scrollTop >350) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      })
    }
  },
  // 上拉加载事件
  scrolltolower: function(){
   var that=this;
    if (that.data.shopnone){
      that.setData({
        shopnone:false,
        hasMore: true
      })
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/storeCompanyController/getExtendStoreCompanyAndGoods',
        method: 'GET',
        data: {
          storeId: that.data.storeId ,
          pageSize:6,
          pageNum: ++that.data.scpage,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var storeHome = res.data.data.store;//店铺的商家信息
          var storegoods = res.data.data.goods.list;//店铺的商品信息
          var name = res.data.data.store.name;
          that.data.navigateTitle = name;
          that.setData({
            // 店铺信息
            id: storeHome.id,
            logoPath: storeHome.logoPath,
            name: storeHome.name,
            keywordNames: storeHome.keywordNames,
            contactAddress: storeHome.store.contactAddress,
            linkMan: storeHome.store.linkMan,
            linkTel: storeHome.store.linkTel,
            businessLicensePic: storeHome.store.businessLicensePic,
            // //商品信息
            // storegoods: res.data.data.goods.list,
          });
          that.setData({
            storegoods: that.data.storegoods.concat(storegoods)

          })
          that.setData({
            shopnone: true
          })
          if (storegoods.length <= 0) {
            that.setData({
              shopnone: false,
              hasMore: false,
              hasNOne: true
            })

          }
        }, 
        complete:function(res){
          that.setData({
            hasMore: false
          })
        }
      });
      // that.setData({
      //   shopnone: true
      // })
    }
    

   
  }

})
