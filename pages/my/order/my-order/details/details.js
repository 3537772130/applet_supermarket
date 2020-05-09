// pages/my/order/my-order/details/details.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    order: {
      receiverName: '',
      receiverPhone: '',
      receiverProvince: '',
      receiverCity: '',
      receiverCounty: '',
      receiverAddress: '',
      couponAmount: 0,
      freightAmount: 0,
      totalAmount: 0,
      actualAmount: 0,
      userRemark: '',
      orderStatus: -1,
      payType: 1
    },
    coupon: {},
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    this.setData({
      orderId: options.orderId
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
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.path + '/api/applet/order/queryOrderDetailsByUser',
      data: {
        orderId: parseInt(that.data.orderId)
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '1') {
          var data = res.data.data
          var specsList = data.specsList
          var saleQtyCount = 0
          for (var i = 0; i < specsList.length; i++) {
            saleQtyCount += specsList[i].goodsNumber
          }
          that.setData({
            order: data.order,
            coupon: data.coupon,
            goodsList: data.goodsList,
            specsList: specsList,
            goodsIdList: data.goodsIdList,
            saleQtyCount: saleQtyCount,
            telephone: data.telephone
          })
          if (data.order.orderStatus === 3) {
            wx.showModal({
              title: '拒绝原因',
              content: data.order.storeRemark,
              confirmText: '确定',
              confirmColor: that.data.color,
              showCancel: false
            })
          }
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.data,
            confirmText: '确定',
            confirmColor: that.data.color,
            showCancel: false,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
      }
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
  telBusiness: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.order.appletTelephone,
    })
  }, 
  loadGoodsDetails: function (event) {
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  playComment: function(event){
    var orderId = this.data.orderId
    var goodsId = event.currentTarget.dataset.id
    var goodsName = event.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/goods/comment/comment?orderId=' + orderId + '&goodsId=' + goodsId + '&goodsName=' + goodsName,
    })
  }
})