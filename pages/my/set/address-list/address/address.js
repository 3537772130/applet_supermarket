// pages/my/set/address-list/address/address.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    var info = JSON.parse(options.info)
    this.setData({
      info: info
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
  loadLocation: function(){
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          success: function(re) {
            var info = that.data.info
            info['region'] = re.address
            info['address'] = re.name
            info['lat'] = latitude
            info['lon'] = longitude
            that.setData({
              info: info
            })
          },
        })
      }
    })
  },
  chooseLabel: function(event){
    var label = parseInt(event.currentTarget.dataset.label)
    var info = this.data.info
    info['label'] = label
    this.setData({
      info: info
    })
  },
  switch1Change: function(){
    var info = this.data.info
    info['isDefault'] = !info.isDefault
    this.setData({
      info: info
    })
  }
})