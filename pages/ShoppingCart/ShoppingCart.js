// ShoppingCart.js                    ----bindtouchend="touchE"
var app = getApp(); //wxToast挂载在app下面，所以必须先获取app
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code:true,
        WiXicode:'',
        userInfo: {},
        token:'',
        _num:1,
        no_shopping:false,
        BeOverdue:true,
        Calculation_pric_num:0,
        src:'../images/Shopping/no_ch.png',
        addressList: [],//未失效的商品列表
        editIndex: 0,
        delBtnWidth: 60,
        InvalidList: [],//失效的列表
        InvaliIndex: 0,
        InvalidWidth: 60,
    },
    reset: reset,
    toast: toast,
    checkboxFn: checkboxFn,
    shopxFn: shopxFn,//店铺跳转
    InvaTouchS: InvaTouchS,
    laVtouchM: laVtouchM,
    laVtouchE: laVtouchE,
    touchS: touchS,
    touchM: touchM,
    touchE: touchE,
    shopping: shopping,
    shop_path: shop_path,//商品跳转
    deleteShop: deleteShop,//删除购物车内有效商品(单个删除)
    Calculation_pric: Calculation_pric,//计算商品总价
    updateDealNum: updateDealNum,//修改商品数量的
    delete_btn: delete_btn,//删除失效的--全部
    remove_btn: remove_btn,//删除生效的
    plus: plus,//加
    reduce: reduce,//减
    SettlementAjax: SettlementAjax,//结算页的ajax
    shopAllcheckboxFn: shopAllcheckboxFn,//店铺的all选中
    allcheckboxFn: allcheckboxFn,//全部选中
    Settlement: Settlement,//去结算
    init: init,//初始化
    shoppingBlur: shoppingBlur,//输入框失去焦点
    loadFn: loadFn,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.loadFn();
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
        //下拉刷新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
        wx.showNavigationBarLoading() //在标题栏中显示加载
        var that = this;
        that.setData({
          no_shopping: false,
          BeOverdue: true,
          Calculation_pric_num: 0,
          src: '../images/Shopping/no_ch.png',
          addressList: [],//未失效的商品列表
          editIndex: 0,
          delBtnWidth: 60,
          InvalidList: [],//失效的列表
          InvaliIndex: 0,
          InvalidWidth: 60
        })
        var token = wx.getStorageSync('token');
        if (token != null || token != undefined) {
          var that = this;
          that.shopping(token)
        }else{
          that.loadFn()
        }
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

    }
})


function shopAllcheckboxFn(e){
    //店铺选中
    var index = e.currentTarget.dataset.index;
    var btn = e.currentTarget.dataset.btn;
    var that = this;
    var addressListFn = that.data.addressList;
    console.log(btn, index)
    if(!btn){
        //未选中，需要选中
        addressListFn[index].shop.src = '../images/Shopping/ch.png';
        addressListFn[index].shop.isCheckbox = true;
        for (var i = 0; i < addressListFn[index].shopArray.length;i++){
            addressListFn[index].shopArray[i].src ='../images/Shopping/ch.png';
            addressListFn[index].shopArray[i].isCheckbox = true;
        }
        var code = true;
        for (var i = 0; i < addressListFn.length;i++){
            for (var k = 0; k < addressListFn[i].shopArray.length;k++){
                if (!addressListFn[i].shopArray[k].isCheckbox){
                    code = false;
                    //有一个商品未选中，就是false
                }
            }
        }
        if (code){
            //说明全部选中了
            that.setData({
                src: '../images/Shopping/ch.png',
                _num: 2
            })
        }
    }else if(btn){
        //选中，需要取消选中
        that.setData({
            src : '../images/Shopping/no_ch.png',
            _num : 1
        })
        addressListFn[index].shop.src = '../images/Shopping/no_ch.png';
        addressListFn[index].shop.isCheckbox = false;
        for (var i = 0; i < addressListFn[index].shopArray.length; i++) {
            addressListFn[index].shopArray[i].src = '../images/Shopping/no_ch.png';
            addressListFn[index].shopArray[i].isCheckbox = false;
        }

    }
    that.setData({
        addressList: addressListFn
    })
    that.updateDealNum('', '', '', true)
}

function allcheckboxFn(){
    //购物车全部选中
    var src = '', _num='';
    var that = this;
    var index = that.data._num, addressListFn = that.data.addressList;
    if(index == 1){
        src = '../images/Shopping/ch.png';
        _num = 2;
        for (var i = 0; i < addressListFn.length; i++) {
            addressListFn[i].shop.src = '../images/Shopping/ch.png';
            addressListFn[i].shop.isCheckbox = true;
            for (var k = 0; k < addressListFn[i].shopArray.length; k++) {
                addressListFn[i].shopArray[k].src = '../images/Shopping/ch.png';
                addressListFn[i].shopArray[k].isCheckbox = true;
            }
        }
    }else{
        src = '../images/Shopping/no_ch.png';
        _num = 1;
        for (var i = 0; i < addressListFn.length; i++) {
            addressListFn[i].shop.src = '../images/Shopping/no_ch.png';
            addressListFn[i].shop.isCheckbox = false;
            for (var k = 0; k < addressListFn[i].shopArray.length; k++) {
                addressListFn[i].shopArray[k].src = '../images/Shopping/no_ch.png';
                addressListFn[i].shopArray[k].isCheckbox = false;
            }
        }
    }
    that.setData({
        src: src,
        _num: _num,
        addressList: addressListFn
    })
    that.updateDealNum('', '', '', true)
}
function checkboxFn(e,index_,father_){
    var index, father;
    if (index_ != undefined && father_!= undefined){
        index = index_;
        father = father_
    }else{
        index = e.currentTarget.dataset.index;
        father = e.currentTarget.dataset.father;

    }
    var that = this;
    var addressListFn = that.data.addressList;
    var btn = addressListFn[father].shopArray[index].isCheckbox;//若当前选中的是false
    if (index_ != undefined && father_ != undefined) {
        btn = false;
    }
    if (!btn){
        //btn = false ---- >>>
        addressListFn[father].shopArray[index].src = '../images/Shopping/ch.png';
        addressListFn[father].shopArray[index].isCheckbox = true;
        var code = true;
        for (var i = 0; i < addressListFn.length;i++){
            for (var k = 0; k < addressListFn[i].shopArray.length;k++){
                var btns = addressListFn[i].shopArray[k].isCheckbox;
                if (!btns){
                    code = false
                }
            }
        }
        if(code){
            that.setData({
                src: '../images/Shopping/ch.png',
                _num: 2
            })
        }
    } else if (btn){
        that.setData({
            src: '../images/Shopping/no_ch.png',
            _num: 1
        })
        addressListFn[father].shopArray[index].src = '../images/Shopping/no_ch.png';
        addressListFn[father].shopArray[index].isCheckbox = false;
    }
    var code = true;
    for (var i = 0; i < addressListFn[father].shopArray.length;i++){
        if (!addressListFn[father].shopArray[i].isCheckbox){
            //只要有一个false，说明没有全部选中
            code = false
        }
    }

    if(code){
        addressListFn[father].shop.src ='../images/Shopping/ch.png';
        addressListFn[father].shop.isCheckbox = true;
    }else{
        addressListFn[father].shop.src = '../images/Shopping/no_ch.png';
        addressListFn[father].shop.isCheckbox = false;
    }

    that.setData({
        addressList: addressListFn
    })

    that.updateDealNum(addressListFn[father].shopArray[index], father, index,false)

}

function touchS(e){
    //bindtouchstart
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
        this.setData({
            //记录触摸起始位置的X坐标
            startX: e.touches[0].clientX
        });
    }
}
function touchM(e){
    //bindtouchmove //触摸时触发，手指在屏幕上每移动一次，触发一次
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
        //记录触摸点位置的X坐标
        var moveX = e.touches[0].clientX;
        //计算手指起始点的X坐标与当前触摸点的X坐标的差值
        var disX = that.data.startX - moveX;
        //delBtnWidth 为右侧按钮区域的宽度
        var delBtnWidth = that.data.delBtnWidth;
        var txtStyle = "";
        if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
            txtStyle = "left:0px";
        } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
            txtStyle = "left:-" + disX + "px";
            if (disX >= delBtnWidth) {
                //控制手指移动距离最大值为删除按钮的宽度
                txtStyle = "left:-" + delBtnWidth + "px";
            }
        }
        //获取手指触摸的是哪一个item
        var index = e.currentTarget.dataset.index;
        var father = e.currentTarget.dataset.father;
        var list = that.data.addressList;
        //将拼接好的样式设置到当前item中
        list[father].shopArray[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
            addressList: list
        });
    }
}
function touchE(e){
    //bindtouchend
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
        //手指移动结束后触摸点位置的X坐标
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = that.data.startX - endX;
        var delBtnWidth = that.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
        //获取手指触摸的是哪一项
        var index = e.currentTarget.dataset.index;
        var father = e.currentTarget.dataset.father;
        var list = that.data.addressList;
        list[father].shopArray[index].txtStyle = txtStyle;
        //更新列表的状态
        that.setData({
            addressList: list
        });
    }
}

function loadFn(){
  var that = this;
  var token = wx.getStorageSync('token');
  console.log(token)
  console.log("456456456456456456465465456")

  if (token) {
    console.log(token + '=============5555======================')
    that.setData({
      token: token
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.shopping(token)//查询购物车

  } else {
    if (app.globalData.wxAccount == null || app.globalData.wxAccount == undefined || app.globalData.wxAccount == '' || app.globalData.wxAccount == 0) {
      wx.login({
        success: function (res) {
          console.log(res.code);
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
              if (ress.data.httpCode == 200) {
                that.init(ress.data.data);
                //that.init('o1Arv0EHcQN_xF_7tpY5xX3_2EZs')
              }

            }
          })

        },
        complete: function (res) {
          console.log(res)
        }
      });
    } else {
      that.init(app.globalData.wxAccount)
    }

  }

        //toast('大保健')
}
//删除的左划  InvaliIndex
function InvaTouchS(e) {
    //bindtouchstart
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
        this.setData({
            //记录触摸起始位置的X坐标
            startX: e.touches[0].clientX
        });
    }
}
function laVtouchM(e) {
    //bindtouchmove //触摸时触发，手指在屏幕上每移动一次，触发一次
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
        //记录触摸点位置的X坐标
        var moveX = e.touches[0].clientX;
        //计算手指起始点的X坐标与当前触摸点的X坐标的差值
        var disX = that.data.startX - moveX;
        //delBtnWidth 为右侧按钮区域的宽度
        var delBtnWidth = that.data.InvalidWidth;
        var txtStyle = "";
        if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
            txtStyle = "left:0px";
        } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
            txtStyle = "left:-" + disX + "px";
            if (disX >= delBtnWidth) {
                //控制手指移动距离最大值为删除按钮的宽度
                txtStyle = "left:-" + delBtnWidth + "px";
            }
        }
        //获取手指触摸的是哪一个item
        var index = e.currentTarget.dataset.index;
        var list = that.data.InvalidList;
        //将拼接好的样式设置到当前item中
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
            InvalidList: list
        });
    }
}
function laVtouchE(e) {
    //bindtouchend
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
        //手指移动结束后触摸点位置的X坐标
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = that.data.startX - endX;
        var delBtnWidth = that.data.InvalidWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
        //获取手指触摸的是哪一项
        var index = e.currentTarget.dataset.index;
        var list = that.data.InvalidList;
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        that.setData({
            InvalidList: list
        });
    }
}



function init(id){
  console.log(id+'-----------------------------------')
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    var that = this;
    var phoneobj = {
      weChat: id
    }
    wx.request({
        url:'https://api.joinsilk.com/Api?appCode=silkPlatform&token=&url=/pfuser/wexinLogin', //微信登陆接口
        method: 'get',
        data: phoneobj,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            if(res.data.httpCode == 200){
                var token = res.data.data;
                wx.setStorageSync('token', token)
                that.setData({
                    token: token
                })
                that.shopping(token)//查询购物车
            }else{
                wx.navigateTo({
                    url: '../userBind/userBind',
                })
                //toast('跳转到手机登陆页')
            }

        },
        fail:function(res){
            //请求失败
            toast('请求失败，错误未知！')
            that.setData({
              no_shopping: true
            })
        },
        complete:function(){
            wx.hideLoading()
        }
    })
}

function shopping(token){
  console.log("*****************************")
    var that = this;
    wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token +'&url=/orderCart/selectCart', //查询购物车
        method: 'get',
        data:{
          pageNum: 1,
          pageSize: 1000000
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (data) {
            if (data.data.httpCode == 200){
              console.log(data.data.data.resultList.length+'--------------------------------------------====');
              var lengths = data.data.data.resultList.length;
              if (lengths<= 0){
                    wx.hideLoading()
                    that.setData({
                      no_shopping: true
                    })
                    return false;
                }else{
                  var resultList = data.data.data.resultList, resultListArray = [];
                  for (let key in resultList) {
                    for (let key1 in resultList[key]) {
                      var a = {
                        shopArray: resultList[key][key1],
                        shop: {
                          id: resultList[key][key1][0].store_id,
                          name: resultList[key][key1][0].company_name,
                          isCheckbox: false,
                          src: '../images/Shopping/no_ch.png'
                        }
                      }
                      resultListArray.push(a)
                    }
                  }

                  //self_status
                  var BeOverduelist = [];
                  for (let key2 in resultListArray) {
                    for (let key3 in resultListArray[key2].shopArray) {
                      //console.log(resultListArray[key2].shopArray[key3])
                      if (!resultListArray[key2].shopArray[key3].self_status) {
                        var BeOverdue = resultListArray[key2].shopArray[key3]
                        BeOverduelist.push(BeOverdue);
                        delete resultListArray[key2].shopArray[key3];
                      }
                    }
                  }
                  var resultListArray_code = resultListArray;
                  console.log(resultListArray_code)
                  for (let key4 in resultListArray) {
                    //console.log(resultListArray[key4].shopArray.length)
                    var n = [];
                    for (let key5 = 0, l = resultListArray[key4].shopArray.length;key5<l;key5++) {
                      console.log(key4+'-----------------'+key5)
                      if (resultListArray[key4].shopArray[key5] != undefined || resultListArray[key4].shopArray[key5] != null) {
                        resultListArray[key4].shopArray[key5].src = '../images/Shopping/no_ch.png';
                        resultListArray[key4].shopArray[key5].isCheckbox = false;
                        var len = resultListArray[key4].shopArray[key5].offer_string.length;
                        console.log(len + '-----------------ff------=================ssssssssssssss')
                        if (len > 0) {
                          if (resultListArray[key4].shopArray[key5].qId != '') {
                            for (var i = 0; i < len; i++) {
                              var id = resultListArray[key4].shopArray[key5].offer_string[i].id;
                              if (id == resultListArray[key4].shopArray[key5].qId) {
                                resultListArray[key4].shopArray[key5].Code_price = resultListArray[key4].shopArray[key5].offer_string[i].price
                              }
                            }
                          } else {
                            resultListArray[key4].shopArray[key5].Code_price = resultListArray[key4].shopArray[key5].reference_price
                          }

                        } else {
                          resultListArray[key4].shopArray[key5].Code_price = resultListArray[key4].shopArray[key5].reference_price;
                        }

                        var a = resultListArray[key4].shopArray[key5];
                        n.push(a)
                      }
                    
                    }
                    resultListArray_code[key4].shopArray = n;
                  }
                  console.log('66666666666666666666666666666666666666666666666666ssssssssssssssssssssssss')
                  if (resultListArray_code.length > 0 || resultListArray_code[0].shopArray.length > 0) {
                    that.setData({
                      no_shopping: false
                    })
                  }
                  if (BeOverduelist.length > 0) {
                    //BeOverdue
                    that.setData({
                      BeOverdue: false
                    })
                  }
                  for (var i = 0; i < resultListArray_code.length; i++) {
                    for (var k = 0; k < resultListArray_code[i].shopArray.length; k++) {
                      var num = app.toDecimal(Number(resultListArray_code[i].shopArray[k].Code_price));
                      resultListArray_code[i].shopArray[k].Code_price = num;
                    }
                  }
                  that.setData({
                    addressList: resultListArray_code,
                    InvalidList: BeOverduelist
                  })

                  wx.hideLoading()
                  console.log(resultListArray_code)
                  console.log(BeOverduelist)//失效的产品、下架的产品
                  console.log(that.data.no_shopping)
                }
                console.log(data.data.data.resultList.length + '---------ssssssss-----------------------------------====');
            }else{
                //no_shopping
                that.setData({
                  no_shopping:true
                })
              wx.login({
                success: function (res) {
                  console.log(res.code);
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
                      if (ress.data.httpCode == 200) {
                        that.init(ress.data.data)
                      }

                    }
                  })

                }
              });

            }
        },
        fail:function(){
            toast('请求超时！');
            setTimeout(function(){
                wx.navigateBack({
                    delta: 1
                })
            },1000)
        },
        complete: function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }
    })
}

function toast(data){
    //调用
    app.wxToast({
        title: data
    })
}

function remove_btn(e){
    var index = e.currentTarget.dataset.index;
    var father = e.currentTarget.dataset.father;
    var that = this;
    var addressListFn = that.data.addressList;
    var cart_id = addressListFn[father].shopArray[index].cart_id;
    var isCheckbox = addressListFn[father].shopArray[index].isCheckbox

    wx.showModal({
        title: '提示',
        content: '确定删除所选商品吗？',
        confirmColor: '#6e08a8',
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定')
                var txtStyle = 'opacity:0';
                if (addressListFn[father].shopArray.length<=1){
                    addressListFn[father].txtStyle = txtStyle;
                }else{
                    addressListFn[father].shopArray[index].txtStyle = txtStyle;
                }
                that.setData({
                    addressList: addressListFn
                })
                setTimeout(function () {
                    if (cart_id != null || cart_id != undefined){
                        that.deleteShop(cart_id, isCheckbox)
                    }
                    var addressListFn_s= [];
                    if (addressListFn[father].shopArray.length <= 1) {
                        addressListFn.splice(father,1)
                    }else{
                        addressListFn[father].shopArray.splice(index, 1);
                    }
                    that.setData({
                        addressList: addressListFn
                    })
                    var shopArrayCode = false;
                    for (var i = 0; i < addressListFn.length;i++){
                        if (addressListFn[i].shopArray.length > 0) {
                            shopArrayCode = true;
                        }
                    }
                    if (!shopArrayCode){
                        that.setData({
                            no_shopping: true
                        })
                    }
                }, 300)


            } else if (res.cancel) {
                console.log('用户点击取消')
                addressListFn[father].shopArray[index].txtStyle = 'left:0px'
                console.log(addressListFn[father].shopArray[index].txtStyle)
                that.setData({
                  addressList: addressListFn
                })
            }
        },
        fail:function(res){
          //失败回调
        },
        complete:function (res){
          //无论成功或者失败都会走
          if (addressListFn[father].shopArray[index].txtStyle != 'left:0px'){
                addressListFn[father].shopArray[index].txtStyle = 'left:0px'
                that.setData({
                  addressList: addressListFn
                })
          }
          
        }
    })

}

function deleteShop(id, isCheckbox,del){
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    var that = this;
    var token = that.data.token;
    var addressList = that.data.addressList;
    var InvalidList = that.data.InvalidList;
    var idstr = '';
    if (typeof id == 'string'){
        idstr = id;
    }else{
        for(var i = 0;i<id.length;i++){
            idstr += id[i]+','
        }
        idstr = idstr.substring(0,idstr.split('').length-1);
    }

    wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/orderCart/delete', //删除购物车某个商品
        data: {
            id: idstr
        },
        method: 'get',
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            if (res.data.data && res.data.httpCode == 200){
                if (isCheckbox){
                    that.Calculation_pric();//计算选中的总价
                }
                if (del == 'delete_btn'){
                    that.setData({
                        BeOverdue:true
                    })
                    var len = addressList[0].shopArray.length;
                    if (len <= 0) {
                      that.setData({
                        no_shopping: true
                      })
                    }
                    return false;
                }
                var len = addressList[0].shopArray.length;
                if (len <= 0 && InvalidList.length<=0){
                    that.setData({
                        no_shopping: true
                    })
                }
            }else{
                toast('请求失败，请刷新重试！')
            }
        }, complete:function(){
            wx:wx.hideLoading()
        }
    })

}

function delete_btn(e){
    var that = this;
    var list = that.data.InvalidList;
    var cart_idArray = [];
    for(var i = 0; i<list.length;i++){
        if (list[i].cart_id != null){
            cart_idArray.push(list[i].cart_id)
        }
    }
    that.deleteShop(cart_idArray, false,'delete_btn')

    // 下面是删除失效的商品，单个操作
    // var index = e.target.dataset.num;
    // var that = this;
    // console.log(that);
    // var list = that.data.InvalidList;
    // wx.showModal({
    //   title: '提示',
    //   content: '确定删除所选商品吗？',
    //   confirmColor:'#6e08a8',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       var txtStyle = 'opacity:0';
    //       list[index].txtStyle = txtStyle;
    //       that.setData({
    //         InvalidList: list
    //       })
    //       setTimeout(function () {
    //         delete list[index]
    //         var listArr = [];
    //         for (var i = 0; i < list.length; i++) {
    //           if (list[i] != null || list[i] != undefined) {
    //             listArr.push(list[i])
    //           }
    //         }
    //         var BeOverdueBtn = true;
    //         if (listArr.length <= 0) {
    //           BeOverdueBtn = false
    //         }
    //         that.setData({
    //           InvalidList: listArr,
    //           BeOverdue: BeOverdueBtn
    //         })
    //       }, 300)


    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
}
function plus(e){
    //加
    var index = e.currentTarget.dataset.index;
    var father = e.currentTarget.dataset.father;
    var that = this;
    var addressListFn = that.data.addressList
    var deal_num = addressListFn[father].shopArray[index].deal_num;
    if (deal_num >= 1) {
        deal_num++;
        addressListFn[father].shopArray[index].deal_num = deal_num;
        that.setData({
            addressList: addressListFn
        });
        that.checkboxFn('', index, father);
        //that.updateDealNum(addressListFn[father].shopArray[index], father, index, true);
    }
}
function reduce(e){
    //减
    var index = e.currentTarget.dataset.index;
    var father = e.currentTarget.dataset.father;
    var that = this;
    var addressListFn = that.data.addressList
    var deal_num = addressListFn[father].shopArray[index].deal_num;
    if (deal_num>=2){
        deal_num--;
        addressListFn[father].shopArray[index].deal_num = deal_num;
        that.setData({
            addressList: addressListFn
        })
        that.checkboxFn('', index, father);
        //that.updateDealNum(addressListFn[father].shopArray[index], father, index,true);
    }
}

function updateDealNum(list ,father, index,btnC){
    wx.showLoading({
        title: '加载中',
    })
    var that = this;
    var addressListFn = that.data.addressList;
    console.log(addressListFn)
    var token = that.data.token;
    console.log(btnC, index)
    if (btnC == undefined && btnC != false){
        that.checkboxFn('', index, father);
    }
    if(token != undefined || token != null){
        var data_ = [];
        for (var i = 0; i < addressListFn.length;i++){
            for (var k = 0; k < addressListFn[i].shopArray.length;k++){
                var btn = addressListFn[i].shopArray[k].isCheckbox;
                if (btn){
                    var a = [addressListFn[i].shopArray[k].cart_id, addressListFn[i].shopArray[k].goods_id, String(addressListFn[i].shopArray[k].version), String(addressListFn[i].shopArray[k].deal_num)]
                    data_.push(a)
                }
            }
        }
        console.log(data_)
        wx.request({
            url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/orderCart/updateSelectNum', //修改数量
            method: 'get',
            data: {"Item":JSON.stringify(data_)},
            header: {
                'content-type': 'application/json'
            },
            success: function (data) {
                if(data.data.httpCode == 200){
                    var list = data.data.data;
                    console.log(list);
                    for (var i = 0; i < list.length;i++){
                        for (var k = 0; k < addressListFn.length;k++){
                            for (var l = 0; l < addressListFn[k].shopArray.length;l++){
                                if (addressListFn[k].shopArray[l].cart_id == list[i].cartId){
                                    console.log(addressListFn[k].shopArray[l])
                                    addressListFn[k].shopArray[l].version = list[i].version//qId
                                    addressListFn[k].shopArray[l].qId = list[i].qId
                                }
                            }
                        }
                    }
                    if (addressListFn[0].shopArray[0].offer_string.length>0){
                        for (var i = 0; i < addressListFn.length;i++){
                            for (var k = 0; k < addressListFn[i].shopArray.length;k++){
                                for (var l = 0;l<addressListFn[i].shopArray[k].offer_string.length;l++){
                                    if (addressListFn[i].shopArray[k].qId == addressListFn[i].shopArray[k].offer_string[l].qId){
                                        addressListFn[i].shopArray[k].Code_price = addressListFn[i].shopArray[k].offer_string[l].price
                                    }

                                }
                            }
                        }
                    }

                    // addressListFn[father].shopArray[index].version = data.data.data.versions;
                    that.setData({
                        addressList: addressListFn
                    });
                    that.Calculation_pric();//计算选中的总价
                    wx.hideLoading()
                }else{
                    wx.hideLoading()
                }

            }
        })
    }
}
function Calculation_pric(){
    //此方法专门为计算总价格而生
    var that = this;
    var addressListFn = that.data.addressList;
    //Calculation_pric_num
    var Calculation_pric_num = 0;
    for (var i = 0; i < addressListFn.length;i++){
        for (var k = 0; k < addressListFn[i].shopArray.length;k++){
            if (addressListFn[i].shopArray[k].isCheckbox){
                Calculation_pric_num += Number(addressListFn[i].shopArray[k].Code_price) * Number(addressListFn[i].shopArray[k].deal_num)
            }
        }
    }
    Calculation_pric_num = Calculation_pric_num.toFixed(2);
    that.setData({
        Calculation_pric_num: Calculation_pric_num
    })
}

function Settlement(){
    var that = this;
    // TjAjax1(that.data.token, app.globalData.wxAccount);
    var addressListFn = that.data.addressList;
    var code = [];
    for (var i = 0; i < addressListFn.length; i++) {
        for (var k = 0; k < addressListFn[i].shopArray.length; k++) {
            if (addressListFn[i].shopArray[k].isCheckbox) {
                code.push(addressListFn[i].shopArray[k])
            }
        }
    }
    if(code.length<=0){
        toast('请先选择商品哦')
    }else if(code.length>0){
        //有选中的商品
        var codeArray = [];


        Array.prototype.unique = function () {
            var res = [];
            var json = {};
            for (var i = 0; i < this.length; i++) {
                if (!json[this[i].goods_id]) {
                    var a = {
                        goods_id: this[i].goods_id,
                        deal_num: this[i].deal_num,
                        cart_id: this[i].cart_id,
                        order_minimum: this[i].order_minimum
                    }
                    res.push(a);
                    json[this[i].goods_id] = 1;
                }else{
                    var a = {
                        goods_id: this[i].goods_id,
                        deal_num: this[i].deal_num,
                        cart_id: this[i].cart_id,
                        order_minimum: this[i].order_minimum
                    }
                    codeArray.push(a)
                }
            }
            return res;
        }
        var codeArr = code.unique();
        for (var i = 0; i < codeArr.length;i++){
            for (var k = 0; k < codeArray.length;k++){
                if (codeArr[i].goods_id == codeArray[k].goods_id){
                    codeArr[i].deal_num += codeArray[k].deal_num
                }
            }
        }

        var codeArrBtn = true;
        for (var i = 0; i < codeArr.length;i++){
            if (codeArr[i].deal_num < codeArr[i].order_minimum){
                codeArrBtn = false;
            }
        }

        if (!codeArrBtn){
            toast('选择的购物数量小于起批量')
        }else{
            that.SettlementAjax();
        }

    }
}

function SettlementAjax(){
    var that = this;
    var addressListFn = that.data.addressList;
    var token = that.data.token;
    var cartIdsArr = [];
    for (var i = 0; i < addressListFn.length;i++){
        for (var k = 0; k < addressListFn[i].shopArray.length;k++){
            if (addressListFn[i].shopArray[k].isCheckbox){
                //cartIdsArr += addressListFn[i].shopArray[k].cart_id+','
                cartIdsArr.push(addressListFn[i].shopArray[k].cart_id)
            }
        }
    }

    // cartIdsArr = cartIdsArr.substring(0,cartIdsArr.split('').length-1)
    wx.request({
        url: 'https://api.joinsilk.com/Api?appCode=silkPlatform&token=' + token + '&url=/pfOrder/verifyGoods', //结算
        method: 'get',
        data: {
            cartIds: cartIdsArr
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            if (res.data.data && res.data.httpCode == 200){
                //跳转到订单页
                var cartIds = '';
                for (var i = 0; i < cartIdsArr.length;i++){
                    cartIds += cartIdsArr[i]+',';
                }
                cartIds = cartIds.substring(0, cartIds.split('').length-1);
                //toast('跳转到订单页')
                wx.navigateTo({
                    url: '../submitOrder/submitOrder?cartIds=' + cartIdsArr
                })
                //
            }
        }
    })
}
function shopxFn(e) {
    //店铺跳转
    var id = e.currentTarget.dataset.shop_id;
    this.reset();
    wx.navigateTo({
        url: '../storeHome/storeHome?id=' + id
    })
}

function shop_path(e){
    //商品跳转
    var goodsid = e.currentTarget.dataset.goodid;
    this.reset();
    app.GoodShopping(goodsid)
    // wx.redirectTo({
    //     url: '../refreshto/refreshtoPage?goodsId=' + goodsid

    // })
}
function shoppingBlur(e){
    var index = e.currentTarget.dataset.index;
    var father = e.currentTarget.dataset.father;
    var that = this;
    var val = e.detail.value;
    var addressListFn = that.data.addressList;
    addressListFn[father].shopArray[index].deal_num = val;
    that.setData({
        addressList: addressListFn
    })
    that.checkboxFn('', index, father);
    //that.updateDealNum(addressListFn[father].shopArray[index], father, index,false);
}
function reset(){
  //点击商品或者店铺，如果有删除按钮未复位的，做复位操作
  var that = this;
  var addressListFn = that.data.addressList;
  var lrn = addressListFn.length;
  for (var i = 0; i < lrn;i++){
    for (var k = 0; k < addressListFn[i].shopArray.length;k++){
      if (addressListFn[i].shopArray[k].txtStyle != 'left:0px'){
        addressListFn[i].shopArray[k].txtStyle = 'left:0px'
      }
    }
  }
  that.setData({
    addressList: addressListFn
  })
}
