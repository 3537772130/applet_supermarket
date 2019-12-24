// pages/my/set/theme/theme.js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  previewColor: function(event) {
    var color = event.currentTarget.dataset.color
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })
    this.setData({
      color: color
    })
  },
  subColor: function() {
    wx.showLoading({
      title: '正在提交',
    })
    var that = this
    wx.request({
      url: app.globalData.path + '/api/applet/setAppletColor',
      data: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode,
        color: that.data.color
      },
      success: function (res) {
        if (res.data.code == '1'){
          app.globalData.appletInfo.systemColor = that.data.color
        }
        wx.showModal({
          title: '温馨提示',
          content: res.data.data,
          confirmText: '确定',
          confirmColor: that.data.color,
          showCancel: false,
          success() {
            if (res.data.code == '1') {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  }
})