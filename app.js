//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.width = wx.getSystemInfoSync().windowWidth;
    this.globalData.height = wx.getSystemInfoSync().windowHeight;
    
  },
  globalData: {
    latitude: '',
    longitude: '',
    ipAddress: '',
    // path: 'http://192.168.0.102:8082',
    path: 'https://www.appletsite.com', 
    appletCode: 'AC20190826164605485187',
    appletInfo: null,
    userInfo: null,
    bindStatus: false,
    isDealer: false,
    width: 0,
    height: 0,
    recommendGoodsList: [],
    recommendShow: true
  },
  setAppletColor: function(that) {
    if (this.globalData.appletInfo){
      var systemColor = this.globalData.appletInfo.systemColor
      if (that) {
        that.setData({
          appletInfo: this.globalData.appletInfo,
          userInfo: this.globalData.userInfo,
          path: this.globalData.path,
          timestamp: this.getTimestamp(),
          width: this.globalData.width,
          height: this.globalData.height,
          color: systemColor
        })
      }
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: systemColor
      })
      if (that.data.pageLogo && that.data.pageLogo != ''){
        wx.setTabBarStyle({
          selectedColor: systemColor
        })
        systemColor = systemColor.substring(1, 7)
        wx.setTabBarItem({
          index: 0,
          selectedIconPath: '/images/menu/home_selected_' + systemColor + '.png'
        })
        wx.setTabBarItem({
          index: 1,
          selectedIconPath: '/images/menu/cate_selected_' + systemColor + '.png'
        })
        wx.setTabBarItem({
          index: 2,
          selectedIconPath: '/images/menu/cart_selected_' + systemColor + '.png'
        })
        wx.setTabBarItem({
          index: 3,
          selectedIconPath: '/images/menu/member_selected_' + systemColor + '.png'
        })
      }
    }
  },
  showModal: function(data) {
    wx.hideLoading()
    wx.showModal({
      title: '温馨提示',
      content: data,
      confirmText: '确定',
      confirmColor: this.globalData.appletInfo.systemColor,
      showCancel: false
    })
  },
  bindMobileShowModal: function() {
    if (this.globalData.userInfo) {
      wx.showModal({
        title: '温馨提示',
        content: '绑定手机号码才可以哟',
        confirmText: '立即绑定',
        confirmColor: this.globalData.appletInfo.systemColor,
        cancelText: '稍后再去',
        cancelColor: '#bfbfbf',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/set/mobile/mobile',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您还没有登录哟',
        confirmText: '马上登录',
        confirmColor: this.globalData.appletInfo.systemColor,
        cancelText: '我再看看',
        cancelColor: '#bfbfbf',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/my',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  hideLoading: function() {
    setTimeout(function() {
      wx.hideLoading();
    }, 2000);
  },
  getTimestamp: function(){
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
    return '?' + timestamp
  },
  getClientIp: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.globalData.latitude = res.latitude
        that.globalData.longitude = res.longitude
      }
    })
    wx.request({
      url: this.globalData.path + '/api/getClientIp',
      success: function (res) {
        try {
          // console.info('获取到客户端信息：' + res.data)
          var jsonStr = res.data
          jsonStr = jsonStr.substring(19, jsonStr.length - 1)
          var info = JSON.parse(jsonStr)
          that.globalData.ipAddress = info.cip
        } catch (e) {
          console.error(e)
        }
      }
    })
  }
})