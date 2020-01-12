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
    pageSize: 10,
    totalCount: 0,
    isNull: false,
    hide: false
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
    this.setData({
      page: 1,
      list: []
    })
    if (app.globalData.bindStatus) {
      queryOrderList(this)
    } else {
      app.bindMobileShowModal()
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
  lower(e) {
    if (this.data.page * this.data.pageSize <= this.data.totalCount) {
      this.setData({
        page: this.data.page + 1
      })
      queryOrderList(this)
    } else {
      this.setData({
        hide: true
      })
      var that = this
      setTimeout(function() {
        that.setData({
          hide: false
        })
      }, 2000);
    }
  },
  loadDetails: function(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/cart/settlement/order/order?id=' + id,
    })
  },
  loadDetailsList: function(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/order/my-order/details/details?orderId=' + id,
    })
  }
})

var queryOrderList = function(that) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/order/querySaleOrderByUser',
    data: {
      page: that.data.page,
      pageSize: that.data.pageSize
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function(res) {
      if (res.data.code == '1') {
        var totalCount = res.data.data.totalCount
        if (totalCount > 0) {
          var list = that.data.list
          var dataSource = res.data.data.dataSource
          for (var i = 0; i < dataSource.length; i++) {
            list.push(dataSource[i])
          }
          that.setData({
            totalCount: totalCount,
            list: list,
            isNull: false
          })
        }
      } else {
        that.setData({
          isNull: true
        })
      }
    },
    complete: function() {
      app.hideLoading();
    }
  })
}