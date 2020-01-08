// pages/cart/cart.js
const app = getApp();
const {
  $Message
} = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0.00,
    cartList: [],
    ifEdit: false,
    ifCheckAll: false,
    idList: [],
    actions: [{
      name: '删除',
      color: '#fff',
      fontsize: '20',
      width: 100,
      icon: 'trash',
      background: '#ed3f14'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.setAppletColor(this)
    if (app.globalData.userInfo){
      var that = this
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.path + '/api/applet/user/cart/queryUserCartList',
        header: {
          appletCode: app.globalData.appletCode,
          wxCode: app.globalData.userInfo.wxCode
        },
        success: function (res) {
          if (res.data.code == '1') {
            var list = []
            for (var i = 0; i < res.data.data.length; i++) {
              var info = res.data.data[i]
              info['ifSelected'] = false
              list.push(info)
            }
            that.setData({
              cartList: list,
              ifCheckAll: false,
              totalPrice: 0.00
            })
          }
        },
        complete: function () {
          app.hideLoading();
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  loadMain: function() {
    wx.switchTab({
      url: '/pages/main/main',
    })
  },
  onClickEdit: function() {
    var that = this;
    that.setData({
      ifEdit: !that.data.ifEdit
    })
  },
  onClickSelect: function(event) {
    var id = event.currentTarget.dataset.id;
    var totalPrice = this.data.totalPrice
    var cartList = this.data.cartList;
    var list = [];
    var idList = []
    var ifCheckAll = true;
    for (var i = 0; i < cartList.length; i++) {
      var goods = cartList[i];
      if (goods.id === id) {
        var amoutCount = (goods.sellPrice * goods.discount / 100) * goods.amount;
        if (goods.ifSelected) {
          totalPrice = totalPrice - amoutCount;
        } else {
          totalPrice = totalPrice + amoutCount;
        }
        goods.ifSelected = !goods.ifSelected;
      }
      list.push(goods);
      if (goods.ifSelected) {
        idList.push(goods.id)
      }
      if (ifCheckAll) {
        ifCheckAll = goods.ifSelected;
      }
    }
    this.setData({
      cartList: list,
      ifCheckAll: ifCheckAll,
      totalPrice: totalPrice,
      idList: idList
    })
    console.info('当前选中的ID有：', idList)
  },
  onClickSelectAll: function() {
    var totalPrice = this.data.totalPrice;
    totalPrice = 0.00;
    var ifCheckAll = !this.data.ifCheckAll;
    var cartList = this.data.cartList;
    var list = [];
    var idList = []
    for (var i = 0; i < cartList.length; i++) {
      var goods = cartList[i];
      if (ifCheckAll) {
        var amoutCount = (goods.sellPrice * goods.discount / 100) * goods.amount;
        totalPrice = totalPrice + amoutCount;
        idList.push(goods.id)
      } else {
        idList = []
      }
      goods.ifSelected = ifCheckAll;
      list.push(goods);
    }
    this.setData({
      cartList: list,
      ifCheckAll: ifCheckAll,
      totalPrice: totalPrice,
      idList: idList
    })
    console.info('当前选中的ID有：', idList)
  },
  editGoodsAmount: function(event) {
    var id = event.currentTarget.dataset.id;
    var op = event.currentTarget.dataset.op;
    var totalPrice = this.data.totalPrice;
    totalPrice = 0.00;
    var cartList = this.data.cartList;
    var list = [];
    for (var i = 0; i < cartList.length; i++) {
      var goods = cartList[i];
      if (goods.id === id) {
        if (op == 'add') {
          goods.amount = goods.amount < 99 ? goods.amount + 1 : 99;
        } else {
          goods.amount = goods.amount > 1 ? goods.amount - 1 : 1;
        }
        wx.request({
          url: app.globalData.path + '/api/applet/user/cart/updateCartGoodsAmount',
          data: {
            id: goods.id,
            amount: goods.amount
          },
          header: {
            appletCode: app.globalData.appletCode,
            wxCode: app.globalData.userInfo.wxCode
          }
        })
      }
      if (goods.ifSelected) {
        var amoutCount = (goods.sellPrice * goods.discount / 100) * goods.amount;
        totalPrice = totalPrice + amoutCount;
      }
      list.push(goods);
    }
    this.setData({
      cartList: list,
      totalPrice: totalPrice
    })
  },
  deleteGoods: function(event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    wx.showModal({
      title: '温馨提示',
      content: '确定删除商品【' + name + '】吗？',
      success(res) {
        if (res.confirm) {
          var ifCheckAll = true;
          var totalPrice = 0.00;
          var cartList = that.data.cartList;
          var list = [];
          for (var i = 0; i < cartList.length; i++) {
            var goods = cartList[i];
            if (goods.id === id) {
              // 删除购物车商品
              wx.request({
                url: app.globalData.path + '/api/applet/user/cart/deleteUserCart',
                data: {
                  id: goods.id
                },
                header: {
                  appletCode: app.globalData.appletCode,
                  wxCode: app.globalData.userInfo.wxCode
                }
              })
            } else {
              if (goods.ifSelected) {
                var amoutCount = (goods.sellPrice * goods.discount / 100) * goods.amount;
                totalPrice = totalPrice + amoutCount;
              }
              list.push(goods);
              if (ifCheckAll) {
                ifCheckAll = goods.ifSelected;
              }
            }
          }
          var idList = that.data.idList
          var idList1 = []
          for (var k = 0; k < idList.length; k++) {
            if (id !== idList[k]) {
              idList1.push(idList[k])
            }
          }
          that.setData({
            cartList: list,
            idList: idList1,
            ifCheckAll: ifCheckAll,
            totalPrice: totalPrice
          })
          app.globalData.cartcartList = list
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  loadGoodsDetails: function(event) {
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  immediateSettlement: function() {
    if (app.globalData.bindStatus) {
      var json = JSON.stringify(this.data.idList)
      wx.navigateTo({
        url: '/pages/cart/settlement/settlement?json=' + json + '&totalPrice=' + this.data.totalPrice,
      })
    } else {
      app.bindMobileShowModal()
    }
  }
})