// pages/my/set/set.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appletInfo: null,
    userInfo: null
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
    app.setAppletColor(this)
    this.setData({
      isDealer: app.globalData.isDealer,
      mobile: ''
    })
    var userInfo = app.globalData.userInfo
    if (userInfo.mobile) {
      var mobile = userInfo.mobile
      this.setData({
        mobile: mobile.substring(0, 3) + '****' + mobile.substring(7, 11)
      })
    }
    if (app.globalData.isDealer) {
      var colorText = ''
      switch (app.globalData.appletInfo.systemColor) {
        case '#1afa29':
          colorText = '春绿'
          break;
        case '#1296db':
          colorText = '天蓝'
          break;
        case '#fd8403':
          colorText = '明黄'
          break;
        case '#ff6347':
          colorText = '番茄'
          break;
        case '#FF6EC7':
          colorText = '粉红'
          break;
        case '#8470FF':
          colorText = '紫蓝'
          break;
      }
      this.setData({
        colorText: colorText
      })
    }
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
  loadInfo: function(event) {
    var index = event.currentTarget.dataset.index
    var userInfo = app.globalData.userInfo
    if (!userInfo.userId && index != 1) {
      app.showModal('请先绑定手机号码')
    } else {
      var pageUrl = ''
      switch (index) {
        case '0':
          pageUrl = '/pages/my/set/info/info'
          break
        case '1':
          pageUrl = '/pages/my/set/mobile/mobile'
          break
        case '2':
          pageUrl = '/pages/my/set/pass/pass'
          break
        case '3':
          pageUrl = '/pages/my/set/address-list/address-list?isChosse=0' 
          break
        case '10':
          pageUrl = '/pages/my/set/theme/theme'
          break
        case '11':
          pageUrl = '/pages/my/set/location/location'
          break
      }
      wx.navigateTo({
        url: pageUrl
      })
    }
  }
})