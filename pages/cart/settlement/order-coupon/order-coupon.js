// pages/cart/settlement/order-coupon/order-coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    queryCouponList(this, options.id)
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

  }
})

var queryCouponList = function (that, orderId) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.request({
    url: app.globalData.path + '/api/applet/user/coupon/loadUserOrderCoupon',
    data: {
      orderId: parseInt(orderId)
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function (res) {
      if (res.data.code === "1") {
        if (res.data.data.length > 0) {
          that.setData({
            list: res.data.data
          })
        } else {
          wx.navigateTo({
            url: '/pages/error/error?code=-1&msg=' + res.data.data
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