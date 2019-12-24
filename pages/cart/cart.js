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
    ifEdit: false,
    ifCheckAll: false,
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
    this.setData({
      goodsList: app.globalData.cartGoodsList
    })
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
    var goodsList = this.data.goodsList;
    var list = [];
    var ifCheckAll = true;
    for (var i = 0; i < goodsList.length; i++) {
      var goods = goodsList[i];
      if (goods.id === id) {
        var amoutCount = goods.specs.actualPrice * goods.amount;
        if (goods.ifSelected) {
          totalPrice = totalPrice - amoutCount;
        } else {
          totalPrice = totalPrice + amoutCount;
        }
        goods.ifSelected = !goods.ifSelected;
      }
      list.push(goods);
      if (ifCheckAll) {
        ifCheckAll = goods.ifSelected;
      }
    }
    this.setData({
      goodsList: list,
      ifCheckAll: ifCheckAll,
      totalPrice: totalPrice
    })
  },
  onClickSelectAll: function() {
    var totalPrice = this.data.totalPrice;
    totalPrice = 0.00;
    var ifCheckAll = !this.data.ifCheckAll;
    var goodsList = this.data.goodsList;
    var list = [];
    for (var i = 0; i < goodsList.length; i++) {
      var goods = goodsList[i];
      if (ifCheckAll) {
        var amoutCount = goods.specs.actualPrice * goods.amount;
        totalPrice = totalPrice + amoutCount;
      }
      goods.ifSelected = ifCheckAll;
      list.push(goods);
    }
    this.setData({
      goodsList: list,
      ifCheckAll: ifCheckAll,
      totalPrice: totalPrice
    })
  },
  editGoodsAmount: function(event) {
    var id = event.currentTarget.dataset.id;
    var op = event.currentTarget.dataset.op;
    var totalPrice = this.data.totalPrice;
    totalPrice = 0.00;
    var goodsList = this.data.goodsList;
    var list = [];
    for (var i = 0; i < goodsList.length; i++) {
      var goods = goodsList[i];
      if (goods.id === id) {
        if (op == 'add') {
          goods.amount = goods.amount < 99 ? goods.amount + 1 : 99;
        } else {
          goods.amount = goods.amount > 1 ? goods.amount - 1 : 1;
        }

      }
      if (goods.ifSelected) {
        var amoutCount = goods.specs.actualPrice * goods.amount;
        totalPrice = totalPrice + amoutCount;
      }
      list.push(goods);
    }
    this.setData({
      goodsList: list,
      totalPrice: totalPrice
    })
  },
  deleteGoods: function(event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    wx.showModal({
      title: '温馨提示',
      content: '确定删除商品【' + name + '】？',
      success(res) {
        if (res.confirm) {
          var totalPrice = that.data.totalPrice;
          totalPrice = 0.00;
          var goodsList = that.data.goodsList;
          var list = [];
          var ifCheckAll = true;
          for (var i = 0; i < goodsList.length; i++) {
            var goods = goodsList[i];
            if (goods.id === id) {

            } else {
              if (goods.ifSelected) {
                var amoutCount = goods.specs.actualPrice * goods.amount;
                totalPrice = totalPrice + amoutCount;
              }
              list.push(goods);
              if (ifCheckAll) {
                ifCheckAll = goods.ifSelected;
              }
            }
          }
          that.setData({
            goodsList: list,
            ifCheckAll: ifCheckAll,
            totalPrice: totalPrice
          })
          app.globalData.cartGoodsList = list
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
  immediateSettlement: function(){
    if (app.globalData.bindStatus){
      var goodsList = this.data.goodsList
      var list = []
      for (var i = 0; i < goodsList.length; i++){
        if (goodsList[i].ifSelected){
          list.push(goodsList[i])
        }
      }
      var json = JSON.stringify(list)
      wx.navigateTo({
        url: '/pages/cart/settlement/settlement?json=' + json,
      })
    } else {
      app.bindMobileShowModal()
    }
  }
})