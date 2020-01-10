// pages/my/set/address/address.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTip:true,
    isChoose: '0', //是否可以选择： 0不可以   1可以
    actions: [{
      name: '删除',
      color: '#fff',
      fontsize: '20',
      width: 100,
      icon: 'trash',
      background: '#ed3f14'
    }],
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    this.setData({
      isChoose: options.isChoose
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    var id = setTimeout(function () {
      that.setData({
        showTip: false
      })
      clearTimeout(id)
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadAddressList()
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
  loadAddressList(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.path + '/api/applet/user/queryReceiveAddressList',
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          that.setData({
            list: res.data.data
          })
        } else {
          that.setData({
            list: []
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  loadAddress: function(event) {
    var index = parseInt(event.currentTarget.dataset.index)
    var info = index >= 0 ? JSON.stringify(this.data.list[index]) : ''
    wx.navigateTo({
      url: '/pages/my/set/address-list/address/address?info=' + info,
    })
  },
  deleteAddress:function(event){
    var that = this
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    wx.showModal({
      title: '温馨提示',
      content: '确定删除收货人为【' + name + '】的地址吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载',
          })
          wx.request({
            url: app.globalData.path + '/api/applet/user/deleteReceiveAddress',
            data: {
              id: id
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
                    that.loadAddressList()
                  }
                }
              })
            },
            complete: function () {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  chooseAddress: function (event){
    if (this.data.isChoose === '1'){
      var index = event.currentTarget.dataset.index
      var site = this.data.list[index]
      wx.setStorage({
        key: 'choose_site',
        data: site
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
})