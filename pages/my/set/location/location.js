// pages/my/set/location/location.js
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
  onLoad: function (options) {
    app.setAppletColor(this)
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
  loadLocation: function () {
    var that = this
    wx.showLoading({
      title: '加载地图中',
    })
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        wx.hideLoading()
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          success: function (re) {
            var appletInfo = that.data.appletInfo
            appletInfo['addressDetails'] = re.address
            appletInfo['addressSimple'] = re.name
            appletInfo['lat'] = re.latitude
            appletInfo['lon'] = re.longitude
            that.setData({
              appletInfo: appletInfo
            })
          },
        })
      }
    })
  },
  inputAddressTitle(e){
    var info = this.data.appletInfo
    info['addressSimple'] = e.detail.value
    this.setData({
      appletInfo: info
    })
  },
  subLocation(){
    var that = this
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.path + '/api/applet/setAppletAddress',
      data: {
        address: that.data.appletInfo.addressDetails,
        title: that.data.appletInfo.addressSimple,
        lat: that.data.appletInfo.lat,
        lon: that.data.appletInfo.lon
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        wx.showModal({
          title: '温馨提示',
          content: res.data.data,
          confirmText: '确定',
          confirmColor: that.data.color,
          showCancel: false,
          success() {
            if (res.data.code == '1') {
              app.globalData.appletInfo = that.data.appletInfo
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