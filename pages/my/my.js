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
    userInfo: null,
    wxInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    wx.showLoading({
      title: '加载中',
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              // 授权登录
              utils.getAuthorization(that);
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
      data: {
        appletCode: app.globalData.appletCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          app.globalData.appletInfo = res.data.data
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
  loadSet: function() {
    wx.navigateTo({
      url: '/pages/my/set/set',
    })
  }
})