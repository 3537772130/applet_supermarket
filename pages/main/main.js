// pages/main/main.js
const app = getApp();
const utils = require('../../utils/appletUtil');
const pageLogo = 'MAIN'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.setNavigationBarTitle({
      title: app.globalData.appletInfo.appletName //页面标题为路由参数
    })
    var biColor = '';
    switch (app.globalData.appletInfo.systemColor) {
      case '#1afa29':
        biColor = 'top, #7CCD7C, #1afa29, #C1FFC1'
        break;
      case '#1296db':
        biColor = 'top, #6495ED, #1296db, #87CEFA'
        break;
      case '#fd8403':
        biColor = 'top, #bfbfbf, #fd8403, #FFFACD'
        break;
      case '#ff6347':
        biColor = 'top, #FF0000, #FF6347, #FFD39B'
        break;
    }
    this.setData({
      width: app.globalData.width,
      path: app.globalData.path,
      color: app.globalData.appletInfo.systemColor,
      biColor: biColor
    })
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取当前页面信息
    wx.request({
      url: app.globalData.path + '/api/applet/page/queryAppletPageInfo',
      data: {
        pageLogo: pageLogo
      },
      header: {
        appletCode: app.globalData.appletCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          var json = JSON.parse(res.data.data)
          that.setData({
            mainList: JSON.parse(res.data.data)
          })
        } else {
          wx.navigateTo({
            url: '/pages/error/error?code=' + res.data.code + '&msg=' + res.data.data
          })
        }
      },
      complete: function () {
        app.hideLoading();
      }
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
  handleChange({
    detail
  }) {
    switch (detail.key) {
      case 'tab2':
        wx.navigateTo({
          url: '/pages/main/group-buying-today/group-buying-today',
        })
        break;
      case 'tab3':
        wx.navigateTo({
          url: '/pages/main/about-seller/about-seller',
        })
        break;
    }
  },
  loadAboutSeller: function() {
    wx.navigateTo({
      url: '/pages/main/about-seller/about-seller',
    })
  },
  loadGoodsDetails: function(event) {
    var goodsId = event.currentTarget.dataset.id;
    console.log("获取到商品编号：", goodsId);
  },
  loadGoodsType: function(event) {
    wx.setStorage({
      key: 'typeId',
      data: event.currentTarget.dataset.id
    })
    wx.switchTab({
      url: '/pages/goods/classify/classify'
    })
  },
  loadGoodsDetails: function(event){
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  }
})