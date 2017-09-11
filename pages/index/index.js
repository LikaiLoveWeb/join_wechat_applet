//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    indexAdvList:[],   //首页banner广告位
    indexReco:[],   //精品推荐的数组
    scrollTop: 0 ,  //回到顶部
    floorstatus:false, //判断回到顶部的框是否显示
    scpage:1,
    hasMore: true,
    hasNOne:false,
    shopnone:true
  },
  goMoreClass:function(){  //跳转到更多分类
    wx.switchTab({
      url: '../../pages/sort/sort'
    })
  },
  goUrl:function(e){  //点击商品分类跳转的链接
    var url = e.currentTarget.dataset.url;
    var twonameid = e.currentTarget.dataset.twonameid;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages' + url + '&twonameid=' + twonameid + '&index=' + index
    })
  },
  goShopDetail:function(e){   //跳转到商品详情页面
  var detailurl = e.currentTarget.dataset.detailurl;//goodsid
  app.GoodShopping(detailurl)
  // wx.navigateTo({
  //     url: '../../pages/refreshto/refreshtoPage?goodsId=' + detailurl
  //   })
 
  },
  goTop: function (e) {  // 回到顶部js
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    if (e.detail.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      })
    }
  },

  scrolltolower:function(){
    console.log("加载")
    var that=this;
    if (that.data.shopnone){
      that.setData({
        shopnone:false
        })
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFGoodsController/getGoodGoodsRecomend',
        method: 'get',
        data: {
          code: 'samllReom',
          pageSize:6,
          pageNum: ++that.data.scpage
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var arr = res.data.data.list;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].province == '北京市' || arr[i].province == '上海市' || arr[i].province == '天津市' || arr[i].province == '重庆市') {
              arr[i].cityName = arr[i].province.substring(0, arr[i].province.length - 1);
            } else {
              arr[i].cityName = arr[i].cityName.substring(0, arr[i].cityName.length - 1);
            }
          }
          that.setData({
            indexReco: that.data.indexReco.concat(arr),

          })
          that.setData({
            shopnone: true
          })
          if(arr.length<=0){
            that.setData({
              shopnone:false,
              hasMore:false,
              hasNOne :true
            })
           
          }
        }

      });

    
   }
  
  },

//事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  onLoad: function () {
    var token = wx.getStorageSync('token');   //获取token的方法
    console.log(token);
    var that = this;
//首页banner的广告位
    var jsonObj = {
      code: 'indexAdv',
      isPicture: true
    };

    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFStoreAdvertisingPositionReController/getStoreAdvertisingPositionRe',
      method: 'POST',
      data: {
        jsonObj: JSON.stringify(jsonObj)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.data!=''){
          var name = res.data.data;
          console.log(name);
          for (var i = 0; i < name.length; i++) {
            if (name[i].name == "连衣裙") {
              name[i].nameID = '812218314649501696'
              name[i].index = "0"
            } else if (name[i].name == "旗袍") {
              name[i].nameID = '812218314649501696';
              name[i].index = "1"
            } else if (name[i].name == "睡衣") {
              name[i].nameID = '812218314649501696';
              name[i].index = "2"
            } else if (name[i].name == "内衣") {
              name[i].nameID = '812218314649501696';
              name[i].index = "3"
            } else if (name[i].name == "丝巾") {
              name[i].nameID = '812219021750435840';
              name[i].index = "0"
            } else if (name[i].name == "家纺") {
              name[i].nameID = '812219067921334272';
              name[i].index = ""
            } else if (name[i].name == "工艺品") {
              name[i].nameID = '812219168928563200';
              name[i].index = ""
            }
          }
          console.log(name)
          that.setData({
            indexAdvList: res.data.data
          })
        }
       
      }
  
    });

//精品推荐的广告位

    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFGoodsController/getGoodGoodsRecomend',
       method: 'get',
      data: {
        code: 'samllReom',
        pageSize:3,
        pageNum: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var arr=res.data.data.list;
        for(var i=0;i<arr.length;i++){
          if (arr[i].province == '北京市' || arr[i].province == '上海市' || arr[i].province == '天津市' || arr[i].province == '重庆市'){
            arr[i].cityName = arr[i].province.substring(0, arr[i].province.length - 1);
          }else{
            arr[i].cityName = arr[i].cityName.substring(0, arr[i].cityName.length - 1);
          }
        }
        that.setData({
          indexReco: arr
        })

      }

    });



    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
  }
})

