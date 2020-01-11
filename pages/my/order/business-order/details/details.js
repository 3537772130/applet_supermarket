// pages/my/order/business-order/details/details.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    status: '1',
    denialReason: '',
    order: {
      receiverPhone: ''
    },
    coupon: {},
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()

    this.setData({
      orderId: options.orderId
    })
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.path + '/api/applet/order/querySaleOrderDetailsByBusiness',
      data: {
        orderId: parseInt(that.data.orderId)
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function(res) {
        if (res.data.code == '1') {
          var data = res.data.data
          that.setData({
            order: data.order,
            coupon: data.coupon,
            list: data.list
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.data,
            confirmText: '确定',
            confirmColor: that.data.appletInfo.systemColor,
            showCancel: false,
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      complete: function() {
        app.hideLoading();
      }
    })
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
    if (this.data.status === '3'){
      var that = this
      wx.getStorage({
        key: 'input_remark',
        success: function (res) {
          var denialReason = res.data
          if (denialReason != '无'){
            that.setData({
              denialReason: denialReason
            })
            updateStatus(that, 3)
          } else {
            app.showModal('请备注拒绝的原因')
          }
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.info('移除了备注的缓存')
    wx.removeStorage({
      key: 'input_remark'
    })
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
  updateOrderStatus: function(event) {
    var status = event.currentTarget.dataset.status
    var that = this
    var content = ''
    if (status === '3') {
      this.setData({
        status: '3'
      })
      wx.navigateTo({
        url: '/pages/cart/settlement/remark/remark',
      })
    } else {
      updateStatus(that, status)
    } 
  },
  telBusiness: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.order.receiverPhone,
    })
  }
})

var updateStatus = function (that, status){
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/order/updateOrderByBusiness',
    data: {
      id: parseInt(that.data.orderId),
      status: parseInt(status),
      remark: that.data.denialReason
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
        confirmColor: that.data.appletInfo.systemColor,
        showCancel: false,
        success: function () {
          if (res.data.code === '1') {
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