//sort.js
Page({
  data: {
    currentNavtab: "0",
    newMoreLeftListID:"",
    newMoreLeftList: "",
    newMoreRightList:'',
    listleft:"",
    resourceId:"",//广告位的ID
    id:""
  },
  //请求左边内容的ajax
  onLoad: function () {
     var that = this;
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFGoodsClassDummyController/getChildClass',
      method: 'GET',
      data:{
        pid:"812213061883527168"
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          listleft: res.data.data

        });
        that.data.newMoreLeftList = res.data.data;
        console.log(that.data.newMoreLeftList);
      
       that.data.newMoreLeftListID = res.data.data[0].id;
        var t = that.data.newMoreLeftListID;
        //console.log(t);


        wx.request({
          url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFGoodsClassDummyController/getChildClass',
          method: 'GET',
          data: {
            pid: t
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            // console.log(res.data);
            that.setData({
              newMoreRightList: res.data.data
            })
          }
        })
      }
    });
    //一楼的广告位
    var jsonObj = {
      code: 'oneAdv',
      isPicture: true
    };
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFStoreAdvertisingPositionReController/getStoreAdvertisingPositionRe',
      method: 'GET',
      data: {
        jsonObj: JSON.stringify(jsonObj)
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       var resourceIdArr=res.data.data;
        that.setData({
          resourceId: resourceIdArr[0].resourceId
        })
      }
    })
 },
  switchTab: function (e) {
    var id = e.target.dataset.idx;
    var index = e.target.dataset.index;//获取下标
    if(index==0){
      //一楼的广告位
      var jsonObj = {
        code: 'oneAdv',
        isPicture: true
      };
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFStoreAdvertisingPositionReController/getStoreAdvertisingPositionRe',
        method: 'GET',
        data: {
          jsonObj: JSON.stringify(jsonObj)
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resourceIdArr = res.data.data;
          console.log(resourceIdArr[0].resourceId + "$$$$$$$$$$$");
          that.setData({
            resourceId: resourceIdArr[0].resourceId
          })
        }
      })
    }else if(index==1){
        //二楼的广告位
      var jsonObj = {
        code: 'twoAdv',
        isPicture: true
      };
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFStoreAdvertisingPositionReController/getStoreAdvertisingPositionRe',
        method: 'GET',
        data: {
          jsonObj: JSON.stringify(jsonObj)
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resourceIdArr = res.data.data;
          console.log(resourceIdArr[0].resourceId + "$$$$$$$$$$$");
          that.setData({
            resourceId: resourceIdArr[0].resourceId
          })
        }
      })
    }else if(index==2){
        //三楼的广告位
      var jsonObj = {
        code: 'threeAdv',
        isPicture: true
      };
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFStoreAdvertisingPositionReController/getStoreAdvertisingPositionRe',
        method: 'GET',
        data: {
          jsonObj: JSON.stringify(jsonObj)
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resourceIdArr = res.data.data;
          console.log(resourceIdArr[0].resourceId + "$$$$$$$$$$$");
          that.setData({
            resourceId: resourceIdArr[0].resourceId
          })
        }
      })
    }else if(index==3){
        //四楼的广告位
      var jsonObj = {
        code: 'fourAdv',
        isPicture: true
      };
      wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFStoreAdvertisingPositionReController/getStoreAdvertisingPositionRe',
        method: 'GET',
        data: {
          jsonObj: JSON.stringify(jsonObj)
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resourceIdArr = res.data.data;
          that.setData({
            resourceId: resourceIdArr[0].resourceId
          })
        }
      })
    }
    var that = this
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pFGoodsClassDummyController/getChildClass',
      method: 'GET',
      data: {
        pid:id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          newMoreRightList: res.data.data
        })
      }
    }),

    // setData 函数用于将数据从逻辑层发送到视图层，同时改变对应的 this.data 的值。
    this.setData({
      currentNavtab: index
    });
  },
  //点击跳转商品分类搜索页
  classification: function (e) {
    var nameid = e.currentTarget.dataset.nameid;//获取一级类目的id;
    var index =e.currentTarget.dataset.index
    var url = e.currentTarget.dataset.url;//获取url地址   '../../pages/search/search_classify?classId=793258034284462080
    console.log(url);
    var twonameid = e.currentTarget.dataset.twonameid//二级类目的id
    wx.navigateTo({
      url: '../../pages' + url + '&twonameid=' + twonameid + '&index='+ index,
      // url: '../../pages/search/search_classify?nameid=' + nameid + '&childId=' + twonameid
    })
    },
  })