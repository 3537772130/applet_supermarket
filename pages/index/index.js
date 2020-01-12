//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    wx.hideShareMenu()
  },
  onShow: function () {
    var that = this
    wx.showLoading({
      title: '正在跳转页面',
      mask: true
    })
    //加载小程序信息
    wx.request({
      url: app.globalData.path + '/api/applet/getAppletInfo',
      header: {
        appletCode: app.globalData.appletCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          app.globalData.appletInfo = res.data.data
          app.setAppletColor(that);
          wx.switchTab({
            url: '/pages/my/my'
          })
          // wx.navigateTo({
          //   url: '/pages/test/test'
          // })
        } else {
          wx.navigateTo({
            url: '/pages/error/error?code=' + res.data.code + '&msg=' + res.data.data,
          })
        }
      },
      fail: function () {
        wx.navigateTo({
          url: '/pages/error/error?code=-1&msg=跳转失败'
        })
      }
    })
  }
})
