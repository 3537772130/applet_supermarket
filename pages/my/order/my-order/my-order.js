// pages/my/order/my-order/my-order.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    list: [],
    page: 1,
    size: 10,
    totalCount: 0,
    isNull: false,
    hide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    this.setData({
      list: []
    })
    queryOrderList(this)
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

var queryOrderList = function(that){
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/sale/order/page',
    method: 'POST',
    data: {
      page: that.data.page,
      size: that.data.size
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function (res) {
      if (res.data.code == 'S0000') {
        var result = res.data.result
        var list = that.data.list
        var source = result.dataSource
        for (var i = 0; i < source.length; i++){
          list.push(source[i])
        }
        that.setData({
          totalCount: result.totalCount,
          list: list,
          isNull: false
        })
      } else {
        that.setData({
          isNull: true
        })
      }
    },
    complete: function () {
      app.hideLoading();
    }
  })
}