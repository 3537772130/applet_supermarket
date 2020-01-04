// pages/cart/settlement/settlement.js
const app = getApp();
var idJson = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playType: 2, //支付方式： 1线上支付   2货到付款
    fare: 0.00,// 运费
    goodsTotalPrice: 0.00,
    totalPrice: 0.00,
    site: {},
    coupon: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    idJson = options.json
    this.setData({
      goodsTotalPrice: parseFloat(options.totalPrice),
      totalPrice: parseFloat(options.totalPrice),
      fare: 0.00,
      coupon: {},
      site: {}
    })
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取当前页面信息
    wx.request({
      url: app.globalData.path + '/api/applet/user/order/loadOrderReadyInfo',
      data: {
        idJson: idJson,
        mountPrice: that.data.goodsTotalPrice
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          var coupon = res.data.data.coupon
          var totalPrice = that.data.goodsTotalPrice
          if (coupon){
            totalPrice = parseFloat(that.data.goodsTotalPrice) - parseFloat(res.data.data.coupon.denomination)
          }
          that.setData({
            site: res.data.data.address,
            coupon: coupon,
            list: res.data.data.list,
            totalPrice: totalPrice
          })
        }
      },
      complete: function () {
        app.hideLoading();
      }
    })
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
    var that = this
    wx.getStorage({
      key: 'choose_site',
      success: function(res) {
        that.setData({
          site: res.data
        })
        wx.removeStorage({
          key: 'choose_site'
        })
      },
    })
    wx.getStorage({
      key: 'choose_coupon',
      success: function (res) {
        that.setData({
          coupon: res.data,
          totalPrice: parseFloat(that.data.goodsTotalPrice) - parseFloat(res.data.denomination)
        })
        wx.removeStorage({
          key: 'choose_coupon'
        })
      },
    })
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

  },
  loadGoodsDetails: function (event) {
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  chooseAddress: function (){
    wx.navigateTo({
      url: '/pages/my/set/address-list/address-list?isChoose=1',
    })
  },
  chooseCoupon: function(){
    wx.navigateTo({
      url: '/pages/cart/settlement/coupon/coupon?goodsTotalPrice=' + this.data.goodsTotalPrice,
    })
  }
})