var app = getApp()
Page({
  data: {
    // navTab: ["睡衣", "旗袍", "唐装", "连衣裙", "吊带", "婚服", "家装","家装"],
    // currentNavtab: "0",
    Navtab:0,
    nameTitle: "",
    childname:'',
    siveclassid:'',
    topscrooleW:0,
    scrollTop: 0,  //回到顶部
    floorstatus: false, //判断回到顶部的框是否显示
    scpage: 1,
    valeId:"",
    hasMore: false,
    hasNOne: false,
    shopnone: true,
    orderlistArr:[],

  },
  // 页面初始化加载
  onLoad: function (options) {
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration:1000,
    });
   var that = this;
    var twonameid = options.twonameid;
    var index = options.index;
    var nameid = options.classId;//获取商品classID的id
    that.data.valeId = options.classId;
    that.data.siveclassid = options.classId;
    that.setData({
      siveclassid: options.classId,
      Navtab: options.index
    })
    var childId = options.childId;//获取二级类目的id
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFGoodsClassDummyController/getSameLevel',
      method: 'get',
      data: {
        id: twonameid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        var stairfirst = res.data.data[0];//一级类目的名称
        var childname=res.data.data[1];
        console.log(childname)
        // for (var i = 0; i < childname.length; i++) {
        //   childname[i].name = childname[i].name
        // }
        that.data.nameTitle = stairfirst.name; //商品分类的头部名称
       wx.setNavigationBarTitle({
          title: that.data.nameTitle,
          success: function (res) {
            //成功回调的方法
          }
        })
        var len = res.data.data[1].length*125;//动态获取导航的宽度
        that.setData({
          childname: res.data.data[1],
          topscrooleW: len+'rpx'
        })
      }
    })
    var chdIdsList = [];
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/seachGoodsController/getRecursion',
      method: 'GET',
      data: {
        goodsClassId: nameid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        chdIdsList = res.data.data.chdIdsList;//查询出来的goodsclassID
        that.setData({
          stairtwo: chdIdsList,
        })
        var goodsId = '';
        for (var i = 0; i < chdIdsList.length; i++) {
          goodsId += "goods_classId:" + chdIdsList[i] + ' '
        }
        goodsseach(goodsId);
        // goodsId.substring(0,goodsId.split('+').length -1);
        // console.log(goodsId)
      }
    })
    function goodsseach(goodsId){
      //搜索商品的方法
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=searchCode&token=&url=/search/goods/query',
        method: 'get',
        data: {
          q: goodsId,   //父级类目id
          page: "1",                              //页码
          rows: "6",                             //每页数量
          sort: "",
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.data);
          that.setData({
            orderlistArr: res.data.data.resultList,
          })
        }
      })
    }
  },
  // //设置导航条的title
  // onReady: function () {
    
  // },
  //跳转商品详情页
  goodshop:function(e){
    var goosid = e.currentTarget.dataset.goodsid;
    console.log(goosid)
    app.GoodShopping(goosid)

},
  goTop: function (e) {  // 回到顶部js
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      })
    }
  },
  scrolltolower: function () {
    var that=this;
    if (that.data.shopnone){
      that.setData({
        shopnone:false ,
        hasMore: true
      })
      var chdIdsList = [];
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/seachGoodsController/getRecursion',
        method: 'GET',
        data: {
          goodsClassId: that.data.valeId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          chdIdsList = res.data.data.chdIdsList;//查询出来的goodsclassID
          that.setData({
            stairtwo: chdIdsList,
          })
          var goodsId = '';
          for (var i = 0; i < chdIdsList.length; i++) {
            goodsId += "goods_classId:" + chdIdsList[i] + ' '
          }
          goodsseach(goodsId);
          // goodsId.substring(0,goodsId.split('+').length -1);
          // console.log(goodsId)
        }
      })
      function goodsseach(goodsId) {
        //搜索商品的方法
        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=searchCode&token=&url=/search/goods/query',
          method: 'GET',
          data: {
            q: goodsId,   //父级类目id
            page: ++that.data.scpage,                              //页码
            rows: "6",                             //每页数量
            sort: "",
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data);
            var arr = res.data.data.resultList;
            that.setData({
              orderlistArr: that.data.orderlistArr.concat(arr),
              hasNOne:false
            
            })
            that.setData({
              shopnone: true
            })
            if (arr.length <= 0) {
              that.setData({
                shopnone: false,
                hasMore: false,
                hasNOne: true
              })

            }
          }, complete: function (res) {
            that.setData({
              hasMore: false
            })
          }
        })
      }
    }
    
  },

  switchTab: function (e) {
    var orderlistArr=[];
    this.setData({
      Navtab: e.currentTarget.dataset.index
    });
    var that = this;
    var siveclassid = e.currentTarget.dataset.url;
    // var index = siveclassid.indexOf('?');
    var con = siveclassid.substring(32, siveclassid.length)//获取classID
    var chdIdsList = [];
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/seachGoodsController/getRecursion',
      method: 'GET',
      data: {
        goodsClassId: con
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        chdIdsList = res.data.data.chdIdsList;
        that.setData({
          stairtwo: chdIdsList,
        })
        var goodsId = '';
        for (var i = 0; i < chdIdsList.length; i++) {
          goodsId += "goods_classId:" + chdIdsList[i] + ' '
        }
        goodsseach(goodsId);
        // goodsId.substring(0,goodsId.split('+').length -1);
        // console.log(goodsId)
      }
    })
    function goodsseach(goodsId) {
      //搜索商品的方法
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=searchCode&token=&url=/search/goods/query',
        method: 'get',
        data: {
          q: goodsId,   //父级类目id
          page: "1",                              //页码
          rows: "6",                             //每页数量
          sort: "",
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.data.resultList);
          if (res.data.data.resultList==""){
            that.setData({
              hasMore: false,
              hasNOne: false
            })
          }
          that.setData({
            orderlistArr: res.data.data.resultList,
          })
        }
      })
    }

  }

})
