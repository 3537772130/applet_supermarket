// pages/cart/settlement/order/order.js
const app = getApp();
const utils = require('../../../../utils/appletUtil');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    setInter: '',
    order: {
      id: '',
      receiverLon: '',
      receiverLat: '',
      orderNo: '',
      gmtCreated: '',
      detailAddr: '',
      status: 0
    },
    loadNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    app.setAppletColor(this)
    var order = this.data.order
    order.id = options.id
    this.setData({
      order: order,
      loadNum: 1
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    initInfo(this)
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
    var that = this
    this.data.setInter = setInterval(function() {
      console.info('定时器30秒刷新一次订单...')
      initInfo(that)
    }, 30 * 1000)
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
    console.info('销毁定时器')
    clearInterval(this.data.setInter)
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
  telBusiness: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.order.appletTelephone,
    })
  },
  cancelOrder: function() {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '确定取消订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在取消',
            mask: true
          })
          //获取当前页面信息
          wx.request({
            url: app.globalData.path + '/api/applet/order/cancelOrder',
            data: {
              id: that.data.order.id
            },
            header: {
              appletCode: app.globalData.appletCode,
              wxCode: app.globalData.userInfo.wxCode
            },
            success: function(res) {
              wx.showModal({
                title: '温馨提示',
                content: res.data.data,
                confirmText: '确定',
                confirmColor: that.data.color,
                showCancel: false,
                success() {
                  if (res.data.code == '1') {
                    console.info('销毁定时器')
                    clearInterval(that.data.setInter)
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    wx.showLoading({
                      title: '加载中',
                      mask: true
                    })
                    initInfo(that)
                  }
                }
              })
            },
            complete: function() {
              wx.hideLoading();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  signForOrder: function() {
    var that = this
    wx.showLoading({
      title: '正在签收',
      mask: true
    })
    //获取当前页面信息
    wx.request({
      url: app.globalData.path + '/api/applet/order/signForOrder',
      data: {
        id: that.data.order.id
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function(res) {
        wx.showModal({
          title: '温馨提示',
          content: res.data.data,
          confirmText: '确定',
          confirmColor: that.data.color,
          showCancel: false,
          success() {
            if (res.data.code == '1') {
              console.info('销毁定时器')
              clearInterval(that.data.setInter)
              wx.redirectTo({
                url: '/pages/my/order/my-order/details/details?orderId=' + that.data.order.id,
              })
            }
          }
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  loadDetails: function(event) {
    console.info('销毁定时器')
    clearInterval(this.data.setInter)
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/order/my-order/details/details?orderId=' + id,
    })
  }
})

var initInfo = function(that) {
  //获取当前页面信息
  wx.request({
    url: app.globalData.path + '/api/applet/order/queryOrderInfo',
    data: {
      id: that.data.order.id
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function(res) {
      if (res.data.code === '1') {
        that.setData({
          order: res.data.data
        })
        if (that.data.loadNum === 1) {
          that.data.loadNum = 2
          utils.loadMapRoute(that)
        }
      } else {
        wx.showLoading({
          title: res.data.data,
          mask: true
        })
        setTimeout(function() {
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    },
    complete: function() {
      app.hideLoading();
    }
  })
}