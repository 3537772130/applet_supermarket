// pages/cart/settlement/settlement.js
const app = getApp();
const utils = require('../../../utils/appletUtil')
const CryptoJs = require('../../../utils/CryptoJS')
var idList = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType: 1, //支付方式： 1线上支付   2货到付款
    freight: 0.00, // 运费
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
  onLoad: function(options) {
    app.setAppletColor(this)
    app.getClientIp()
    wx.hideShareMenu()
    var idJson = options.json
    idList = JSON.parse(idJson)
    this.setData({
      goodsTotalPrice: parseFloat(options.totalPrice),
      totalPrice: parseFloat(options.totalPrice),
      goodsAmount: options.totalPrice,
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
      success: function(res) {
        if (res.data.code == '1') {
          var coupon = res.data.data.coupon
          var totalPrice = that.data.goodsTotalPrice
          if (coupon) {
            totalPrice = parseFloat(that.data.goodsTotalPrice) - parseFloat(res.data.data.coupon.denomination)
          }
          that.setData({
            site: res.data.data.address,
            coupon: coupon,
            list: res.data.data.list,
            totalPrice: totalPrice
          })
          if (that.data.site) {
            utils.loadMapDistance(that, that.data.site['lon'], that.data.site['lat'])
          }
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
    var that = this
    wx.getStorage({
      key: 'choose_site',
      success: function(res) {
        that.setData({
          site: res.data
        })
        wx.removeStorage({
          key: 'choose_site'
        })
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        utils.loadMapDistance(that, that.data.site['lon'], that.data.site['lat'])
      },
    })
    wx.getStorage({
      key: 'choose_coupon',
      success: function(res) {
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
      success: function(res) {
        that.setData({
          remark: res.data
        })
      },
    })
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
    console.info('移除了备注的缓存')
    wx.removeStorage({
      key: 'input_remark'
    })
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
  loadGoodsDetails: function(event) {
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  chooseAddress: function() {
    wx.navigateTo({
      url: '/pages/my/set/address-list/address-list?isChoose=1',
    })
  },
  chooseCoupon: function() {
    var bool = true
    var list = this.data.list
    for (var i = 0; i < list.length; i++) {
      if (!list[i].ifDiscount){
        bool = false
      }
    }
    if (bool){
      wx.navigateTo({
        url: '/pages/cart/settlement/use-coupon/use-coupon?goodsTotalPrice=' + this.data.goodsTotalPrice,
      })
    } else {
      app.showModal('存在不参与优惠券商品，不可使用优惠券')
    }
  },
  loadRemark: function() {
    wx.navigateTo({
      url: '/pages/cart/settlement/remark/remark',
    })
  },
  /**
   * 第一步：预下单
   */
  subOrder: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var couponId = ''
    if (this.data.coupon) {
      couponId = this.data.coupon['id']
    }
    wx.request({
      url: app.globalData.path + '/api/applet/order/createOrder',
      method: 'POST',
      data: {
        cartIdJson: JSON.stringify(idList),
        addressIdStr: this.data.site.id,
        payTypeStr: this.data.payType,
        couponIdStr: couponId == null ? '' : couponId,
        userRemark: this.data.remark,
        distanceStr: this.data.distance
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', //post
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function(res) {
        if (res.data.code == '1') {
          var id = res.data.data
          sendPayRequest(id)
        } else {
          app.showModal(res.data.message)
        }
      },
      fail: function() {
        app.hideLoading();
      }
    })
  }
})


/**
 * 第二步：发起微信统一下单
 */
var sendPayRequest = function(orderId) {
  wx.request({
    url: app.globalData.path + '/api/applet/pay/sendWeChantUnifiedOrder',
    data: {
      id: parseInt(orderId)
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode,
      ipAddress: app.globalData.ipAddress
    },
    success: function(res) {
      if (res.data.code == '1') {
        payOrder(res.data.data, orderId)
      } else {
        app.showModal(res.data.message)
      }
    },
    fail: function() {
      app.hideLoading();
    }
  })
}

/**
 * 第三步：发起微信支付
 */
var payOrder = function(data, orderId) {
  var r = JSON.parse(CryptoJs.decrypt(data))
  console.error('解密后的信息为：', r)
  wx.requestPayment({
    timeStamp: r.timeStamp,
    nonceStr: r.nonceStr,
    package: r.packageStr,
    signType: r.signType,
    paySign: r.paySign,
    success(res) {
      updateOrderOperateStatusByPaySuccess(orderId)
    },
    fail(res) {
      updateOrderOperateStatusByPayFail(orderId)
    }
  })
}

/**
 * 第四步：支付成功，更新预下单、优惠券及购物车状态
 */
var updateOrderOperateStatusByPaySuccess = function(orderId) {
  wx.request({
    url: app.globalData.path + '/api/applet/pay/updateOrderOperateStatusByPaySuccess',
    data: {
      id: parseInt(orderId)
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function(res) {
      showModal(res.data, orderId)
    },
    fail: function() {
      app.hideLoading();
    }
  })
}

/**
 * 第五步：支付失败，更新预下单、优惠券状态
 */
var updateOrderOperateStatusByPayFail = function (orderId) {
  wx.request({
    url: app.globalData.path + '/api/applet/pay/updateOrderOperateStatusByPayFail',
    data: {
      id: parseInt(orderId)
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function (res) {
      showModal(res.data, orderId)
    },
    fail: function () {
      app.hideLoading();
    }
  })
}

/**
 * 第五步：下单结果
 */
var showModal = function(data, orderId) {
  wx.hideLoading()
  if (data.code !== '-1') {
    wx.showToast({
      title: data.data,
      icon: 'success',
      duration: 2000,
      success: function() {
        if (data.code === '0'){
          wx.redirectTo({
            url: '/pages/cart/settlement/order-coupon/order-coupon?id=' + orderId,
          })
        } else {
          wx.redirectTo({
            url: '/pages/cart/settlement/order/order?id=' + orderId,
          })
        }
      }
    })
  } else {
    wx.showModal({
      content: data.data,
      confirmText: '重新下单',
      confirmColor: '#bfbfbf',
      cancelText: '取消',
      cancelColor: app.globalData.appletInfo.systemColor,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '/pages/main/main',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
}