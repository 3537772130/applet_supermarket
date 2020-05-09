// pages/my/set/pay-test/pay-test.js
const app = getApp();
const CryptoJs = require('../../../../utils/CryptoJS')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    app.getClientIp()
    wx.hideShareMenu()
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
  sendPay: function(){
    sendPayRequest(this)
  }
})

/**
 * 发起微信支付
 */
var sendPayRequest = function (that) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/pay/sendWeChantUnifiedOrderTest',
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode,
      ipAddress: app.globalData.ipAddress
    },
    success: function (res) {
      if (res.data.code == '1') {
        var r = JSON.parse(CryptoJs.decrypt(res.data.data))
        console.error('解密后的信息为：', r)
        wx.requestPayment({
          timeStamp: r.timeStamp,
          nonceStr: r.nonceStr,
          package: r.packageStr,
          signType: r.signType,
          paySign: r.paySign,
          success(res) {
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail(res) {
            wx.showToast({
              title: '支付失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
      } else if (res.data.code === '0'){
        that.setData({
          msg: res.data.data
        })
      } else {
        app.showModal(res.data.data)
      }
    },
    fail: function (res) {
      app.hideLoading()
    }
  })
}