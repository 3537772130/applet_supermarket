// pages/my/my.js
const app = getApp();
const utils = require('../../utils/appletUtil');
const {
  $Message
} = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageLogo: 'MY',
    userInfo: null,
    wxInfo: null,
    notice: null,
    noticeUnreadCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
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
    var that = this
    app.getClientIp()
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              // 授权登录
              utils.getAuthorization(that)
            }
          })
        } else {
          wx.redirectTo({
            url: '/pages/my/auth/auth?logo=' + app.globalData.path + app.globalData.appletInfo.appletLogo,
          })
        }
      }
    })
    // 加载小程序信息
    wx.request({
      url: app.globalData.path + '/api/applet/getAppletInfo',
      header: {
        appletCode: app.globalData.appletCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          app.globalData.appletInfo = res.data.data.info
          app.setAppletColor(that);
        }
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
  loadMerchantOrder: function (event){
    var status = event.currentTarget.dataset.status
    wx.navigateTo({
      url: '/pages/my/order/store-order/store-order?status=' + status,
    })
  },
  loadUserOrder: function (event) {
    var status = event.currentTarget.dataset.status
    wx.navigateTo({
      url: '/pages/my/order/my-order/my-order?status=' + status,
    })
  },
  loadSet: function() {
    wx.navigateTo({
      url: '/pages/my/set/set',
    })
  }
})

