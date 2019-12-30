// pages/cart/settlement/settlement.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playType: 2, //支付方式： 1线上支付   2货到付款
    fare: 0.00,// 运费
    goodsTotalPrice: 0.00,
    totalPrice: 0.00,
    site: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    var json = options.json
    this.setData({
      list: JSON.parse(json),
      goodsTotalPrice: parseInt(options.totalPrice),
      totalPrice: parseInt(options.totalPrice)
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
    var that = this
    wx.getStorage({
      key: 'choose_site',
      success: function(res) {
        that.setData({
          site: res.data
        })
        wx.removeStorage({
          key: 'choose_site'
        })
      },
    })
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
  loadGoodsDetails: function (event) {
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  chooseAddress: function (){
    wx.navigateTo({
      url: '/pages/my/set/address-list/address-list?isChoose=1',
    })
  }
})