// pages/cart/settlement/remark/remark.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    var that = this
    wx.getStorage({
      key: 'input_remark',
      success: function(res) {
        var remark = res.data
        if (remark = '无'){
          remark = ''
        }
        that.setData({
          remark: remark
        })
      },
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

  },
  inputRemark: function(event){
    this.setData({
      remark: event.detail.value
    })
  },
  backOrder: function(){
    var remark = this.data.remark
    if (remark === '') {
      remark = '无'
    }
    wx.setStorage({
      key: 'input_remark',
      data: remark,
    })
    wx.navigateBack({
      delta: 1
    })
  }
})