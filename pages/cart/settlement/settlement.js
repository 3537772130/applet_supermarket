// pages/cart/settlement/settlement.js
const app = getApp();
const utils = require('../../../utils/appletUtil');
var idList = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType: 2, //支付方式： 1线上支付   2货到付款
    freight: 0.00,// 运费
    goodsTotalPrice: 0.00,
    totalPrice: 0.00,
    site: {},
    coupon: {
      denomination: 0.00
    },
    distance: 0,
    isSub: false,
    remark: '无'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    var idJson = options.json
    idList = JSON.parse(idJson)
    this.setData({
      goodsTotalPrice: parseFloat(options.totalPrice),
      totalPrice: parseFloat(options.totalPrice),
      freight: 0.00,
      coupon: {},
      site: {},
      isSub: false
    })
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取当前页面信息
    wx.request({
      url: app.globalData.path + '/api/applet/user/cart/loadOrderReadyInfo',
      data: {
        idJson: idJson,
        mountPrice: that.data.goodsTotalPrice
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          var coupon = res.data.data.coupon
          var totalPrice = that.data.goodsTotalPrice
          if (coupon){
            totalPrice = parseFloat(that.data.goodsTotalPrice) - parseFloat(res.data.data.coupon.denomination)
          }
          that.setData({
            site: res.data.data.address,
            coupon: coupon,
            list: res.data.data.list,
            totalPrice: totalPrice
          })
          if (that.data.site){
            utils.loadMapDistance(that, that.data.site['lon'], that.data.site['lat'])
          }
        }
      },
      complete: function () {
        app.hideLoading();
      }
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
        utils.loadMapDistance(that, that.data.site['lon'], that.data.site['lat'])
        wx.removeStorage({
          key: 'choose_site'
        })
      },
    })
    wx.getStorage({
      key: 'choose_coupon',
      success: function (res) {
        that.setData({
          coupon: res.data,
          totalPrice: parseFloat(that.data.goodsTotalPrice) - parseFloat(res.data.denomination) + parseFloat(that.data.freight)
        })
        wx.removeStorage({
          key: 'choose_coupon'
        })
      },
    })
    wx.getStorage({
      key: 'input_remark',
      success: function (res) {
        that.setData({
          remark: res.data
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
    console.info('移除了备注的缓存')
    wx.removeStorage({
      key: 'input_remark'
    })
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
  },
  chooseCoupon: function(){
    wx.navigateTo({
      url: '/pages/cart/settlement/coupon/coupon?goodsTotalPrice=' + this.data.goodsTotalPrice,
    })
  },
  loadRemark: function(){
    wx.navigateTo({
      url: '/pages/cart/settlement/remark/remark',
    })
  },
  subOrder: function(){
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var couponId = null
    if (this.data.coupon){
      couponId = this.data.coupon['id']
    }
    wx.request({
      url: app.globalData.path + '/api/applet/sale/order/create',
      method: 'POST',
      data: {
        cartIdList: idList,
        addressId: this.data.site.id,
        payType: this.data.payType,
        couponId: couponId,
        orderRemark: this.data.remark,
        distance: this.data.distance
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        if (res.data.code == 'S0000') {
          wx.showLoading({
            title: '下单成功',
            mask: true
          })
          var id = res.data.result
          updateUserCartStatus(id)
          setTimeout(function () {
            wx.hideLoading()
            wx.redirectTo({
              url: '/pages/cart/settlement/order/order?id=' + id,
            })
          }, 2000)
        } else {
          app.showModal(res.data.message)
        }
      },
      complete: function () {
        app.hideLoading();
      }
    })
  }
})

var updateUserCartStatus = function (orderId){
  wx.request({
    url: app.globalData.path + '/api/applet/order/editUserCartStatus',
    data: {
      id: orderId
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    }
  })
}

