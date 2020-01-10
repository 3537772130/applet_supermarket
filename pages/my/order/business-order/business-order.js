// pages/my/order/delivery-order/delivery-order.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    status: 1,
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
    var status = parseInt(options.status)
    var title = ''
    switch(status){
      case 1:
        title = '待接订单列表'
      break;
      case 2:
        title = '配送订单列表'
        break;
      case 3:
        title = '完成订单列表'
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      page: 1,
      list: [],
      status: parseInt(options.status)
    })
    queryOrderList(this)
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
      this.queryCouponList()
    } else {
      this.setData({
        hide: true
      })
      var that = this
      setTimeout(function () {
        that.setData({
          hide: false
        })
      }, 2000);
    }
  }
})

var queryOrderList = function(that) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/order/querySaleOrderByBusiness',
    data: {
      orderStatus: that.data.status,
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