//index.js
//获取应用实例
const app = getApp()
var time = 5
var index = null
var bool = true

Page({
  data: {
    advert: {
      relationImage: '',
      relationWebsite: ''
    },
    time: time,
    show: false
  },
  onLoad: function() {
    wx.hideShareMenu()
    app.getClientIp()
    this.setData({
      width: app.globalData.width,
      height: app.globalData.height,
      path: app.globalData.path,
      timestamp: app.getTimestamp()
    })
    wx.removeStorage({
      key: 'coupon_id_list',
      success: function(res) {},
    })
  },
  onShow: function() {
    if (bool) {
      loadAppletinfo(this)
    }
    wx.getStorage({
      key: 'relation_website',
      success: function(res) {
        wx.switchTab({
          url: '/pages/main/main'
        })
        wx.removeStorage({
          key: 'relation_website'
        })
      },
    })
  },
  skipTime: function() {
    clearInterval(index)
    wx.switchTab({
      url: '/pages/main/main'
      // url: '/pages/goods/classify/classify'
    })
  },
  loadAdvert: function() {
    if (this.data.advert.relationWebsite != '') {
      bool = false
      clearInterval(index)
      wx.setStorage({
        key: 'relation_website',
        data: this.data.advert.relationWebsite,
      })
      wx.redirectTo({
        url: '/pages/advert-web/advert-web',
      })
    }
  }
})

//加载小程序信息
var loadAppletinfo = function(that) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.request({
    url: app.globalData.path + '/api/applet/getAppletInfo',
    data: {
      pageLogo: 'LOAD'
    },
    header: {
      appletCode: app.globalData.appletCode
    },
    success: function(res) {
      if (res.data.code == '1') {
        var data = res.data.data
        app.globalData.appletInfo = data.info
        app.setAppletColor(that);
        app.globalData.ifActivity = true
        if (data.recommendGoodsList) {
          app.globalData.recommendGoodsList = data.recommendGoodsList
        }
        if (data.advert) {
          that.setData({
            advert: data.advert,
            show: true
          })
          index = setInterval(function() {
            time = time - 1
            that.setData({
              time: time
            })
            if (time === 0) {
              time = 5
              that.skipTime()
            }
          }, 1000)
        } else {
          that.skipTime()
        }
      } else {
        wx.navigateTo({
          url: '/pages/error/error?code=' + res.data.code + '&msg=' + res.data.data,
        })
      }
    },
    fail: function() {
      wx.navigateTo({
        url: '/pages/error/error?code=-1&msg=跳转失败'
      })
    },
    complete: function() {
      wx.hideLoading()
    }
  })
}
