//跳转到商品详情页
Page({
  data: {
    
   },
  onLoad: function (options) {
    console.log(options.goodsId)
    //出现弹窗
    wx.showToast({
      title: 'loading',
      icon:'loading',
      duration:1500,
    });
    var goodsId = options.goodsId;
    var token = wx.getStorageSync('token');   //获取token的方法
    wx.request({
      url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/goodsClassTemplateController/selectSum',
      data: {
        goodsId: goodsId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data+"mc")
        wx.hideToast();
        // alert(data.data+"dasssssssssssss")
        if (res.data.data == '0') {
          wx.navigateTo({
            url: '../ShopAttributeOne/ShopAttributeOne?goodsId=' + goodsId,
          })
          // window.location.href=('/goodsShow/goodsStateless?goodsId='+lib_moudle.getRequestParams().goodsId)
        } else if (res.data.data == '1') {
          wx.navigateTo({
            url: '../Shopping/Shop?goodsId=' + goodsId,
          })
          //window.location.href=('/goodsShow/goodsStatelessOne?goodsId='+lib_moudle.getRequestParams().goodsId)
        } else if (res.data.data == '2') {
          wx.navigateTo({
            url: '../ShoppingMore/ShoppingMore?goodsId=' + goodsId,
          })
        } else if (res.data.data == '-1') {
          /*vm.pageDisplay = true*/
          wx.navigateTo({
            url: '../ShopNR/ShopNR?goodsId='+ goodsId,
          })
          // window.location.href=('/goodsShow/shopping_price?goodsId='+tools.getRequestParams().goodsId)
        }
      }
    })
  }
})


