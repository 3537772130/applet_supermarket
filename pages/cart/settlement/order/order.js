// pages/cart/settlement/order/order.js
const app = getApp();
const utils = require('../../../../utils/appletUtil');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      lon: 120.275495927,
      lat: 31.525915299,
      orderNo: 'SDF20190107134153123456',
      gmtModified: '2019-01-07 14:36:51',
      detailAddr: '江苏省无锡市滨湖区经贸路天竺花苑85号楼1903室',
      status: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    app.setAppletColor(this)
    this.setData({
      order: {
        id: options.id
      }
    })
    this.initInfo()
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
    var that = this
    setInterval(function() {
      that.initInfo()
    }, 10 * 1000)
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
  initInfo: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取当前页面信息
    wx.request({
      url: app.globalData.path + '/api/applet/user/order/loadOrderReadyInfo',
      data: {
        id: that.data.order.id
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function(res) {
        if (res.data.code == '1') {
          var coupon = res.data.data.coupon
          var totalPrice = that.data.goodsTotalPrice
          if (coupon) {
            totalPrice = parseFloat(that.data.goodsTotalPrice) - parseFloat(res.data.data.coupon.denomination)
          }
          that.setData({
            site: res.data.data.address,
            coupon: coupon,
            list: res.data.data.list,
            totalPrice: totalPrice
          })
          utils.loadMapDistance(that, that.data.site['lon'], that.data.site['lat'])
        }
      },
      complete: function() {
        app.hideLoading();
      }
    })
  }
})

var setData = function(that) {
  that.setData({
    longitude: that.data.appletInfo['lon'],
    latitude: that.data.appletInfo['lat'],
    markers: [{
        id: 0,
        longitude: that.data.appletInfo['lon'],
        latitude: that.data.appletInfo['lat'],
        iconPath: '/images/location_1296db.png',
        width: 25,
        height: 25
      },
      {
        id: 1,
        longitude: that.data.order['lon'],
        latitude: that.data.order['lat'],
        iconPath: '/images/location_e5270f.png',
        width: 25,
        height: 25
      }
    ],
    points: [{
        longitude: that.data.appletInfo['lon'],
        latitude: that.data.appletInfo['lat']
      },
      {
        longitude: that.data.order['lon'],
        latitude: that.data.order['lat']
      }
    ]
  })

  utils.loadMapRoute(that, that.data.order['lon'], that.data.order['lat'])
}