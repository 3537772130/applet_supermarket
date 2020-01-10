// pages/cart/settlement/order/order.js
const app = getApp();
const utils = require('../../../../utils/appletUtil');
var index;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      lon: 120.275495927,
      lat: 31.525915299,
      orderNo: 'SDF20190107134153123456',
      gmtCreated: '2019-01-07 14:36:51',
      detailAddr: '江苏省无锡市滨湖区经贸路天竺花苑85号楼1903室',
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
    this.setData({
      order: {
        orderId: options.id
      }
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.initInfo()
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
    index = setInterval(function() {
      that.initInfo()
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
    clearInterval(index)
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
  initInfo: function() {
    var that = this
    //获取当前页面信息
    wx.request({
      url: app.globalData.path + '/api/applet/order/queryOrderInfo',
      data: {
        id: that.data.order.orderId
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
            setData(that)
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
  },
  telBusiness: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.appletInfo.telephone,
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
              id: that.data.order.orderId
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
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    wx.showLoading({
                      title: '加载中',
                      mask: true
                    })
                    that.initInfo()
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
        id: that.data.order.orderId
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
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  }
})

var setData = function(that) {
  that.setData({
    longitude: that.data.appletInfo['lon'],
    latitude: that.data.appletInfo['lat'],
    markers: [{
        id: 0,
        longitude: that.data.appletInfo['lon'],
        latitude: that.data.appletInfo['lat'],
        iconPath: '/images/location_1296db.png',
        width: 25,
        height: 25
      },
      {
        id: 1,
        longitude: that.data.order['lon'],
        latitude: that.data.order['lat'],
        iconPath: '/images/location_e5270f.png',
        width: 25,
        height: 25
      }
    ],
    points: [{
        longitude: that.data.appletInfo['lon'],
        latitude: that.data.appletInfo['lat']
      },
      {
        longitude: that.data.order['lon'],
        latitude: that.data.order['lat']
      }
    ]
  })
  utils.loadMapRoute(that, that.data.order['lon'], that.data.order['lat'])
}