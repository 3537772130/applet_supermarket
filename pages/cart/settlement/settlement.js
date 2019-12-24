// pages/cart/settlement/settlement.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playType: 2,
    site: {
      id: 1,
      name: '周华虎啊哈',
      mobile: '17601301913',
      region: '上海市上海市松江区',
      address: '虬泾路899弄象屿都城48栋702室',
      label: 1,
      isDefault: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    var json = options.json
    this.setData({
      list: JSON.parse(json)
    })
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