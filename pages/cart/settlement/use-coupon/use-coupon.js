// pages/cart/settlement/coupon/coupon.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isNull: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    queryCouponList(this, options.goodsTotalPrice)
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
  chooseCoupon: function(event) {
    var index = event.currentTarget.dataset.index
    var coupon = null
    if (index >= 0){
      coupon = this.data.list[index]
    } else {
      coupon = {
        denomination: 0.00
      }
    }
      wx.setStorage({
        key: 'choose_coupon',
        data: coupon,
      })
    wx.navigateBack({
      delta: 1
    })
  }
})

var queryCouponList = function(that, goodsTotalPrice) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.request({
    url: app.globalData.path + '/api/applet/user/coupon/queryUserCouponByUse',
    data: {
      mountPrice: goodsTotalPrice
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function (res) {
      if (res.data.code === "1") {
        if (res.data.data.length > 0) {
          that.setData({
            list: res.data.data,
            isNull: false
          })
        } else {
          that.setData({
            isNull: true
          })
        }
      }
    },
    complete: function () {
      setTimeout(function () {
        wx.hideLoading();
      }, 1000);
    }
  })
}